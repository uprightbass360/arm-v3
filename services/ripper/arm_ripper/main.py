import asyncio
import logging
import ssl
from collections.abc import Awaitable, Callable
from pathlib import Path

import httpx

from arm_common import DriveMediaStatus, JobStatus, configure_service_logging
from arm_ripper.backend_client import BackendClient, JobView
from arm_ripper.config import settings
from arm_ripper.drive_poll import DriveState, InsertDetector, read_drive_status
from arm_ripper.drive_resolve import resolve_drive_device
from arm_ripper.drive_status import probe_drive_media
from arm_ripper.job_controller import JobController
from arm_ripper.makemkv_key import refresh_makemkv_key
from arm_ripper.recovery import boot_probe
from arm_ripper.scan.makemkv import probe_makemkv_key
from arm_ripper.source import is_iso_source
from arm_ripper.ws_client import WSClient

CA_BUNDLE_PATH = "/etc/ssl/certs/ca-certificates.crt"

RIPPER_VERSION = "0.0.0-skeleton"

# Heartbeat carries the current CDROM_DRIVE_STATUS reading to the
# backend so the manual-trigger endpoint can refuse clicks made
# against an empty / open tray. 30s gives a click-time check that's
# at most ~30s stale; a stale heartbeat (older than the backend's
# freshness window) falls back to "unknown" and the request is
# allowed through to identify (which will fail visibly).
HEARTBEAT_INTERVAL_SECONDS = 30.0

# Each ripper container owns one optical drive — name the log file by the
# device basename so multiple ripper containers (sr0, sr1, ...) don't
# collide on the shared `./logs` host volume.
configure_service_logging(f"arm-ripper-{Path(settings.ARM_DRIVE_DEV).name}", level=settings.ARM_LOG_LEVEL)
logger = logging.getLogger("arm_ripper")


async def register_with_retry(client: BackendClient, device_path: str) -> str:
    delay = 1.0
    while True:
        try:
            drive = await client.register(
                hostname=settings.HOSTNAME,
                device_path=device_path,
                ripper_version=RIPPER_VERSION,
                serial=settings.ARM_DRIVE_SERIAL or None,
            )
            logger.info("registered drive_id=%s device=%s", drive.id, device_path)
            return drive.id
        except (httpx.HTTPError, OSError) as exc:
            logger.warning("register failed (%s); retrying in %.1fs", exc, delay)
            await asyncio.sleep(delay)
            delay = min(delay * 2, 30.0)


# AWAITING_REVIEW is intentionally excluded: recovery for review-gated discs is
# owned by the boot probe + the review-countdown auto-start path. Picking up an
# AWAITING_REVIEW job here would call controller.pickup → _run_rip → rip_start,
# which transitions straight to RIPPING and bypasses the countdown, manual_pause,
# and global ripping_paused. Only re-acquire IDENTIFIED (the resolve-after-timeout
# seated disc — Defect-1's target) and RIPPING (harmless restart race).
_RIP_READY = frozenset({JobStatus.IDENTIFIED, JobStatus.RIPPING})


async def maybe_reacquire_current_job(
    controller: JobController,
    *,
    get_current_job: Callable[[str], Awaitable[JobView | None]],
    drive_id: str,
    device_path: str,
    seated: bool,
) -> None:
    """Idle re-probe: if the ripper is idle with a disc seated, ask the backend
    for the drive's current non-terminal job. If it's rip-ready (operator
    resolved it after our in-memory wait timed out), pick it up. Pull-based, so
    it survives a backend restart and the 30-min ceiling."""
    if not seated or not controller.is_idle():
        return
    try:
        job = await get_current_job(drive_id)
    except (httpx.HTTPError, OSError) as exc:
        logger.warning("current-job reprobe failed: %s", exc)
        return
    if job is None or job.status not in _RIP_READY:
        return
    logger.info("reacquiring current job %s status=%s via heartbeat reprobe", job.id, job.status.value)
    await controller.pickup(job, device_path)


async def heartbeat_loop(client: BackendClient, drive_id: str, device_path: str, controller: JobController) -> None:
    """Post the current media status to the backend every
    HEARTBEAT_INTERVAL_SECONDS. Errors are logged + swallowed —
    the heartbeat is best-effort and stale rows fall back to
    "unknown" on the manual-trigger pre-check.

    For ISO sources we skip the SCSI ioctl (it fails on regular files)
    and report `loaded` unconditionally — the source is always present
    by construction in manual-trigger mode.

    After each successful heartbeat, maybe_reacquire_current_job checks
    whether the idle ripper should re-acquire a rip-ready job from the
    backend (handles the case where the in-memory wait timed out or the
    backend restarted while a disc was seated).
    """
    while True:
        try:
            if is_iso_source(device_path):
                status = DriveMediaStatus.LOADED
            else:
                status, _ = probe_drive_media(device_path)
            await client.heartbeat(drive_id=drive_id, media_status=status)
            await maybe_reacquire_current_job(
                controller,
                get_current_job=client.get_current_job,
                drive_id=drive_id,
                device_path=device_path,
                seated=(status == DriveMediaStatus.LOADED),
            )
        except (httpx.HTTPError, OSError) as exc:
            logger.warning("heartbeat failed: %s", exc)
        await asyncio.sleep(HEARTBEAT_INTERVAL_SECONDS)


def makemkv_key_changed(*, prev: str | None, current: str | None) -> bool:
    """True when the effective makemkv key changed (treats blank as None)."""

    def _norm(v: str | None) -> str | None:
        return (v or "").strip() or None

    return _norm(prev) != _norm(current)


async def makemkv_keycheck_loop(client: BackendClient) -> None:
    """Probe makemkv key-validity on key-change + daily, report to the backend.
    Best-effort: errors are logged + swallowed (mirrors heartbeat_loop)."""
    last_key: str | None = None
    first = True
    while True:
        try:
            cfg = await client.get_ripper_config()
            key = cfg.makemkv_key
            if first or makemkv_key_changed(prev=last_key, current=key):
                # Write settings.conf with the current key BEFORE probing, so the
                # probe checks the key actually on disk. (Single call — do not
                # double-invoke refresh_makemkv_key.)
                await refresh_makemkv_key(key=key)
            state, detail = await probe_makemkv_key(key)
            await client.report_makemkv_key_status(state=state, detail=detail)
            last_key = key
            first = False
        except (httpx.HTTPError, OSError) as exc:
            logger.warning("makemkv keycheck failed: %s", exc)
        except Exception:  # noqa: BLE001 — keycheck is best-effort; never let it kill the loop
            logger.exception("makemkv keycheck: unexpected error")
        await asyncio.sleep(settings.MAKEMKV_KEYCHECK_INTERVAL_SECONDS)


async def poll_loop(controller: JobController) -> None:
    detector = InsertDetector(not_ready_rearm_polls=settings.ARM_NOT_READY_REARM_POLLS)
    last_state: DriveState | None = None
    active_task: asyncio.Task[None] | None = None
    last_device: str | None = None
    drive_available = True
    while True:
        # Re-resolve every poll rather than once at startup: with the drive
        # exposed via the host /dev bind (not a create-time `devices:` bind),
        # a replugged drive reappears — possibly under a new srN — while this
        # process keeps running. Cheap: a readlink over /dev/disk/by-id.
        device = resolve_drive_device(settings.ARM_DRIVE_DEV, settings.ARM_DRIVE_SERIAL)
        if device != last_device:
            if last_device is not None:
                logger.info("drive node moved %s -> %s (serial=%s)", last_device, device, settings.ARM_DRIVE_SERIAL)
            last_device = device

        try:
            state = read_drive_status(device)
            if not drive_available:
                logger.info("drive device back: %s", device)
                drive_available = True
        except FileNotFoundError:
            # Drive unplugged. Log the transition only: the poll runs every
            # POLL_INTERVAL_SECONDS, so warning per-tick buries the journal
            # (~43k lines overnight) for a condition that is one event.
            if drive_available:
                logger.warning("drive device absent: %s — polling until it returns", device)
                drive_available = False
            state = DriveState.NO_INFO
        except OSError as exc:
            # Any other ioctl failure is per-poll noise worth seeing (a wedged
            # drive, EIO on a dying disc); keep the original behaviour.
            logger.warning("ioctl failed: %s", exc)
            state = DriveState.NO_INFO

        if state != last_state:
            logger.info("drive state %s -> %s", last_state, state)
            last_state = state

        if active_task is not None and active_task.done():
            active_task = None

        # detector.update() must run every poll to track the NOT_READY
        # streak; only act on the True edge when no rip is already running.
        if detector.update(state) and active_task is None:
            # Hand the pipeline the node we just polled, not the configured
            # one — they differ after a renumbering replug.
            active_task = asyncio.create_task(controller.handle_disc_inserted(device))

        await asyncio.sleep(settings.POLL_INTERVAL_SECONDS)


def _ws_url_from_backend_url(base: str) -> str:
    if base.startswith("https://"):
        return "wss://" + base[len("https://") :].rstrip("/") + "/ws"
    if base.startswith("http://"):
        return "ws://" + base[len("http://") :].rstrip("/") + "/ws"
    return base.rstrip("/") + "/ws"


async def amain() -> None:
    client = BackendClient(
        settings.ARM_BACKEND_URL,
        settings.ARM_SERVICE_TOKEN,
        hostname=settings.HOSTNAME,
    )
    ssl_ctx = ssl.create_default_context(cafile=CA_BUNDLE_PATH)
    ws_url = _ws_url_from_backend_url(settings.ARM_BACKEND_URL)
    # In ISO mode the device_path is the ISO file; everything downstream
    # (register, JobController, heartbeat) sees it as the bound device.
    # Boot probe is also skipped — there's no crashed rip to recover.
    iso_path = settings.ARM_MANUAL_TRIGGER_ISO
    iso_mode = iso_path is not None
    # Register under the node the drive currently occupies (serial-resolved),
    # so the backend's Drive row matches what we will actually open. The
    # service's own identity/log name stays keyed to the configured srN.
    device_path: str = (
        iso_path if iso_path is not None else resolve_drive_device(settings.ARM_DRIVE_DEV, settings.ARM_DRIVE_SERIAL)
    )
    try:
        drive_id = await register_with_retry(client, device_path)
        async with WSClient(
            ws_url,
            settings.ARM_SERVICE_TOKEN,
            hostname=settings.HOSTNAME,
            ssl_context=ssl_ctx,
        ) as ws:
            controller = JobController(
                client,
                drive_id,
                ws=ws,
                device_path=device_path,
                default_min_length_seconds=settings.ARM_MIN_LENGTH_SECONDS,
            )
            await ws.subscribe(f"ripper.commands.{drive_id}", controller.on_ws_command)
            if not iso_mode:
                # Phase 9 — recover a crashed in-flight rip on this drive, if any.
                # Logs + swallows all errors so a misbehaving probe never blocks boot.
                try:
                    await boot_probe(client, drive_id, device_path, controller)
                except Exception as exc:  # noqa: BLE001
                    logger.exception("boot probe failed: %s", exc)
            heartbeat_task = asyncio.create_task(heartbeat_loop(client, drive_id, device_path, controller))
            keycheck_task = asyncio.create_task(makemkv_keycheck_loop(client))
            try:
                if iso_mode:
                    logger.info("ARM_MANUAL_TRIGGER_ISO=%s; running one-shot pipeline", device_path)
                    # handle_manual_trigger bypasses the auto_rip_on_insert
                    # config check; handle_disc_inserted would no-op when
                    # the operator has auto-rip disabled. The ISO env var
                    # IS the explicit trigger so we want the manual path.
                    await controller.handle_manual_trigger(session_id=None)
                    logger.info("manual-trigger ISO pipeline complete; idling for cancellation")
                    # Idle indefinitely so the WS stays subscribed and the
                    # container stays "up" for `docker compose ps` /
                    # `docker compose logs` observation. Operator kills the
                    # container when done inspecting.
                    await asyncio.Event().wait()
                else:
                    await poll_loop(controller)
            finally:
                heartbeat_task.cancel()
                keycheck_task.cancel()
    finally:
        await client.close()


def main() -> None:
    asyncio.run(amain())


if __name__ == "__main__":
    main()
