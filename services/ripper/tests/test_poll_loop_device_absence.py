"""poll_loop logs drive absence once per transition, not once per poll.

The drive can be unplugged for hours; at a 2s poll that is tens of thousands
of identical lines if logged per-tick. It must warn on the way out, inform on
the way back, and stay silent in between — while still polling.
"""

import os

os.environ.setdefault("ARM_DRIVE_DEV", "/dev/sr0")
os.environ.setdefault("ARM_BACKEND_URL", "https://backend")
os.environ.setdefault("ARM_SERVICE_TOKEN", "tok")

import asyncio  # noqa: E402
import logging  # noqa: E402

import pytest  # noqa: E402
from arm_ripper import main as ripper_main  # noqa: E402
from arm_ripper.drive_poll import DriveState  # noqa: E402


class _StubController:
    is_active = False

    async def handle_disc_inserted(self, device: str) -> None:  # pragma: no cover - never reached here
        raise AssertionError("no disc should be detected in these tests")


async def _run_polls(monkeypatch: pytest.MonkeyPatch, states: list[object], n_polls: int) -> None:
    """Drive poll_loop through `states` (an exception class raises it), then stop."""
    calls = {"i": 0}

    def fake_read(device: str) -> DriveState:
        i = calls["i"]
        calls["i"] += 1
        if i >= len(states):
            raise asyncio.CancelledError
        item = states[i]
        if isinstance(item, type) and issubclass(item, Exception):
            raise item(2, "No such file or directory", device)
        assert isinstance(item, DriveState)
        return item

    monkeypatch.setattr(ripper_main, "read_drive_status", fake_read)
    monkeypatch.setattr(ripper_main, "resolve_drive_device", lambda dev, serial: dev)

    async def no_sleep(_seconds: float) -> None:
        return None

    monkeypatch.setattr(ripper_main.asyncio, "sleep", no_sleep)

    with pytest.raises(asyncio.CancelledError):
        await ripper_main.poll_loop(_StubController())  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_absence_warns_once_across_many_polls(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
) -> None:
    caplog.set_level(logging.INFO, logger="arm_ripper")
    await _run_polls(monkeypatch, [FileNotFoundError] * 25, 25)

    absent = [r for r in caplog.records if "drive device absent" in r.message]
    assert len(absent) == 1, f"expected one absence warning, got {len(absent)}"


@pytest.mark.asyncio
async def test_return_is_logged_and_absence_can_warn_again(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
) -> None:
    caplog.set_level(logging.INFO, logger="arm_ripper")
    # gone, gone, back, back, gone again
    states: list[object] = [
        FileNotFoundError,
        FileNotFoundError,
        DriveState.NO_DISC,
        DriveState.NO_DISC,
        FileNotFoundError,
    ]
    await _run_polls(monkeypatch, states, len(states))

    absent = [r for r in caplog.records if "drive device absent" in r.message]
    back = [r for r in caplog.records if "drive device back" in r.message]
    assert len(absent) == 2, "each disappearance is its own transition"
    assert len(back) == 1


@pytest.mark.asyncio
async def test_other_oserrors_still_log_every_poll(
    monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
) -> None:
    """A wedged drive (EIO, not ENOENT) keeps the original per-poll warning."""

    class _EIO(OSError):
        def __init__(self, *_args: object) -> None:
            super().__init__(5, "Input/output error")

    caplog.set_level(logging.INFO, logger="arm_ripper")
    await _run_polls(monkeypatch, [_EIO] * 4, 4)

    ioctl_failures = [r for r in caplog.records if "ioctl failed" in r.message]
    assert len(ioctl_failures) == 4
