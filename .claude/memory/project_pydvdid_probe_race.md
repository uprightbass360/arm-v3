---
name: pydvdid probe race defeats Tier-24 dedupe
description: device-side CRC64 probe runs too soon after makemkvcon info → empty fingerprints → fingerprint-less identify drops disc to awaiting_user_id and mints duplicates on ripper restart
metadata:
  type: project
---

**Observed live on hifi 2026-06-27** while verifying the Tier-24 deploy.

The ripper boot re-scan minted a *fresh* `awaiting_user_id` job for the seated
MysterySuspense disc even though Tier-24's dedupe is deployed and wired
(`ripper.py:276` calls `find_reusable_job_for_disc`; deployed enums have
`awaiting_user_id` in both `PRE_RIP_JOB_STATUSES` and `NON_TERMINAL_JOB_STATUSES`).

**Root cause — NOT a Tier-24 regression.** Ripper log sequence:
```
makemkvcon info device=/dev/sr1
pydvdid compute failed device=/dev/sr1: [Errno 123] No medium found: '/dev/sr1'
discid read failed device=/dev/sr1 err=cannot read table of contents
POST .../identify "HTTP/1.1 200 OK"
```
The device-side CRC64 probe (`arm_ripper.scan.disc_probe`, pydvdid) runs in the
~2s drive-quirk settling window right after `makemkvcon info` releases the
device, when `/dev/srN` momentarily reports "no medium". So identify is
submitted with `scan.fingerprints == []`. `find_reusable_job_for_disc`
short-circuits on empty fingerprints (`if not fingerprints: return None`) — you
cannot dedupe on a fingerprint that was never computed. Result: (a) disc drops
to `awaiting_user_id` unnecessarily, (b) a ripper restart mints a DUPLICATE
even with Tier-24 deployed. Confirmed: 4 MysterySuspense jobs all carry CRC64
`be0844c6873d7462` in disc_fingerprints, yet identify went out fingerprint-less.

**Fix (Task #68):** retry-with-settle on the device-side probe — mirror the
InsertDetector settling logic in [[project_ripper_insert_detection]] so the
fingerprint is computed before identify fires. See also
[[ripper-restart-reconciliation-gap]] (Tier-24, which this race partially
defeats) and [[feedback_ripper_unprivileged_no_mount]] (why the probe is
device-side, not mount-based).

**hifi quirk noted in passing:** the compose service `armv3-ripper-sr0`
actually runs service-tag `arm-ripper-sr1` and polls `/dev/sr1` — name/device
drift on the host, single ripper. See [[hifi-server-v3-deploy]].
