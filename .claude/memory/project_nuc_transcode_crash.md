---
name: hifi NUC hard-crashes during transcode (Task #69)
description: the hifi host (N97 NUC) hard-crashes / reboots during transcode — confirmed transcode-triggered, not a UI freeze; likely the same iGPU over-claim as Task #7
metadata:
  type: project
---

**Confirmed 2026-06-28 (owner):** the hifi host — an **N97 NUC** — **hard-crashes
during transcode**. The whole machine goes down (SSH `No route to host` /
connection timeout, then a reboot), not just the UI. The earlier "UI not
refreshing / frozen" report was this crash; the connectivity *flapping* seen
during deploys (timeout → briefly reachable → no-route) is the box
crashing/rebooting under transcode load.

## What this is / isn't
- **NOT** a frontend bug (the post-rip review card / WS work were red herrings).
- **NOT** reliably reproduced on a single clean run (one post-reboot transcode of
  MysterySuspense ran to ~52% with stable load before completing) — it is
  **load/heat/duration dependent**, so a short clip may pass while a real movie
  crashes.
- It is a **host-level crash** triggered by the transcode workload on the iGPU.

## Most likely cause (ties to Task #7)
The N97's Intel iGPU + the **ARM_GPUS h265 over-claim** ([[task #7]]: QSV rc=3 on
h265) is the prime suspect — driving the iGPU past what the N97 can sustain
(QSV/onevpl libmfx-gen1.2, see [[hifi-v3-deploy]]) can hang/reset the GPU and
take the box down. Other candidates to rule out: thermal (NUC in an enclosure),
PSU/power under sustained load, or a kernel i915 GPU-hang→panic.

## Forensics (2026-06-28) — points to POWER/THERMAL, not software
- `journalctl -b -1` (the crashed boot) ends ABRUPTLY with **no kernel error
  trace** — no panic, no OOM-kill, no `i915`/`GPU HANG`, no MCE. The log just
  stops mid-routine-activity. An instant cutoff with zero kernel warning is the
  signature of a **hard power/thermal brown-out**, not a software crash (a panic
  logs a stack; OOM logs kills).
- The last meaningful line before the crash was an **`arm-transcode-*` container
  joining the docker network** — i.e. the box died the moment a transcode worker
  spun up and drew power.
- **Crash LOOP confirmed:** three reboots within ~4 min (16:08/16:10/16:11). The
  stack's `restart: unless-stopped` auto-resumes the pending transcode on each
  boot → power spike → instant cutoff → reboot. Container name suffix counted up
  (…D05 = 5th respawn).
- **Breaking the loop:** `docker compose -f docker-compose.yml -f
  docker-compose.hifi-local.yml stop` + `docker rm -f $(docker ps -aq --filter
  name=arm-transcode)`. After that the box stays up (no transcode to crash it).

## Investigation plan (when hifi is back — needs live access)
1. `journalctl -b -1 -p err` (PREVIOUS boot) for `oom`/`killed process`/`mce`/
   `i915 ... hang`/`GPU HANG`/`thermal`/`watchdog`/`panic` right before the crash.
2. `sensors` / thermal during a transcode; check NUC cooling.
3. Pin the encoder: force **CPU/software transcode** (disable QSV/ARM_GPUS) and
   run a full movie — if it no longer crashes, it's the iGPU path → fix via
   Task #7 (correct the encoder claim) before re-enabling HW transcode.
4. Consider a per-task transcode resource cap / nice/ionice, and confirm the
   ephemeral transcode container's `--device=/dev/dri` mapping isn't mis-scoped.

## Operational implication
**Do not keep piling deploys onto a box that hard-crashes on its core workload.**
Stabilize the transcode path (Task #7 / this) first. Deploys themselves are safe
(code pushes to origin land fine); the risk is verifying transcode-dependent
features on an unstable host. See [[hifi-v3-deploy]] for deploy mechanics.
