---
name: project_rc2_field_bug_report
description: Field bug report against v3.0.0-rc2 (2026-06-13). ROOT-CAUSED 2026-06-14 from full logs — a CDS_DISC_OK-but-not-data-readable race: drive ioctl reports DISC_OK, but SCSI read (makemkv/pydvdid/discid) gets "No medium found" → zero-title scan → UNKNOWN → rip-start 422-and-abandon. NOT the makemkv key (disproven). Fix = restore verify-read/retry gate before scan + graceful empty-scan handling. WS symptom not reproduced.
metadata:
  type: project
---

A user built + ran **v3.0.0-rc2** (the shipped RC, NOT the stacked-PR dev line) and hit three issues on first disc insert. Reported 2026-06-13.

**Symptom 1 — rip-start 422, rip stagnant (the blocker).** `POST /api/ripper/jobs/{id}/rip-start` returns **422** and the ripper aborts ("giving up… abandon job"). Root cause: `_DEFAULT_RIP_PRESET_BY_DISC_TYPE` in `services/backend/arm_backend/routers/ripper.py` maps only `{DVD, BLURAY, CD, DATA}` → builtin preset; it has **no entry for `DiscType.UNKNOWN`**. The scanner DOES emit `DiscType.UNKNOWN` in real failure modes (`scan/makemkv.py`, `scan/data.py`, `scan/dispatcher.py` fall back to UNKNOWN when the disc can't be classified). So an UNKNOWN-typed disc → `preset_id is None` → `422 "no default rip preset for disc_type=unknown"` → pipeline dead-ends. Identical in rc2 (ripper.py:270) and the current dev tree. The user had to "manually control start of rip". This is a design gap: an UNKNOWN disc has no graceful rip path — it should fall back (treat as DATA copy? prompt the user to classify?) rather than 422-and-abandon.

**Symptom 2 — UI WebSocket failing on the console.** Reported but not yet root-caused. Investigate the WS hub / UI WS client handshake (auth? path? TLS on 8443?).

**Symptom 3 — `ProcessLookupError` in `handle_disc_inserted()`** (`services/ripper/arm_ripper/job_controller.py:159`), "Task exception was never retrieved." ROOT-CAUSED + LINKED to Symptom 1: `handle_disc_inserted` is launched fire-and-forget in the poll loop (`main.py:97` `asyncio.create_task(...)`, never awaited — `active_task` is only tracked to avoid double-launch), so ANY unhandled exception in the pipeline surfaces as "Task exception was never retrieved." The `ProcessLookupError` itself: after the 422 abort, the eject/cleanup teardown calls `proc.kill()` (`_run_command`, job_controller.py:525) — or makemkvcon's own subprocess-cleanup finally-block — on a child that has ALREADY exited, and `kill()` on a dead PID raises `ProcessLookupError`. So: UNKNOWN disc → rip-start 422 → pipeline aborts → eject/cleanup `proc.kill()` on dead subprocess → ProcessLookupError, unretrieved because the launching task is fire-and-forget. Two fixes: (a) guard `proc.kill()` with `try/except ProcessLookupError` (cheap, correct); (b) the poll loop should attach a done-callback or await/log the task result so pipeline exceptions aren't swallowed as "never retrieved".

**Symptom 2 — UI WebSocket failing.** Backend WS endpoint is `/ws` (`ws/router.py:65`) and closes with `WS_1008_POLICY_VIOLATION reason="origin not allowed"` on a failed origin/subprotocol check (`router.py:73-80`); UI client (`services/ui/src/api/ws.ts:78`) picks `wss:`/`ws:` from `window.location.protocol`. Most likely an **origin-allowlist / reverse-proxy / TLS-on-8443** handshake mismatch in the user's deployment, NOT a code regression per se — but needs the actual browser-console WS error (close code + reason) to confirm. Could also be downstream noise if the backend was mid-restart. Ask the user for the console error text.

**ROOT CAUSE — CONFIRMED via full ripper logs (2026-06-14): a `CDS_DISC_OK`-but-not-data-readable
race. The MakeMKV key hypothesis below was WRONG — disproven by the logs.**

The ripper logs (4 consecutive different discs: Air Buddies, Despicable Me 3, The Cowboys — ALL fail
identically) show, every time:
```
makemkv key refresh: update_key: scraping monthly beta key from forum | settings.conf written  ← key FINE
makemkvcon info device=/dev/sr0
pydvdid compute failed device=/dev/sr0: [Errno 123] No medium found: '/dev/sr0'
discid read failed device=/dev/sr0 err=cannot read table of contents
POST /api/ripper/identify "200 OK"  → status=awaiting_user_id title=None   ← zero-title scan
```
plus the drive-state line **`drive state None -> 4`** = `CDS_DISC_OK` (medium reports LOADED/ready).

So: key refresh **succeeds** (no 5021/5052/5055 anywhere — kills the key hypothesis). The drive's
`CDROM_DRIVE_STATUS` ioctl reports **`DISC_OK` (4)**, the InsertDetector fires scan — but the actual
**SCSI data read** (MakeMKV `dev:/dev/sr0` AND pydvdid AND discid) returns **No medium / can't read
TOC**. `makemkvcon info` exits 0 with **zero titles**, `scan_disc` does NOT raise on zero-titles (only
on rc≠0 / MSG:5021), returns `ScanResult(titles=[], disc_type=UNKNOWN)` → identify parks
`awaiting_user_id` → user hand-resolves a title → rip-start **422** (`no default rip preset for
disc_type=unknown` OR `track selection produced zero tracks` — `routers/ripper.py`) → ripper "giving up,
abandon manually."

**This is the exact failure class the code comment in `drive_poll.py`/`drive_status.py` describes and
that a now-REMOVED mitigation guarded against:** *"Earlier versions … offered a `verify_read=True` mode
that pulled bytes from offset 0 to catch the 'drive reports CDS_DISC_OK but next SCSI read returns
NOT_READY' case. That whole class of failure [was assumed gone because the fd] stays open for the entire
rip and the verify-read path is no longer [needed]."* The user's environment proves that assumption
false: the ioctl says ready before the medium is **data**-readable, and nothing re-checks with a real
read before scanning. Single-shot scan (`job_controller._run_pipeline` calls `scan_disc` once, no
retry) → the transient not-ready read becomes a permanent UNKNOWN.

**THE FIX (ripper-side; targets wolfy RC):** restore a real-read readiness gate before scan, and/or add
a bounded retry when `scan_disc` returns zero titles on a `DISC_OK` drive (the disc IS present per ioctl
— a zero-title result there is far more likely "not data-ready yet" than "genuinely empty"). Options:
(a) re-introduce a `verify_read` (pread offset 0, retry a few × with short backoff) in the
insert→scan gate; (b) in `_run_pipeline`, if `scan_disc` yields zero titles while the drive reports
`DISC_OK`, retry the scan N× before accepting UNKNOWN; (c) BOTH, plus the graceful-422 handling (an
empty/UNKNOWN scan should surface a clear "disc unreadable / no rippable titles" job state, not a
cryptic rip-start 422-and-abandon). Also still worth doing: the cheap `proc.kill()` `ProcessLookupError`
guard (Symptom 3) and awaiting/logging the fire-and-forget pipeline task so exceptions aren't swallowed.

**Symptom 2 (UI WebSocket) — RESOLVED / not reproduced.** The ripper logs show the WS handshake
SUCCEEDING cleanly (`101 Switching Protocols`, `connection is OPEN`, `ws auth ok`, subscribe `ack`).
Symptom 2 was almost certainly transient backend-restart noise; no code fix indicated.

---

**ORIGINAL (DISPROVEN) HYPOTHESIS — kept for the record:** an **expired/unregistered MakeMKV key**.
The theory: rc2's `scan/makemkv.py` only handled `MSG:5021`, not `5052`/`5055`, so a bad key →
zero titles → UNKNOWN → 422. **Disproven:** the logs show the key refresh succeeding with no key MSGs,
and the read failures (`No medium found`/`can't read TOC`) point at a device-read race, not the key.
(The dev-tree `scan/makemkv.py` does now handle 5052/5055 — added post-B3 — but that's not the issue here.)

**Why this matters / how to apply:** the fix targets **wolfy's RC branch**, not the `feat/*` stack (this is a shipped-RC field bug, separate from the neu-port work). Switch to the appropriate wolfy branch before fixing. The 422 is the highest-priority — it blocks ripping any disc the scanner can't classify. See [[project_wolfy_pr_stack_state]] for the stack context (this bug is orthogonal to it).

---

**STATUS — FIXED 2026-06-14 on `fix/scan-disc-not-ready-retry` (off `wolfy/main`).** Ripper-side:
`JobController._scan_with_ready_retry` retries `scan_disc` when it yields zero titles while the drive
still reports `DISC_OK` (bounded: 5 attempts, 2/4/8/12s backoff, ~26s), recovering the transient settle;
checks `read_drive_status` pre- AND post-sleep to bail early if the disc is pulled; on exhaustion logs the
greppable `DISC_UNREADABLE_AFTER_RETRIES` ERROR marker. Plus the cited eject-path `proc.kill()` guarded with
`contextlib.suppress(ProcessLookupError)` (Symptom 3). Full suite green (896); spec/plan at
`../arm-ai/arm-v3/docs/superpowers/{specs,plans}/2026-06-14-scan-disc-not-ready-retry-*`.

**FOLLOW-UP (not in this PR — recorded so it isn't lost):** the same `except TimeoutError: proc.kill()`
idiom that raises `ProcessLookupError` on an already-exited child exists at **9 other ripper sites** —
`scan/makemkv.py:194,228`, `rip/makemkv_rip.py:325,552`, `rip/abcde_rip.py:176`, `rip/data_rip.py:39,47`,
`scan/data.py:25`, `makemkv_key.py:91`. This PR fixed only the cited eject path. A follow-up should guard
all of them (a shared `_kill_quietly(proc)` helper, or `contextlib.suppress(ProcessLookupError)` at each).
Also deferred (acceptable): `read_drive_status` (os.open) can raise `OSError` if the device node vanishes
mid-retry — currently propagates to the fire-and-forget pipeline task boundary by design (task ends, drive
poller re-arms); documented in the helper docstring.
