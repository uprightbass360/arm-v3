# ARM v3 PR stack defect register

Date: 2026-10-03. Tip checked against: `origin/integration/all-prs-3` @ `71129cd9bf4c646547d0e6f7879b52aa1d3b8c58` (uprightbass360/arm-v3). Scope: the 26 stacked PRs #61..#102 plus off-stack #82 and #103 on shitwolfymakes/automatic-ripping-machine, reviewed bottom-up with each PR diffed against its own base (three-dot). Every row went through a tip check; rows fixed only by a tip commit that belongs to no open PR are recorded as **open** (see D-row on tip-only commits).

Totals: 118 rows — severity S1 3, S2 6, S3 40, S4 69; status open 93, fixed-later 18, untested-needs-hardware 7. Status `untested-needs-hardware` marks a defect that is established from the code but whose live symptom needs a drive, GPU or Docker drill to confirm.

Conventions: ids `D-xxx` mirror the Automation Gap Register's `G-xx`. `Fixed in` names the lowest stack PR whose branch contains the fixing commit (computed with `git merge-base --is-ancestor` in stack order), or `tip-only <sha>` when the fix exists only on the integration branch. `Origin PR` is the PR whose diff introduces the defect; `stack` marks a stack-level row.

Baseline checks on the tip: `uv run pytest` 3619 passed / 6 skipped; ui-neu `npm run check` 0 errors, `vitest` 1934 passed. Every PR head was also checked with pytest, ruff, mypy, the OpenAPI snapshot regen + TypeScript codegen, and (where ui-neu changed) svelte-check + vitest; no PR head failed any of those, and no PR head shows OpenAPI drift.

Hygiene checks requested up front (no defect rows):
- CI runs on #89 and #90 showing `CANCELLED`: both are concurrency-cancelled duplicates. Run 36354866038 (#89) and 36354866037 (#90) were cancelled within seconds of runs 36354868063 and 36354866232 starting on the *same head SHAs* (`85f93b04`, `c01b1011`), and those sibling runs passed. Nothing to re-run; no red run exists for either head.
- `fix/parked-session-survives-rip` and `fix/rip-start-honours-session-preset` (both = commit `35ed68d8`, "keep a pre-rip session choice parked until rip-complete"): the fix is in the tip. It landed in #75 (`52ce650f`, which introduces `drain_parked_applications_after_rip`, the `no_tracks` skipped reason and the rip-complete drain). The two branches are redundant and can be deleted.
- `wolfy/v3-improvments`: see the stack-level decision row.


## Per-PR counts

| PR | Branch | Open | Fixed later | Untested (hardware) | Total |
|---|---|---|---|---|---|
| #61 | `feat/drive-lifecycle` | 3 | 2 | 0 | 5 |
| #62 | `feat/drive-lifecycle-2` | 3 | 2 | 0 | 5 |
| #64 | `feat/drive-lifecycle-3` | 1 | 4 | 2 | 7 |
| #65 | `feat/drive-lifecycle-4` | 0 | 2 | 0 | 2 |
| #66 | `feat/drive-lifecycle-6` | 4 | 2 | 0 | 6 |
| #75 | `feat/phase2-job-metadata` | 5 | 0 | 1 | 6 |
| #76 | `feat/phase3-session-routing` | 5 | 0 | 0 | 5 |
| #73 | `feat/notifications-bash-channel` | 7 | 0 | 0 | 7 |
| #74 | `chore/ui-neu-css-cleanup` | 5 | 0 | 0 | 5 |
| #81 | `feat/ws-origins-live-status` | 2 | 1 | 0 | 3 |
| #83 | `feat/setup-dev-stack-lifecycle` | 1 | 3 | 0 | 4 |
| #84 | `feat/gpu-inventory-alignment` | 7 | 0 | 1 | 8 |
| #85 | `feat/no-transcode-mode` | 3 | 0 | 1 | 4 |
| #87 | `feat/encoder-first-presets` | 3 | 1 | 1 | 5 |
| #89 | `chore/remove-vue-ui` | 2 | 0 | 0 | 2 |
| #90 | `chore/ui-neu-eslint-prettier` | 0 | 0 | 0 | 0 |
| #88 | `feat/docs-site` | 3 | 0 | 0 | 3 |
| #94 | `chore/ui-neu-ux-polish` | 2 | 0 | 0 | 2 |
| #95 | `fix/job-status-actions` | 5 | 0 | 0 | 5 |
| #96 | `fix/optional-template-tokens` | 2 | 0 | 0 | 2 |
| #97 | `feat/identity-core` | 2 | 1 | 0 | 3 |
| #98 | `feat/identity-disc-hints` | 1 | 0 | 1 | 2 |
| #99 | `feat/identity-episode-matcher` | 3 | 0 | 0 | 3 |
| #100 | `feat/identity-settings` | 4 | 0 | 0 | 4 |
| #101 | `feat/iso-source-rip` | 9 | 0 | 0 | 9 |
| #102 | `feat/first-run-setup` | 6 | 0 | 0 | 6 |
| #82 | `feat/matrix256-fingerprint` | 2 | 0 | 0 | 2 |
| #103 | `fix/pin-makemkv-1.18.4` | 1 | 0 | 0 | 1 |
| stack-level | — | 2 | 0 | 0 | 2 |

## Summary

| ID | Issue | Sev | Status | Area | Origin PR | Fixed in | Title |
|---|---|---|---|---|---|---|---|
| D-001 | [#3](https://github.com/uprightbass360/arm-v3/issues/3) | S1 | open | devtools | #61 | — | install.sh (the canonical installer) still generates rippers without `ARM_DRIVE_ID`, which #61 made a required setting — every installer-deployed ripper crash-loops at Settings() and nothing can rip. |
| D-002 | [#4](https://github.com/uprightbass360/arm-v3/issues/4) | S1 | fixed-later | backend | #64 | #65 | `/api/ripper/register` returns a body without `updated_at`; the ripper's `Drive.model_validate` raises and the container crash-loops — no enrolled drive can ever register. |
| D-003 | [#5](https://github.com/uprightbass360/arm-v3/issues/5) | S1 | open | ripper | #82 | — | Skeleton materializer trusts disc-supplied path components: a `..`/`/`-bearing filename escapes the temp root and truncates arbitrary files writable by the ripper. |
| D-004 | [#6](https://github.com/uprightbass360/arm-v3/issues/6) | S3 | open | ripper | #61 | — | Port-identity drive renumbered away from `ARM_DRIVE_DEV` flaps absent/present every two polls, re-running boot probe, device-path PATCH and `InsertDetector.reset()` each cycle. |
| D-005 | [#7](https://github.com/uprightbass360/arm-v3/issues/7) | S4 | open | ripper | #61 | — | "node outside ARM_OPTICAL_*_MAX" warning fires on every 2 s poll, contradicting the PR's log-once-per-transition design. |
| D-006 | [#8](https://github.com/uprightbass360/arm-v3/issues/8) | S4 | fixed-later | devtools | #61 | #64 | PR body claims the compose block grants the device cgroup rules; nothing in the diff wires `ARM_DRIVE_ID`/`device_cgroup_rules`/`/host-disk`, so the hotplug path is dead for every stack this PR can generate. |
| D-007 | [#9](https://github.com/uprightbass360/arm-v3/issues/9) | S4 | fixed-later | common | #61 | #62 | `DriveMediaStatus.DETACHED` comment documents backend behaviour ("derives DriveStatus.OFFLINE from this") that does not exist in this PR. |
| D-008 | [#10](https://github.com/uprightbass360/arm-v3/issues/10) | S3 | fixed-later | backend | #62 | #64 | Every ripper-served drive appears twice: the hostname-registered ENROLLED row and a scanner-created DETECTED duplicate. |
| D-009 | [#11](https://github.com/uprightbass360/arm-v3/issues/11) | S4 | fixed-later | backend | #62 | #66 | `GET /api/drives/diagnostic` reports every scanner-detected (never-enrolled) drive as unhealthy "no media-status heartbeat recorded". |
| D-010 | [#12](https://github.com/uprightbass360/arm-v3/issues/12) | S4 | open | backend | #62 | — | `POST /api/drives/rescan` "online/stale" badge counts every detected and ignored drive as stale. |
| D-011 | [#13](https://github.com/uprightbass360/arm-v3/issues/13) | S4 | open | backend | #62 | — | Stale "0029" references after the migration was renumbered to 0030. |
| D-012 | [#14](https://github.com/uprightbass360/arm-v3/issues/14) | S4 | open | backend | #62 | — | The e2e harness boots the real `DriveScanner` against the host's `/sys`, making the real-DB tier environment-dependent. |
| D-013 | [#15](https://github.com/uprightbass360/arm-v3/issues/15) | S2 | fixed-later | backend | #64 | #65 | Enroll creates the container, then 500s on `DriveView.model_validate` (expired `updated_at`); row stays `enrolled` while the UI reports failure. |
| D-014 | [#16](https://github.com/uprightbass360/arm-v3/issues/16) | S2 | fixed-later | devtools | #64 | #65 | Nothing builds `ARM_RIPPER_IMAGE` (`arm-ripper:latest`): on a compose-built install every enroll is 502 "ImageNotFound". |
| D-015 | [#17](https://github.com/uprightbass360/arm-v3/issues/17) | S2 | fixed-later | devtools | #64 | #65 | setup-dev.sh / iso-smoke.sh still launch rippers without `ARM_DRIVE_ID` (and with the removed `ARM_DRIVE_SERIAL`); every generated `arm-ripper-srN` crash-loops at Settings() and conflicts with the manager's containers. |
| D-016 | [#18](https://github.com/uprightbass360/arm-v3/issues/18) | S3 | untested-needs-hardware | backend | #64 | — | Unenroll only refuses while `RIPPING`; a job mid-scan/identify is orphaned when the manager SIGTERMs and removes its ripper. |
| D-017 | [#19](https://github.com/uprightbass360/arm-v3/issues/19) | S3 | untested-needs-hardware | backend | #64 | — | Container name/hostname is the udev short serial; two drives sharing a serial (common on USB bridges) collide and the second enroll fails with a confusing 502. |
| D-018 | [#20](https://github.com/uprightbass360/arm-v3/issues/20) | S4 | open | docs | #64 | — | Protocol doc still documents the hostname-keyed register body. |
| D-019 | [#21](https://github.com/uprightbass360/arm-v3/issues/21) | S4 | fixed-later | docs | #65 | #88 | `arm_wiki/` (synced to the GitHub wiki by `publish-wiki.yml`) still describes the per-drive `arm-ripper-srN` compose model this PR removes from setup-dev/compose template. |
| D-020 | [#22](https://github.com/uprightbass360/arm-v3/issues/22) | S4 | fixed-later | devtools | #65 | #101 | `iso-smoke.sh` leaves the borrowed drive's managed ripper stopped when the ISO ripper never came up, while its comment claims the trap fires "on every exit path … never stays paused just because a later step blew up". |
| D-021 | [#23](https://github.com/uprightbass360/arm-v3/issues/23) | S3 | open | ui-neu | #66 | — | Detected list offers "Enroll" on a drive that is not present, which the backend always refuses (409), and the row gives no presence indication. |
| D-022 | [#24](https://github.com/uprightbass360/arm-v3/issues/24) | S4 | open | ui-neu | #66 | — | "Look for issues" flags healthy rows as issues: an ignored PORT-identity drive (notes `['ignored', _PORT_NOTE]`, `healthy: true`) and any present-but-unenrolled drive (`healthy: true`, one informational note) turn the status bar to "Issues Found", contradicting the backend's `healthy` verdict and the PR-body claim. |
| D-023 | [#25](https://github.com/uprightbass360/arm-v3/issues/25) | S4 | fixed-later | ui-neu | #66 | #102 | Ignored-section toggle uses one-off text glyphs `▾`/`▸` where the shared `Glyph` component (`chevron-down` / `chevron-right`) already exists. |
| D-024 | [#26](https://github.com/uprightbass360/arm-v3/issues/26) | S4 | fixed-later | ui-neu | #66 | #74 | Diagnostic notes render an inline SVG warning path that duplicates `Glyph name="warning"`. |
| D-025 | [#27](https://github.com/uprightbass360/arm-v3/issues/27) | S4 | open | ui-neu | #66 | — | `deleteDrive()` API wrapper left dead after DriveCard's Remove button was replaced by Unenroll. |
| D-026 | [#28](https://github.com/uprightbass360/arm-v3/issues/28) | S4 | open | ui-neu | #66 | — | Unenroll uses the native `confirm()` while the same PR introduces the shared `ConfirmDialog` for the sibling destructive action (Remove Missing Drives). |
| D-027 | [#29](https://github.com/uprightbass360/arm-v3/issues/29) | S3 | open | backend | #75 | — | A partial placeholder rip (`RIPPED_PARTIAL` + `flags.unidentified`) never gets its routed session applied: rip-complete gates `after_rip` off, and resolve only runs `after_rip` for `RIPPED_AWAITING_IDENTIFY`. |
| D-028 | [#30](https://github.com/uprightbass360/arm-v3/issues/30) | S3 | untested-needs-hardware | backend | #75 | — | identify writes the ripper-supplied `pending_session_id` straight into an FK column without an existence check — a session deleted between manual trigger and identify turns identify into a 500 that the ripper retries forever. |
| D-029 | [#31](https://github.com/uprightbass360/arm-v3/issues/31) | S4 | open | docs | #75 | — | Stale migration numbers and stale "inert" / "reads metadata_json['disc']" comments left in code the PR itself changed. |
| D-030 | [#32](https://github.com/uprightbass360/arm-v3/issues/32) | S4 | open | ui-neu | #75 | — | `readJobMetadata` prefers the stale `provider_raw.arm_server.video_type` over the new authoritative `job.media_type` column, and legacy rows lose their Type/multi_title/source_type entirely. |
| D-031 | [#33](https://github.com/uprightbass360/arm-v3/issues/33) | S4 | open | migrations | #75 | — | 0032's downgrade is a no-op although its upgrade moves `artist`/`album`/`tracks` out of the top level — after `alembic downgrade 0031` the base-branch code can no longer name or list music tracks. |
| D-032 | [#34](https://github.com/uprightbass360/arm-v3/issues/34) | S4 | open | backend | #75 | — | New uncovered backend statements: resolve's `tvdb` / `musicbrainz_release` external-id overlay branches. |
| D-033 | [#35](https://github.com/uprightbass360/arm-v3/issues/35) | S3 | open | backend | #76 | — | Unidentified music CD (media_type=None, disc_type=cd) is still routed to the drive's video default; the seeded music routes never fire for it. |
| D-034 | [#36](https://github.com/uprightbass360/arm-v3/issues/36) | S3 | open | ui-neu | #76 | — | SessionRoutesCard cannot display or create a route to a compatible-but-different-media-type session the backend accepts (e.g. movie → iso-dump session, movie → tv session). |
| D-035 | [#37](https://github.com/uprightbass360/arm-v3/issues/37) | S4 | open | backend | #76 | tip-only `0048ca44` (no PR) | Three new backend statements are uncovered (100%-statement policy): factory-raise branch and old-client close guard in the SSH-rebuild path; blank-output_path skip in find_collisions. |
| D-036 | [#38](https://github.com/uprightbass360/arm-v3/issues/38) | S4 | open | docs | #76 | — | Stale migration references in model docstrings/comments after the 0034/0035 renumber and the conditional seed-marker UPDATE. |
| D-037 | [#39](https://github.com/uprightbass360/arm-v3/issues/39) | S4 | open | backend | #76 | — | Concurrent `PUT /api/session-routes` for the same `(media_type, disc_type)` turns the NULLS-NOT-DISTINCT unique violation into a 500 (acknowledged follow-up). |
| D-038 | [#40](https://github.com/uprightbass360/arm-v3/issues/40) | S2 | open | backend | #73 | — | Stored bash secret can be unmasked through PATCH with a script name that is not on disk (claimed-impossible `secret_keys` forgery). |
| D-039 | [#41](https://github.com/uprightbass360/arm-v3/issues/41) | S3 | open | backend | #73 | — | `POST /scripts/preview` with `run: true` returns script stdout/stderr/error unredacted, including stored secret values merged in via `channel_id`. |
| D-040 | [#42](https://github.com/uprightbass360/arm-v3/issues/42) | S3 | open | backend | #73 | — | Timeout kills only the `bash` process; the script's children keep running (no process group / `killpg`). |
| D-041 | [#43](https://github.com/uprightbass360/arm-v3/issues/43) | S3 | open | backend | #73 | — | A hook that exits 0 but leaves a background child holding stdout/stderr is recorded as a timeout failure. |
| D-042 | [#44](https://github.com/uprightbass360/arm-v3/issues/44) | S3 | open | backend | #73 | — | `OSError` from `create_subprocess_exec` (e.g. E2BIG from an input template with a width spec) is uncaught: 500 on preview, and the listener skips bookkeeping and the remaining bash channels for that event. |
| D-043 | [#45](https://github.com/uprightbass360/arm-v3/issues/45) | S3 | open | devtools | #73 | — | `install.sh` (the canonical installer) neither creates `scripts/` nor mounts `/scripts` into `arm-backend`, so installer-deployed stacks cannot use bash hooks without a hand-written override. |
| D-044 | [#46](https://github.com/uprightbass360/arm-v3/issues/46) | S3 | open | backend | #73 | — | An unreadable file in `/scripts` makes `GET /api/notifications/scripts` 500 for every script (PermissionError not handled). |
| D-045 | [#47](https://github.com/uprightbass360/arm-v3/issues/47) | S4 | open | devtools | #74 | — | Style lint misses `style={…}` bindings and value-less `style:prop` shorthand; the PR itself relies on the gap. |
| D-046 | [#48](https://github.com/uprightbass360/arm-v3/issues/48) | S4 | open | devtools | #74 | — | Lint is a ban-list, not the allow-list the body and the `ALLOWED` table describe; ~437 sizing/position utilities pass unchecked. |
| D-047 | [#49](https://github.com/uprightbass360/arm-v3/issues/49) | S4 | open | docs | #74 | — | `THEME_TEMPLATE.md` still requires the alias tokens this PR removed and nothing consumes. |
| D-048 | [#50](https://github.com/uprightbass360/arm-v3/issues/50) | S4 | open | docs | #74 | — | `.claude/memory/MEMORY.md` index drops the em-dash entry and omits three new memory files. |
| D-049 | [#51](https://github.com/uprightbass360/arm-v3/issues/51) | S4 | open | ui-neu | #74 | — | Markup rewrite leaves ARIA state/label attributes on role-less elements (files-page root tabs, channel-type label). |
| D-050 | [#52](https://github.com/uprightbass360/arm-v3/issues/52) | S3 | open | ui-neu | #81 | — | `wsClient.start()` during the reconnect back-off clears the "Live updates unavailable" banner with no backend change (and opens a duplicate socket). |
| D-051 | [#53](https://github.com/uprightbass360/arm-v3/issues/53) | S3 | fixed-later | devtools | #81 | #89 | Emptying the `ARM_ALLOWED_ORIGINS` default breaks WS for the Vue `arm-ui` on 8081 (the image install.sh deploys and the dev compose's 8081 service), whose nginx never forwards `X-Forwarded-Host`. |
| D-052 | [#54](https://github.com/uprightbass360/arm-v3/issues/54) | S4 | open | backend | #81 | — | Stale test docstring: "empty allowlist means service-token only" contradicts the same PR's same-origin default. |
| D-053 | [#55](https://github.com/uprightbass360/arm-v3/issues/55) | S2 | fixed-later | devtools | #83 | #85 | `setup-dev.sh up` force-removes rippers/transcoders with work in flight — a routine redeploy kills a running rip. |
| D-054 | [#56](https://github.com/uprightbass360/arm-v3/issues/56) | S3 | fixed-later | devtools | #83 | #94 | `setup-dev.sh up` removes every ripper container but nothing respawns them when compose leaves the backend running. |
| D-055 | [#57](https://github.com/uprightbass360/arm-v3/issues/57) | S3 | fixed-later | devtools | #83 | #85 | `arm-data:/data` named volume is created root-owned, so the EACCES this commit claims to fix persists. |
| D-056 | [#58](https://github.com/uprightbass360/arm-v3/issues/58) | S4 | open | docs | #83 | — | Contributor docs still tell people to use bare `docker compose up -d`, which this PR's CLAUDE.md says never to do. |
| D-057 | [#59](https://github.com/uprightbass360/arm-v3/issues/59) | S3 | untested-needs-hardware | backend | #84 | — | Removing the boot-time truncate makes orphaned BUSY GPU rows permanent: `cancel_running`'s docker-stop path (and deleting a spawned-but-unclaimed task) deletes the task row without releasing its GPU. |
| D-058 | [#60](https://github.com/uprightbass360/arm-v3/issues/60) | S3 | open | ui-neu | #84 | — | Transcoder page per-device GPU rows are fetched once on mount and never refreshed, so their busy/available state contradicts the polled summary count. |
| D-059 | [#61](https://github.com/uprightbass360/arm-v3/issues/61) | S3 | open | ui-neu | #84 | — | GpusCard never shows the "in use by a running transcode" message on a 409: it string-matches `'409'` in a message the API client has already replaced with the server `detail`. |
| D-060 | [#62](https://github.com/uprightbass360/arm-v3/issues/62) | S3 | open | backend | #84 | — | Fresh install: the config seeder creates the singleton and returns before the `max_parallel_transcodes` backfill, so the column stays NULL until the second boot; meanwhile `/api/config` reports `1` while the dispatcher uses the env value. |
| D-061 | [#63](https://github.com/uprightbass360/arm-v3/issues/63) | S4 | open | backend | #84 | — | `/api/transcodes/stats.gpus_available` counts disabled GPUs as available. |
| D-062 | [#64](https://github.com/uprightbass360/arm-v3/issues/64) | S4 | open | ui-neu | #84 | — | "Manage GPUs in Settings" links to `/settings`, which opens the Metadata tab; the GPUs card lives under `#transcoding`. |
| D-063 | [#65](https://github.com/uprightbass360/arm-v3/issues/65) | S4 | open | ui-neu | #84 | — | GPU inventory row markup (status-dot + vendor badge + mono device path + state label) is duplicated inline in GpusCard and the Transcoder page instead of a shared component. |
| D-064 | [#66](https://github.com/uprightbass360/arm-v3/issues/66) | S4 | open | devtools | #84 | — | install.sh's `.env` template and docker-compose.yml.example still tell operators to "Re-run install.sh after a GPU/driver change" — the backend now ignores `ARM_GPUS` once the table is populated. |
| D-065 | [#67](https://github.com/uprightbass360/arm-v3/issues/67) | S3 | open | backend | #85 | — | Transcode re-enable PATCH 500s when a per-job re-drain fails: `job.id` read after `rollback()` (MissingGreenlet). |
| D-066 | [#68](https://github.com/uprightbass360/arm-v3/issues/68) | S3 | untested-needs-hardware | backend | #85 | — | Cancelling an in-process passthrough task does not stop the copy: the file still lands in `/media` and the raw source is unlinked after the user deleted the task. |
| D-067 | [#69](https://github.com/uprightbass360/arm-v3/issues/69) | S3 | open | ui-neu | #85 | — | Ripper-only (`ARM_TRANSCODE_CAPABLE=false`) hides the Transcoder page and nav while the backend silently holds previously queued encode tasks forever. |
| D-068 | [#70](https://github.com/uprightbass360/arm-v3/issues/70) | S4 | open | backend | #85 | — | `GET /api/config` reports `transcode_enabled: true` on a ripper-only deployment where encode is effectively disabled. |
| D-069 | [#71](https://github.com/uprightbass360/arm-v3/issues/71) | S3 | fixed-later | ui-neu | #87 | #102 | GpusCard subscribes to `gpu.probed` without starting the WebSocket and shows no in-progress state after Re-probe, so on a directly loaded Settings page the row stays "Never probed"/stale forever. |
| D-070 | [#72](https://github.com/uprightbass360/arm-v3/issues/72) | S3 | untested-needs-hardware | backend | #87 | — | An infrastructure failure during a re-probe (container could not start, docker wait error, 120 s timeout) is written as `encoder_kinds=[]`, wiping a previously verified device so queued vendor-pinned tasks terminally fail and `any_*` work silently drops to CPU. |
| D-071 | [#73](https://github.com/uprightbass360/arm-v3/issues/73) | S3 | open | transcode | #87 | — | A `vaapi_*` (or AMD-resolved `any_*`) preset with `container=webm` passes preset validation but every task fails at run time because the ffmpeg VAAPI engine only muxes MKV/MP4. |
| D-072 | [#74](https://github.com/uprightbass360/arm-v3/issues/74) | S3 | open | devtools | #87 | — | install.sh-generated compose does not forward `ARM_TRANSCODE_IMAGE_QSV` / `_VAAPI` / `_NVENC` to the backend, so the PR's operator instruction for air-gapped/private-registry installs has no effect. |
| D-073 | [#75](https://github.com/uprightbass360/arm-v3/issues/75) | S4 | open | devtools | #87 | — | install.sh still runs the now-deprecated `--probe-encoders` container at install time; its `{}` output is discarded by the backend, so the step only costs an image pull plus up to 60 s. |
| D-074 | [#76](https://github.com/uprightbass360/arm-v3/issues/76) | S4 | open | docs | #89 | — | The docs sweep changed Settings `/config` -> `/settings` in one place but left the same wrong route in `docs/README-OMDBAPI.md`. |
| D-075 | [#77](https://github.com/uprightbass360/arm-v3/issues/77) | S4 | open | ci | #89 | — | The published `arm-ui` image no longer ships `/LICENSE`: ui-neu's Dockerfile lacks the `COPY LICENSE /LICENSE` every other image (and the removed Vue arm-ui image) has. |
| D-076 | [#78](https://github.com/uprightbass360/arm-v3/issues/78) | S4 | open | ci | #88 | — | New `site/` npm lockfile has no Dependabot coverage, unlike every other dependency manifest in the repo. |
| D-077 | [#79](https://github.com/uprightbass360/arm-v3/issues/79) | S4 | open | docs | #88 | — | `project_docs_site.md` memory (and the PR body) record the wrong stacking base: "on `feat/encoder-first-presets` (#87)" with a stack list that omits #89/#90. |
| D-078 | [#80](https://github.com/uprightbass360/arm-v3/issues/80) | S4 | open | docs | #88 | — | Former `docs/ops/` pages now published to the GitHub wiki carry relative `../../services/...` repo links that cannot resolve on the wiki. |
| D-079 | [#81](https://github.com/uprightbass360/arm-v3/issues/81) | S4 | open | ui-neu | #94 | — | `dismissAllNotifications` doc comment states the opposite of the backend behaviour this same PR introduced. |
| D-080 | [#82](https://github.com/uprightbass360/arm-v3/issues/82) | S4 | open | docs | #94 | — | Status-Roadmap describes maintenance "buttons" for orphaned log files and clearing the raw rip area that do not exist in the UI; this PR deleted their last stubs. |
| D-081 | [#83](https://github.com/uprightbass360/arm-v3/issues/83) | S3 | open | backend | #95 | — | A parked application that stays parked after rip-complete makes a `ripped` job read "Transcoding 0/0" forever (and stay live/polling). |
| D-082 | [#84](https://github.com/uprightbass360/arm-v3/issues/84) | S3 | open | ui-neu | #95 | — | Parked-session line promises "applies when the rip finishes" on failed and abandoned jobs; nothing ever cancels a parked application when the rip fails or the job is abandoned. |
| D-083 | [#85](https://github.com/uprightbass360/arm-v3/issues/85) | S4 | open | common | #95 | — | `REDRAIN_JOB_STATUSES` includes pre-rip statuses whose parked applications the redrain can never promote; every transcode re-enable logs a WARN per such row. |
| D-084 | [#86](https://github.com/uprightbass360/arm-v3/issues/86) | S4 | open | ui-neu | #95 | — | Detail-page metadata says `State: In progress` for an idle `ripped` job with no session applied. |
| D-085 | [#87](https://github.com/uprightbass360/arm-v3/issues/87) | S4 | open | ui-neu | #95 | — | `JobStatsPanel.svelte` and `JobStatsPanel.test.ts` left behind after their last consumer was removed. |
| D-086 | [#88](https://github.com/uprightbass360/arm-v3/issues/88) | S4 | open | backend | #96 | — | New `except TemplateValidationError: raise` makes the `malformed template` re-wrap branch uncovered; backend 100%-statement policy regresses. |
| D-087 | [#89](https://github.com/uprightbass360/arm-v3/issues/89) | S4 | open | docs | #96 | — | Architecture docs that `path_template.py` says it mirrors were not updated for the `{token?}` syntax or the new built-in defaults. |
| D-088 | [#90](https://github.com/uprightbass360/arm-v3/issues/90) | S3 | open | backend | #97 | — | `test_identify_repost_on_held_disc_keeps_operator_exclusion` passes without ever reaching the resolver it claims to test. |
| D-089 | [#91](https://github.com/uprightbass360/arm-v3/issues/91) | S4 | open | docs | #97 | — | `04-data-model.md` tracks section still documents `role_source` and free-text `role`; new columns undocumented. |
| D-090 | [#92](https://github.com/uprightbass360/arm-v3/issues/92) | S4 | fixed-later | backend | #97 | #99 | PR body promises `put_source` keeps last-good claims on a same-inputs error; the code is a plain overwrite. |
| D-091 | [#93](https://github.com/uprightbass360/arm-v3/issues/93) | S3 | untested-needs-hardware | ripper | #98 | tip-only `89a5cf53`+`2837d671` (no PR) | BDMT disc-title probe silently yields nothing for UDF-only Blu-ray sources (no ISO 9660 PVD) — pycdlib refuses to open them and the probe soft-fails to None. |
| D-092 | [#94](https://github.com/uprightbass360/arm-v3/issues/94) | S4 | open | backend | #98 | — | `parse_label` leaves a year token inside the "cleaned" hint title (e.g. `THE_OFFICE_2005_S1_D2` → `"the office 2005"`), so the first-searched candidate carries the year as query text and the TV search has no year filter to compensate. |
| D-093 | [#95](https://github.com/uprightbass360/arm-v3/issues/95) | S3 | open | backend | #99 | — | `/identity/match apply=true` → `invalidate()` → the rerun-once starts while the router is still computing and later overwrites the operator's stored match with a default-input recompute. |
| D-094 | [#96](https://github.com/uprightbass360/arm-v3/issues/96) | S4 | open | backend | #99 | — | Operator-supplied external ids are interpolated unescaped into provider URL paths. |
| D-095 | [#97](https://github.com/uprightbass360/arm-v3/issues/97) | S4 | open | docs | #99 | — | `02-job-lifecycle.md` still says Play-All titles are "not auto-detected" while this PR's matcher detects them (sum-of-episodes and sum-of-other-titles) and roles them `extra`. |
| D-096 | [#98](https://github.com/uprightbass360/arm-v3/issues/98) | S3 | open | ui-neu | #100 | — | Emptying an int setting now sends `null`; for `thediscdb_refresh_days` and `manual_wait_seconds` the backend has no None check, so Save ends in an unhandled NOT NULL IntegrityError (HTTP 500). |
| D-097 | [#99](https://github.com/uprightbass360/arm-v3/issues/99) | S3 | open | backend | #100 | — | Changing `episode_sources` / `disc_hint_sources` does not re-resolve existing jobs, so a disabled source's already-applied fields stay on the job until an unrelated trigger runs the resolver. |
| D-098 | [#100](https://github.com/uprightbass360/arm-v3/issues/100) | S4 | open | ui-neu | #100 | — | `RankedListField`'s "Needs <source> key" chip hardcodes the `Metadata` tab in its deep link instead of deriving it from the required key's field metadata. |
| D-099 | [#101](https://github.com/uprightbass360/arm-v3/issues/101) | S4 | open | ui-neu | #100 | — | Two recurring visual patterns are re-implemented inline instead of shared: the TV-episodes summary strip copies SessionCard's recipe strip, and the "Advanced" label copies `.session-card-recipe-label` (`feedback_standard_ui_patterns.md`: a pattern in two places is extracted). |
| D-100 | [#102](https://github.com/uprightbass360/arm-v3/issues/102) | S2 | open | ripper | #101 | — | The extract fallback (`iso_extract`) needs 7-Zip, but this PR's ripper image never installs it; every image MakeMKV cannot open fails as "no titles". |
| D-101 | [#103](https://github.com/uprightbass360/arm-v3/issues/103) | S3 | open | backend | #101 | — | An ISO (or disc folder) whose name contains `:` cannot be ripped: the bind spec docker-py builds is `host:container:mode`, so the extra colon makes the spawn fail with 500 and the drive is retired. |
| D-102 | [#104](https://github.com/uprightbass360/arm-v3/issues/104) | S4 | open | backend | #101 | — | New uncovered backend statement: `_virtual_source_drive`'s `drive_id is None` guard is unreachable from `rip_start` and has no test or pragma. |
| D-103 | [#105](https://github.com/uprightbass360/arm-v3/issues/105) | S4 | open | ripper | #101 | — | `ARM_SOURCE_KIND` is set by the backend, declared by the ripper and documented as "selects the MakeMKV source scheme", but nothing in the ripper reads it. |
| D-104 | [#106](https://github.com/uprightbass360/arm-v3/issues/106) | S4 | open | docs | #101 | — | Status-Roadmap lists "Extracted disc folders as a rip source" as "Next up" while this PR ships Rip from folder. |
| D-105 | [#107](https://github.com/uprightbass360/arm-v3/issues/107) | S4 | open | docs | #101 | — | Configuring-ARM recommends a relative `ARM_HOST_ISO_LIBRARY_PATH` ("e.g. `./iso-library`") that the backend deliberately treats as "not configured". |
| D-106 | [#108](https://github.com/uprightbass360/arm-v3/issues/108) | S4 | open | ui-neu | #101 | — | IsoPicker re-implements byte formatting inline instead of using the shared `formatBytes` helper. |
| D-107 | [#109](https://github.com/uprightbass360/arm-v3/issues/109) | S4 | open | ui-neu | #101 | — | The picker's "not configured" card tells every operator to redeploy with `bash devtools/setup-dev.sh up`, a dev-only script. |
| D-108 | [#110](https://github.com/uprightbass360/arm-v3/issues/110) | S4 | open | ripper | #101 | — | `_scan_extracted` removes a multi-GB extraction with a synchronous `shutil.rmtree` on the event loop. |
| D-109 | [#111](https://github.com/uprightbass360/arm-v3/issues/111) | S3 | open | ui-neu | #102 | — | MakeMKV step records done/attention from a config snapshot taken before the key was entered or verified. |
| D-110 | [#112](https://github.com/uprightbass360/arm-v3/issues/112) | S4 | open | docs | #102 | — | Docs and Finish summary written in this PR describe a guest-access choice on step 1 that the same PR removed. |
| D-111 | [#113](https://github.com/uprightbass360/arm-v3/issues/113) | S4 | open | backend | #102 | — | Public `/api/setup/status` exposes the ARM version unauthenticated although the UI never reads it and `/api/system/version` is JWT-gated. |
| D-112 | [#114](https://github.com/uprightbass360/arm-v3/issues/114) | S4 | open | backend | #102 | — | After "Run setup again", resuming from `/setup` lands on the Finish step, not the first step. |
| D-113 | [#115](https://github.com/uprightbass360/arm-v3/issues/115) | S4 | open | ui-neu | #102 | — | nginx comment for the `/docs-data/` 404 rule now sits above the new `/arm-ca.crt` block. |
| D-114 | [#116](https://github.com/uprightbass360/arm-v3/issues/116) | S4 | open | ripper | #102 | — | `backend_client.py` reads `ARM_DRIVE_ID` straight from `os.environ` instead of the ripper's `settings.ARM_DRIVE_ID` every other module uses. |
| D-115 | [#117](https://github.com/uprightbass360/arm-v3/issues/117) | S4 | open | common | #82 | — | `DiscFingerprintInput` docstring still calls matrix256 "ARM-native" (and omits `thediscdb`) although the PR body claims the schema comment was updated. |
| D-116 | [#118](https://github.com/uprightbass360/arm-v3/issues/118) | S4 | open | docs | #103 | — | `docs/ops/makemkv.md` "What the install scripts do" still says the script "Scrapes the current MakeMKV version" after this PR makes a pinned version the default. |
| D-117 | [#119](https://github.com/uprightbass360/arm-v3/issues/119) | S3 | open | ci | stack | — | The integration tip carries 30 commits that are in no open PR; merging the 27 PRs does not reproduce the tested tip. |
| D-118 | [#120](https://github.com/uprightbass360/arm-v3/issues/120) | S4 | open | ci | stack | — | `wolfy/v3-improvments` (upstream only) carries 89 commits of v2-era UI/model work that exist nowhere in the stack; keep-or-kill decision needed. |

## Detail

### D-001  S1  open  devtools  origin #61

**Title.** install.sh (the canonical installer) still generates rippers without `ARM_DRIVE_ID`, which #61 made a required setting — every installer-deployed ripper crash-loops at Settings() and nothing can rip.

**Where.** `install.sh:1262-1290` (`emit_ripper_block`: environment lists only `ARM_DRIVE_DEV`, `ARM_BACKEND_URL`, `ARM_SERVICE_TOKEN`, `ARM_LOG_LEVEL`, `PUID`, `PGID`, `CDROM_GID`; `devices:` binds, no `/dev/disk:/host-disk:ro`, no `ARM_RIPPER_IMAGE` for the backend) at `71129cd9`, unchanged since `main`; the requirement is `services/ripper/arm_ripper/config.py:22` `ARM_DRIVE_ID: str` introduced in `325c4f9d` ("feat(ripper): drive identity settings + device-path/get-drive client calls", PR #61).

**What.** `arm_ripper.config.settings = Settings()` runs at import; with `ARM_DRIVE_ID` unset pydantic raises a `ValidationError`, the container exits and `restart: unless-stopped` loops it forever (`services/ripper/tests/test_config_drive_identity.py::test_drive_id_is_required` pins the raise). The installer is the source of truth for deployment values (memory `feedback_ui_port_8081.md`), and the stack's drive-lifecycle model moved ripper creation into the backend (`ripper_manager`), but no PR in the stack rewrites `install.sh`: #65 only documents it (`docs/developers/architecture/06-deployment.md:271` "install.sh predates the drive-lifecycle model and still emits per-drive services; it is scheduled for a rewrite before release"). An operator who runs `install.sh` from the merged stack gets a backend that cannot enrol (no `arm-ripper` image reference, no backend-managed spawn path) plus N crash-looping legacy rippers. Only `devtools/setup-dev.sh` works.

**Repro / evidence.**

```
$ git show origin/integration/all-prs-3:install.sh | sed -n '1262,1290p' | grep -c ARM_DRIVE_ID   # 0
$ git show origin/integration/all-prs-3:services/ripper/arm_ripper/config.py | grep -n 'ARM_DRIVE_ID: str'   # 22
$ bash install.sh on any host, then: docker compose ps   # armv3-ripper-srN restarting; logs: ValidationError ARM_DRIVE_ID Field required
```

**Tip check.** Still present at `71129cd9`: `install.sh:1262-1290` (`emit_ripper_block` unchanged; `ARM_HOST_ISO_LIBRARY_PATH` was added to the backend env by #101 but the ripper block was not touched). No PR and no straggler rewrites the installer. Independently flagged by the #61, #64 and #65 reviewers; recorded once here.

**Suggested fix location.** feat/drive-lifecycle (#61) — the PR that made `ARM_DRIVE_ID` required must either keep a `ARM_DRIVE_DEV`-only fallback or update `install.sh` (drop `emit_ripper_block`, add the build-only/pulled `arm-ripper` image reference and `ARM_RIPPER_IMAGE` so the backend-managed spawn works). Alternatively a dedicated installer-rewrite PR must merge before or with the stack.

**Verification.** Code read of the installer heredoc and the ripper Settings at the tip (zero-infra). End-to-end: `bash install.sh` on a Linux host with one optical drive, then `docker compose logs armv3-ripper-sr0` — untested-needs-hardware.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/3

### D-002  S1  fixed-later  backend  origin #64

**Title.** `/api/ripper/register` returns a body without `updated_at`; the ripper's `Drive.model_validate` raises and the container crash-loops — no enrolled drive can ever register.

**Where.** `services/backend/arm_backend/routers/ripper.py:328-336` at `5f4b3d6a` (head `1be121d8`): `session.add(drive); await session.commit(); … return drive`.

**What.** `drives.updated_at` is `onupdate=func.now()` (server-generated, `packages/arm_common/arm_common/models/_columns.py:98-104`). After the UPDATE flush the attribute is expired even with `expire_on_commit=False`; FastAPI serialises the ORM row with the key missing. The ripper does `Drive.model_validate(r.json())` (`services/ripper/arm_ripper/backend_client.py:71`), where `updated_at` is required (see the comment in `services/ripper/tests/test_backend_client_drive.py::test_get_drive_parses_a_drive`), so `register_with_retry` raises `ValidationError` (not `httpx.HTTPError`/`RegisterRefused`) out of `amain()` → process exit → `restart: unless-stopped` loop. The previous code re-selected the row after the upsert, so this is a regression introduced here.

**Repro / evidence.** Ad-hoc e2e test (real-DB SQLite harness, `app_client` fixture): seed `Drive(id="drv_e2e", lifecycle=ENROLLED)`, `POST /api/ripper/register` with `Bearer tok-service` →
```
REGISTER 200 {"id":"drv_e2e",…,"created_at":"2026-10-02T23:14:23","sysfs_port":null,"status":"online"}   # no "updated_at" key
Drive.model_validate(body) -> pydantic ValidationError (updated_at missing)
```
FakeSession never expires attributes, so the tier-1 `test_register_*` tests cannot see it.

**Tip check.** Fixed by #65 (`feat/drive-lifecycle-4`) in `2a0600eb` ("refresh drive rows after commit before serialising them": adds `await session.refresh(drive)` before `return drive`, tip `routers/ripper.py:525`). `git branch -r --contains 2a0600eb` → origin/feat/drive-lifecycle-4 (not a straggler). Recommend: **move down** — #64 merged alone ships a ripper that can never register.

**Suggested fix location.** feat/drive-lifecycle-3 — cherry-pick the ripper.py hunk of `2a0600eb` (and add a real-DB e2e register test; none exists).

**Verification.** Reproduced on the e2e harness at head as above; fix commit read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/4

### D-003  S1  open  ripper  origin #82

**Title.** Skeleton materializer trusts disc-supplied path components: a `..`/`/`-bearing filename escapes the temp root and truncates arbitrary files writable by the ripper.

**Where.** `services/ripper/arm_ripper/scan/matrix256_fp.py:65-68` at `132c5d23` (`target = root / relative` → `target.touch()` → `os.truncate(target, size)`).

**What.** `fingerprint_records` materialises a sparse skeleton of the disc tree by doing `target = root / relative; target.touch(); os.truncate(target, size)` for every (path, size) record pycdlib enumerated, with no containment check. pycdlib passes UDF/Rock Ridge names through verbatim, so a crafted disc or ISO whose file name is `..`-bearing or contains `/` escapes the temp root and truncates any file the `arm` user can write (`/raw` rips in progress, `/media`, config). The reviewer's PoC reproduced this (victim file 1000 -> 0 bytes, digest returned normally). Reclassified S1 by the coordinator: this is data loss driven by untrusted input, and #101 adds a library of operator-supplied ISO files as a rip source, which widens the input surface; the tip's 7-Zip fallback (`udf_image.py`, straggler `89a5cf53`) feeds the same function.

**Repro / evidence.** Run with the PR's venv (`cd services/ripper && ../../.venv/bin/python poc.py`):
```python
import os, tempfile, pathlib
from arm_ripper.scan.matrix256_fp import fingerprint_records
victim_dir = tempfile.mkdtemp(prefix="arm-victim-"); victim = pathlib.Path(victim_dir) / "title_t00.mkv"
victim.write_bytes(b"x" * 1000)
fingerprint_records([(f"../{os.path.basename(victim_dir)}/title_t00.mkv", 0), ("BDMV/index.bdmv", 5)])
print(victim.stat().st_size)   # -> 0  (was 1000); digest is returned normally, no error
```
Observed output: `victim size after: 0 (was 1000)`. Severity note: data loss + crafted-input security per the brief would read S1; held at S2 because it needs hostile media (a crafted ISO in the ISO library or a burned disc) — the operator-supplied ISO library is exactly such an input surface.

**Tip check.** Still present at `71129cd9`: `services/ripper/arm_ripper/scan/matrix256_fp.py:65-68` is byte-identical (the tip's `89a5cf53` changed only `probe_matrix256`). The tip makes it *wider*: the 7-Zip fallback `udf_image.list_files` feeds `path.replace("\\", "/").lstrip("/")` records (`scan/udf_image.py:66`) into the same `fingerprint_records`. Not fixed on main (file does not exist there) nor on the tip.

**Suggested fix location.** feat/matrix256-fingerprint (#82) — the materializer is introduced here; a containment check in `fingerprint_records` fixes both the pycdlib and the later 7z record sources.

**Verification.** Reproduced locally with the PoC above against the PR head's venv (no hardware needed).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/5

### D-004  S3  open  ripper  origin #61

**Title.** Port-identity drive renumbered away from `ARM_DRIVE_DEV` flaps absent/present every two polls, re-running boot probe, device-path PATCH and `InsertDetector.reset()` each cycle.

**Where.** `services/ripper/arm_ripper/main.py:197-205` (`_current_hint`) and `:244-246` (`poll_loop` hint selection) at `fc3dd30e` (refresh the port-identity hint on real absence, and throttle it); head `8141a6c9`.

**What.** With `ARM_DRIVE_BY_ID` unset, `_current_hint` returns the backend's `Drive.device_path` only on a tick whose *previous* state was ABSENT; the very next tick (`absent=False`) returns the static `settings.ARM_DRIVE_DEV` again. If the drive now lives at a different node (e.g. backend says `/dev/sr2`, config says `/dev/sr0`, and `/sys/class/block/sr0` is gone), tick k resolves sr2 → "reattached" → `detector.reset()` → `_report_node` → `_on_reattached`/`boot_probe`; tick k+1 resolves sr0 → None → "drive absent"; tick k+2 refreshes again → "reattached" … forever (period = 2 × POLL_INTERVAL = 4 s). Each cycle logs a WARNING + INFO, PATCHes the backend, runs `boot_probe`, and re-arms the detector so a seated DISC_OK disc starts a new `handle_disc_inserted` pipeline every time the previous one finishes. Expected: once the backend-supplied hint resolves, keep using it (e.g. remember the last hint that resolved, or have `_current_hint` fall back to the last-resolved node rather than `ARM_DRIVE_DEV`).

**Repro / evidence.** `uv run python scratchpad/pr61_flap_repro.py` (fake resolve: `/dev/sr2` iff hint == `/dev/sr2`, else None; backend `get_drive` → `/dev/sr2`; status DISC_OK; 12 ticks):
```
ticks=12 absent_warnings=6 present_infos=6 boot_probes=6 rips_started=6 device_path_patches=6 get_drive_calls=6
  drive absent (by_id=None) — polling until it returns
  drive present at /dev/sr2 via hint (reattached)
  boot probe after reattach on /dev/sr2
  drive absent (by_id=None) — polling until it returns
  drive present at /dev/sr2 via hint (reattached)   ... (repeats every 2 ticks)
```
The existing test `test_port_identity_refreshes_hint_from_backend_while_absent` only asserts the hint was *passed* once and ends the script on the tick it resolves, so it cannot see the next-tick regression (and its `real = ripper_main.resolve_drive_device` captures the already-patched fake, not the real resolver).

**Tip check.** Still present at `71129cd9`: `services/ripper/arm_ripper/main.py:234-243` (`if settings.ARM_DRIVE_BY_ID or not absent: return settings.ARM_DRIVE_DEV or ""`) and `:282`. Same repro on a tip worktree (with `ARM_DRIVE_ID=drv_1`, now required) prints the identical `absent_warnings=6 present_infos=6 boot_probes=6 rips_started=6`. On the tip the backend scanner does update `device_path` on enrolled port-identity rows (`drive_scanner.py:163-164`) and `ripper_manager.py` recreates containers only for a stale image, so the path is reachable there.

**Suggested fix location.** feat/drive-lifecycle (#61) — the loop and `_current_hint` are introduced here; fix is self-contained in main.py (track the last hint that resolved).

**Verification.** Reproduced at head and tip with the scripted poll loop above (zero infra). Hardware confirmation: `devtools/drive-hotplug-drill.md` with a drive that has no `/dev/disk/by-id` link, replugged so it renumbers — untested-needs-hardware for that part.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/6

### D-005  S4  open  ripper  origin #61

**Title.** "node outside ARM_OPTICAL_*_MAX" warning fires on every 2 s poll, contradicting the PR's log-once-per-transition design.

**Where.** `services/ripper/arm_ripper/drive_resolve.py:54-62` (`_optical_node`, `warn_if_missing=True` from `:84`) at `9ce93849`; called from `poll_loop` every tick (`main.py:246`).

**What.** When udev's by-id link points at e.g. `sr9` but the entrypoint only pre-created `sr0..sr7`, `resolve_drive_device` logs `logger.warning("drive node %s is not present under %s …")` unconditionally. `poll_loop` re-resolves every `POLL_INTERVAL_SECONDS` (2 s), so the warning repeats ~43,000 times/day in the per-drive log file, alongside the single "drive absent" line the PR advertises. Expected: throttle like the ABSENT/MISCONFIGURED transitions (once per transition, or once per N ticks).

**Repro / evidence.**

```
grep -n "warn_if_missing" services/ripper/arm_ripper/drive_resolve.py   # 51, 54, 84 — no state, no throttle
grep -n "resolve_drive_device(settings.ARM_DRIVE_BY_ID, hint" services/ripper/arm_ripper/main.py  # 246, inside while True
```

**Tip check.** Still present at `71129cd9`: `services/ripper/arm_ripper/drive_resolve.py:58` (`logger.warning(` with no throttle), called from `main.py:284` each tick.

**Suggested fix location.** feat/drive-lifecycle (#61) — the warning is introduced here.

**Verification.** Code reading; no hardware needed to confirm the call cadence (poll loop test harness shows `resolve_drive_device` is invoked once per tick).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/7

### D-006  S4  fixed-later  devtools  origin #61

**Title.** PR body claims the compose block grants the device cgroup rules; nothing in the diff wires `ARM_DRIVE_ID`/`device_cgroup_rules`/`/host-disk`, so the hotplug path is dead for every stack this PR can generate.

**Where.** `devtools/setup-dev.sh:292` (`devices:` bind, unchanged) and `install.sh:1268` (same) vs `services/_common/docker-entrypoint.sh:272` (`if [[ -n "${ARM_DRIVE_ID:-}" ]]`) at `81e73988` / head `8141a6c9`.

**What.** Merged alone, #61 ships the entrypoint pre-creation, by-id resolution and DETACHED heartbeat, but no generated compose sets `ARM_DRIVE_ID`, grants `b 11:* rmw`/`c 21:* rmw`, or mounts `/dev/disk`; rippers still start with `devices:` (so an absent drive still fails container creation — the exact failure in "Why") and by-id resolution is never configured. The PR body presents the cgroup grant as delivered; the drill doc tells the operator to hand-edit an override instead.

**Repro / evidence.**

```
git diff origin/main...origin/feat/drive-lifecycle --stat -- devtools/setup-dev.sh install.sh docker-compose*.yml   # (empty)
grep -n "device_cgroup_rules\|ARM_DRIVE_ID\|host-disk" devtools/setup-dev.sh install.sh                              # (none)
```

**Tip check.** Fixed by #64 (feat/drive-lifecycle-3) in `4d235fca` (RipperManager spawns per-drive ripper containers from the backend with `device_cgroup_rules`, `ARM_DRIVE_ID`, `ARM_DRIVE_BY_ID`, `/host-disk` mount; `git branch -r --contains 4d235fca` → lowest `origin/feat/drive-lifecycle-3`). On the tip `devtools/setup-dev.sh` no longer emits ripper blocks at all. Recommend: **leave** — the delivery depends on later backend code; but the #61 body should be reworded ("the compose block grants…" → "Plan 3 grants…") so the PR is not misread as self-sufficient. Note: `install.sh:1268` on the tip still emits `devices:` ripper blocks — see cross-PR notes.

**Suggested fix location.** feat/drive-lifecycle (#61) — PR description only.

**Verification.** Diff inspection; `bash devtools/setup-dev.sh` output structure unchanged by this PR.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/8

### D-007  S4  fixed-later  common  origin #61

**Title.** `DriveMediaStatus.DETACHED` comment documents backend behaviour ("derives DriveStatus.OFFLINE from this") that does not exist in this PR.

**Where.** `packages/arm_common/arm_common/enums.py:33-36` at `e692b9f3`.

**What.** The comment states the backend derives `DriveStatus.OFFLINE` from a DETACHED heartbeat. In this PR the backend's heartbeat handler (`services/backend/arm_backend/routers/ripper.py:168`) just stores the value; only `jobs.py:_MEDIA_STATUS_DETAIL` references DETACHED. Docs ahead of code within the same PR.

**Repro / evidence.** `git grep -n DETACHED origin/feat/drive-lifecycle -- services/backend/arm_backend` → only `routers/jobs.py:87`.

**Tip check.** Fixed by #62 (feat/drive-lifecycle-2) in `066d4ccf` ("ripper drive endpoints; DETACHED heartbeat derives OFFLINE" — `routers/ripper.py:340-342` on the tip; `git branch -r --contains 066d4ccf` → lowest `origin/feat/drive-lifecycle-2`). Recommend: **leave** — comment describes the stack's design and #62 lands immediately above; alternatively reword to "(Plan 2)".

**Suggested fix location.** feat/drive-lifecycle (#61) — one comment line.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/9

### D-008  S3  fixed-later  backend  origin #62

**Title.** Every ripper-served drive appears twice: the hostname-registered ENROLLED row and a scanner-created DETECTED duplicate.

**Where.** `services/backend/arm_backend/drive_scanner.py:196-217` at `704bfdd0` (reconcile matches rows only by `by_id_name` / `sysfs_port`), against `services/backend/arm_backend/routers/ripper.py:317-333` at `95ae6568` (the Plan-1 `/register` upsert writes `hostname`, `device_path`, `serial`, `status` only — never `by_id_name`/`sysfs_port`).

**What.** At this head the ripper from #61 still registers by hostname, producing an ENROLLED row with `by_id_name=NULL, sysfs_port=NULL`. The scanner cannot match that row, so on its first tick it inserts a second row for the same physical drive (`scan-<id>`, DETECTED, same `/dev/srN`, same serial). The Drives UI lists the drive twice; "Enroll" on the duplicate yields two ENROLLED rows for one device (no container effect at Plan 2). Should match on serial / by-id, or the register path should carry identity.

**Repro / evidence.**

```
# SQLite, real reconcile_drives(): seed what /register writes, then scan the same drive
ScanSummary(detected=1, ignored=0, enrolled=1, absent=0, pruned=0)
('arm-ripper-sr0', '/dev/sr0', '123', 'enrolled', None)
('scan-drv_01M3ZEAC...', '/dev/sr0', '123', 'detected', 'usb-ASUS_BW-16D1HT_123-0:0')
```

**Tip check.** Fixed by #64 (`feat/drive-lifecycle-3`) in `5f4b3d6a` "feat(backend): register rippers by drive_id with an identity check; delete the hostname upsert" — `/register` now looks the row up by `ARM_DRIVE_ID`, refuses non-ENROLLED rows and checks `by_id_name`; `git branch -r --contains 5f4b3d6a` lists `origin/feat/drive-lifecycle-3` and everything above, so it is in an open PR (not a straggler); recommend: leave — the fix is the Plan 3 contract (backend-spawned ripper with `ARM_DRIVE_ID`) and cannot be hoisted without #64's ripper manager; but #62 must not be released alone (the PR body's own "retarget to main" note should say it ships with #64).

**Suggested fix location.** feat/drive-lifecycle-3 — already there.

**Verification.** Code reading + the SQLite reproduction above (zero-infra). Full behaviour with a real ripper: untested-needs-hardware — bring up #62 alone with one ripper and open the Drives page (or `bash devtools/iso-smoke.sh`, then `GET /api/drives`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/10

### D-009  S4  fixed-later  backend  origin #62

**Title.** `GET /api/drives/diagnostic` reports every scanner-detected (never-enrolled) drive as unhealthy "no media-status heartbeat recorded".

**Where.** `services/backend/arm_backend/routers/drives.py:66-80` at `95ae6568` (pre-existing health rule, untouched) + `services/backend/arm_backend/drive_scanner.py:211-217` at `704bfdd0` (new DETECTED rows with `status=online` via server default and no heartbeat).

**What.** Detected/ignored rows have no ripper, so `media_status_at` is always `None` and the diagnostic marks them `healthy=false`. A freshly plugged-in drive the operator has not decided about shows as a problem; an ignored drive shows as a problem forever. The rule should be lifecycle-aware.

**Repro / evidence.** `test_diagnostic_reports_drives` + any DETECTED row: `drives.py:72 if d.media_status_at is None: healthy=False; notes.append("no media-status heartbeat recorded")`.

**Tip check.** Fixed by #66 (`feat/drive-lifecycle-6`) in `8027b154` "fix(drives): … diagnostics lists every drive; Detected is a panel" — the diagnostic is now branched on `d.lifecycle` (DETECTED → "not enrolled: enroll it…", `healthy = d.present`; IGNORED → healthy). `git branch -r --contains 8027b154` lists `origin/feat/drive-lifecycle-6` upward — open PR, not a straggler; recommend: leave — cosmetic, and the fix is part of a larger diagnostics rework that depends on #64/#65 container checks.

**Suggested fix location.** feat/drive-lifecycle-6 — already there.

**Verification.** Code reading; tests pass at head because no test asserts a detected row's health.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/11

### D-010  S4  open  backend  origin #62

**Title.** `POST /api/drives/rescan` "online/stale" badge counts every detected and ignored drive as stale.

**Where.** `services/backend/arm_backend/routers/drives.py:108-119` at `9914afad`.

**What.** The handler now runs the scanner (which creates DETECTED rows) and then re-counts *all* rows with the heartbeat-freshness rule. Rows with no ripper can never be fresh, so each detected/ignored drive adds one to `stale`. The body claims the badge is "unchanged"; it now lies as soon as a non-enrolled drive exists. Count only ENROLLED rows (or drop the legacy counts).

**Repro / evidence.** `drives.py:112-117 for d in drives: fresh = d.media_status_at is not None …; else: stale += 1` with `drives = select(Drive)` (no lifecycle filter). `test_rescan_runs_the_scanner_and_reports_counts` only asserts `"stale" in body`, so it does not catch this.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/routers/drives.py:236-245` — the select is now filtered to `DriveKind.OPTICAL` but still not by lifecycle; `stale += 1` for every non-fresh row.

**Suggested fix location.** feat/drive-lifecycle-2 — the regression is introduced here.

**Verification.** Code reading at head and tip; zero-infra.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/12

### D-011  S4  open  backend  origin #62

**Title.** Stale "0029" references after the migration was renumbered to 0030.

**Where.** `services/backend/tests/test_migration_0030.py:21,34,42` (`test_0029_upgrade_adds_every_column`, `test_0029_downgrade_drops_every_column`, `test_0029_matches_the_models`) and `services/backend/arm_backend/drive_scanner.py:266` ("in-memory rows predating 0029") at `ab932a0b`.

**What.** `ab932a0b` renamed the file and revision to `0030_drive_lifecycle` but left the test names and the `_tunables` docstring pointing at 0029, which is `0029_thediscdb` on this chain. Anyone grepping failures by revision lands on the wrong migration.

**Repro / evidence.** `grep -n 0029 services/backend/tests/test_migration_0030.py services/backend/arm_backend/drive_scanner.py`.

**Tip check.** Still present at `71129cd9`: `test_migration_0030.py:21,34,42` (`def test_0029_*`) and `drive_scanner.py:273` ("predating 0029").

**Suggested fix location.** feat/drive-lifecycle-2 — same commit that renumbered.

**Verification.** Grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/13

### D-012  S4  open  backend  origin #62

**Title.** The e2e harness boots the real `DriveScanner` against the host's `/sys`, making the real-DB tier environment-dependent.

**Where.** `services/backend/arm_backend/main.py:246-250` at `9914afad` (scanner started unconditionally with `settings.ARM_SYSFS_ROOT="/sys"`), with no override in `services/backend/tests/e2e/conftest.py` (the fixture pins `_build_docker_client`, `load_configured_gpus`, `_run_migrations` and the log dir precisely to avoid this class of problem, lines 137-160).

**What.** Under `app_client`, the scanner's first tick runs immediately and reads the developer's real `/sys/class/block/sr*` (and `/host-disk`, absent → port identity). On a dev box with an optical drive — the normal case for ARM developers — it inserts DETECTED rows into the test SQLite DB, and the suite's result depends on host hardware. CI has no `sr*` (this host: 0), so it passes there. The fixture should set `ARM_SYSFS_ROOT`/`ARM_HOST_DISK_ROOT` to `tmp_path` dirs (or monkeypatch `DriveScanner`).

**Repro / evidence.** `grep -n "SYSFS\|HOST_DISK\|drive_scanner" services/backend/tests/e2e/*.py` → no matches at head; `main.py:246-249` constructs the scanner from settings; `drive_scanner.py:296-303` scans on the first loop pass.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/main.py:354-355` (same constructor) and no `ARM_SYSFS_ROOT`/`drive_scanner` override in `tests/e2e/` at the tip.

**Suggested fix location.** feat/drive-lifecycle-2 — where the scanner joins the lifespan.

**Verification.** Code reading; cannot reproduce on this host (no `sr*` devices). A human with a drive: `uv run pytest -q -k e2e` then inspect `app_client`'s SQLite for `scan-drv_*` rows.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/14

### D-013  S2  fixed-later  backend  origin #64

**Title.** Enroll creates the container, then 500s on `DriveView.model_validate` (expired `updated_at`); row stays `enrolled` while the UI reports failure.

**Where.** `services/backend/arm_backend/routers/drives.py:280` at `b2516755` (head `1be121d8`): `return await _view_for(db, drive)` after `db.commit()` + `manager.ensure_running`.

**What.** Same expiry as C1: `_to_view` → `DriveView.model_validate(drive)` fails with `MissingGreenlet` on `updated_at` → 500. Because the exception is not `RipperManagerError`, the revert branch does not run: the container exists and the row is `enrolled`, but the client sees an error. The commit-then-`_view_for` shape already exists at BASE (#62) for enroll/ignore/unignore (so the bare 500 is #62's), but #64 adds the "container already created, state now lies" half.

**Repro / evidence.** Ad-hoc e2e test: seed `Drive(lifecycle=DETECTED, present=True)`, stub `app.state.ripper_manager`, `POST /api/drives/{id}/enroll` with admin JWT →
```
pydantic_core.ValidationError: 1 validation error for DriveView
updated_at  Error extracting attribute: MissingGreenlet: greenlet_spawn has not been called … (services/backend/arm_backend/routers/drives.py:43)
```

**Tip check.** Fixed by #65 in `2a0600eb` (`await db.refresh(drive)` before `_view_for`, tip `routers/drives.py:422,440,509`). Not a straggler. Recommend: **move down** (the ignore/unignore hunks belong to #62; the enroll/unenroll hunks to this PR).

**Suggested fix location.** feat/drive-lifecycle-3 for enroll/unenroll; feat/drive-lifecycle-2 for ignore/unignore.

**Verification.** Reproduced on the e2e harness at head; fix commit read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/15

### D-014  S2  fixed-later  devtools  origin #64

**Title.** Nothing builds `ARM_RIPPER_IMAGE` (`arm-ripper:latest`): on a compose-built install every enroll is 502 "ImageNotFound".

**Where.** `docker-compose.yml.example:62-96,145-151` and `services/backend/arm_backend/config.py:141-143` at `749b9496`/head `1be121d8`.

**What.** `RipperManager.ensure_running` runs `containers.run(image="arm-ripper:latest")`; the compose template has no `arm-ripper` build-only service (the comment claiming `deploy.replicas: 0` is false at this head), and setup-dev.sh builds the ripper only inside its per-drive `arm-ripper-srN` services (tagged `armv3-arm-ripper-srN`, not `arm-ripper:latest`). Enroll flips the row, fails on `ImageNotFound`, reverts with `last_error`; diagnostics shows the `ripper_manager` warning. Manual `docker build -t arm-ripper:latest` is the only workaround.

**Repro / evidence.** `grep -n "arm-ripper" docker-compose.yml.example` at head → only the generated-region sentinels; `grep -n replicas` → only `arm-transcode`.

**Tip check.** Fixed by #65 in `27405d14` ("build-only arm-ripper service; setup-dev stops enumerating drives": adds `arm-ripper:` with `deploy.replicas: 0`, tip `docker-compose.yml.example:245-251`). Not a straggler. Recommend: **move down**.

**Suggested fix location.** feat/drive-lifecycle-3.

**Verification.** Code/compose read; untested-needs-hardware for the end-to-end enroll (`docker compose up -d --build` on a fresh clone, then enroll from the UI; `devtools/iso-smoke.sh`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/16

### D-015  S2  fixed-later  devtools  origin #64

**Title.** setup-dev.sh / iso-smoke.sh still launch rippers without `ARM_DRIVE_ID` (and with the removed `ARM_DRIVE_SERIAL`); every generated `arm-ripper-srN` crash-loops at Settings() and conflicts with the manager's containers.

**Where.** `devtools/setup-dev.sh:279-318` (`emit_ripper_block`, `ARM_DRIVE_SERIAL: "${serial}"`, no `ARM_DRIVE_ID`), `devtools/iso-smoke.sh:300-318` (`-e ARM_DRIVE_DEV=/dev/sr0`, no `ARM_DRIVE_ID`) at head `1be121d8`; ripper side `services/ripper/arm_ripper/config.py:21` (`ARM_DRIVE_ID: str`, required) at `a5262a8b`.

**What.** `arm_ripper.config.settings = Settings()` runs at import; with no `ARM_DRIVE_ID` pydantic raises → container exits → `restart: unless-stopped` loop. The dev stack therefore has zero working rippers until the operator enrolls via the UI, and the compose services keep `devices:` binds on the same nodes. The PR body lists this as deferred to Plan 5, but merged alone it breaks `bash devtools/setup-dev.sh && docker compose up -d` and both drills.

**Repro / evidence.** `grep -n "ARM_DRIVE_SERIAL\|ARM_DRIVE_ID" devtools/setup-dev.sh devtools/iso-smoke.sh` at head → only `ARM_DRIVE_SERIAL` lines; `services/ripper/tests/test_config_drive_identity.py::test_drive_id_is_required` shows the ValidationError.

**Tip check.** Fixed by #65: `27405d14` (setup-dev stops emitting ripper services) and `4ad41905` ("iso-smoke borrows an enrolled drive and registers by id"); both `git branch -r --contains` → origin/feat/drive-lifecycle-4. (Tip's later iso-smoke rewrite `5ed5c5c9` is a straggler, but the breakage is already gone at #65.) Recommend: **move down** — or at minimum merge #64 and #65 together.

**Suggested fix location.** feat/drive-lifecycle-3.

**Verification.** Code read; untested-needs-hardware (`bash devtools/setup-dev.sh && docker compose up -d && docker compose ps`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/17

### D-016  S3  untested-needs-hardware  backend  origin #64

**Title.** Unenroll only refuses while `RIPPING`; a job mid-scan/identify is orphaned when the manager SIGTERMs and removes its ripper.

**Where.** `services/backend/arm_backend/routers/drives.py:331-349` at `b2516755` (head `1be121d8`): the guard selects `Job.status == JobStatus.RIPPING` only, then `manager.remove(drive.id)` stops (30 s) and removes the container.

**What.** Before this PR unenroll only flipped a row; now it kills the process. A disc in `created`/`awaiting_user_id`/`identified`/`awaiting_review` (scan posting, identify running, review countdown — the ripper runs the AWAITING_REVIEW countdown in-process) has a live ripper pipeline that is terminated; the job stays non-terminal with no owning ripper and the row goes `detected`. `delete_drive` has the same RIPPING-only predicate, and #66 mirrors it in the UI gate (`services/ui-neu/frontend/src/lib/utils/drives.ts:17-19` `isRipping`, `DriveCard.svelte:405`), so the Unenroll button is offered while a pre-rip job is live. Workaround: abandon the job via `/jobs/{id}/abandon` first, hence S3. (The #66 reviewer reported the same defect independently; merged here.)

**Repro / evidence.**

```python
.where(col(Job.status) == JobStatus.RIPPING)   # drives.py:337 — TERMINAL_JOB_STATUSES is imported at :16 but not used here
```

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/routers/drives.py:481-496` (same RIPPING-only select, then `manager.remove`).

**Suggested fix location.** feat/drive-lifecycle-3 — refuse when any non-terminal job exists for the drive (`~col(Job.status).in_(TERMINAL_JOB_STATUSES)`), or fail the job on unenroll.

**Verification.** Code read; untested-needs-hardware (insert a disc, unenroll during identify, observe job state).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/18

### D-017  S3  untested-needs-hardware  backend  origin #64

**Title.** Container name/hostname is the udev short serial; two drives sharing a serial (common on USB bridges) collide and the second enroll fails with a confusing 502.

**Where.** `services/backend/arm_backend/ripper_manager.py:83-85` at `4d235fca` (head `1be121d8`): `raw = drive.serial or drive.id[-12:]` → `arm-ripper-<slug>`.

**What.** `drive_scanner.parse_short_serial` takes the last `_` token of the by-id name, so `usb-VENDA_MODELA_0123456789-0:0` and `ata-VENDB_MODELB_0123456789` are distinct identities with identical `serial`. Enrolling the second drive: row flips to `enrolled`, `containers.run` → docker 409 name conflict, `_labelled(drive.id)` finds nothing (the winner carries the other drive's label) → `RipperManagerError("APIError: 409 … Conflict")`, row reverted, `last_error` set. No UI workaround (name is not configurable); `drive.hostname` UNIQUE would collide the same way on register.

**Repro / evidence.** `test_ensure_running_reraises_a_409_when_no_container_shows_up` is exactly this path; `container_name` has no uniqueness fallback.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/ripper_manager.py` `container_name` (`raw = drive.serial or drive.id[-12:]`, unchanged apart from the virtual-drive branch).

**Suggested fix location.** feat/drive-lifecycle-3 — include the drive-id suffix in the name (`arm-ripper-<serial>-<id[-6:]>`) or fall back to the id when another row shares the serial.

**Verification.** Code read; untested-needs-hardware (two USB enclosures with identical descriptor serials).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/19

### D-018  S4  open  docs  origin #64

**Title.** Protocol doc still documents the hostname-keyed register body.

**Where.** `docs/arch/03-protocol.md:32` at head `1be121d8`: `Body: {hostname, device_path, ripper_version, hw_caps}. Response: {drive_id, drive_config, service_token_verified}`.

**What.** The wire contract changed in this PR (`drive_id` required, `by_id_name`, 404/409 refusals, full `Drive` response); no doc in the diff was updated.

**Repro / evidence.** `git diff origin/feat/drive-lifecycle-2...origin/feat/drive-lifecycle-3 --stat -- docs` → empty.

**Tip check.** Still present at `71129cd9`: `docs/developers/architecture/03-protocol.md:32` (same line, file moved by `a1b0c7c3`).

**Suggested fix location.** feat/drive-lifecycle-3.

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/20

### D-019  S4  fixed-later  docs  origin #65

**Title.** `arm_wiki/` (synced to the GitHub wiki by `publish-wiki.yml`) still describes the per-drive `arm-ripper-srN` compose model this PR removes from setup-dev/compose template.

**Where.** `arm_wiki/Contribute.md:36-38`, `arm_wiki/Web-UI.md:37-38`, `arm_wiki/Troubleshooting.md:9,30`, `arm_wiki/MakeMKV.md:34` at `1d89e1ee` (unchanged by this PR; made wrong by `27405d14` "build-only arm-ripper service; setup-dev stops enumerating drives").

**What.** Contribute.md says the dev compose `setup-dev.sh` generates has "one `arm-ripper-srN` per drive"; Web-UI.md says `/drives` lists "one per `arm-ripper-srN` container"; Troubleshooting/MakeMKV tell users to `docker compose logs -f arm-ripper-sr0` / `docker compose exec arm-ripper-sr0`. After this PR the dev compose has a single build-only `arm-ripper` service and the real containers are `arm-ripper-<serial>` outside the compose project, so none of those commands work on a dev stack. The PR claims the contributor runbooks were rewritten.

**Repro / evidence.**

```
$ grep -rn "arm-ripper-sr" arm_wiki/
arm_wiki/Contribute.md:38:`arm-ripper-srN` per drive) keeps `build:` blocks (vs the installer's `image:`
arm_wiki/Web-UI.md:38:`arm-ripper-srN` container — with their current state (idle, reading, ripping,
arm_wiki/Troubleshooting.md:9:docker compose logs -f arm-backend    # or arm-ripper-sr0, arm-ui, arm-db
arm_wiki/MakeMKV.md:34:cd ~/arm && docker compose exec arm-ripper-sr0 grep app_Key ...
```

**Tip check.** Gone at `71129cd9`: `git ls-tree origin/integration/all-prs-3 arm_wiki` is empty and `git grep arm-ripper-sr origin/integration/all-prs-3 -- arm_wiki` matches nothing. Fixed by #88 (`feat/docs-site`) in `a1b0c7c3` "docs: split the docs by audience into docs/user and docs/developers" — `git branch -r --contains a1b0c7c3` lists `origin/feat/docs-site` (and `chore/ui-neu-ux-polish`, `feat/first-run-setup` above it), so it is in an open PR, not a straggler. Recommend: **leave** — the fix is a wholesale docs reorganisation that depends on the docs-site work; a targeted edit of the four wiki lines in #65 would be nice-to-have only (Getting-Started.md's `arm-ripper-srN` lines still match the legacy `install.sh` and are not wrong at this point).

**Suggested fix location.** feat/docs-site (#88) already has it; optionally patch the four lines in feat/drive-lifecycle-4.

**Verification.** grep at head and tip, as above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/21

### D-020  S4  fixed-later  devtools  origin #65

**Title.** `iso-smoke.sh` leaves the borrowed drive's managed ripper stopped when the ISO ripper never came up, while its comment claims the trap fires "on every exit path … never stays paused just because a later step blew up".

**Where.** `devtools/iso-smoke.sh:610-623` (`on_exit`) and `:372-397` (`run_iso_ripper`) at `1d89e1ee` (introduced in `4ad41905`, comment wording from `31a36df0`).

**What.** `pause_managed_ripper` (`:668`) stops the enrolled drive's container, then `trap on_exit EXIT` (`:669`), then `run_iso_ripper` (`:672`). If `docker run --rm -d …` (`:379`) fails (network `armv3_default` missing, bad `.env`, port/name clash, etc.), `set -e` exits; `on_exit` sees `ISO_RIPPER_DOWN == 0` and takes the "ISO ripper is still up" branch: it prints `docker stop armv3-ripper-iso` (a container that does not exist) + `docker start <managed>` and returns without resuming. The managed ripper stays stopped although nothing conflicts with it. Should resume (or at least not print a `docker stop` for a container that never started) when `RIPPER_CTR` is not running. Workaround: run the printed `docker start`.

**Repro / evidence.**

```
# iso-smoke.sh:614-623
    if (( DO_CLEANUP == 0 )) || (( ISO_RIPPER_DOWN == 0 )); then
        ...
        if (( ISO_RIPPER_DOWN == 0 )); then
            echo "      docker stop ${RIPPER_CTR}"
        fi
        echo "      docker start ${ctr:-<managed-ripper-container>}"
        return
    fi
```
Static trace only (needs a running stack to exercise).

**Tip check.** Gone at `71129cd9`: the tip's `iso-smoke.sh` has no `pause_managed_ripper`/`ARM_SMOKE_DRIVE_ID` — it drives `POST /api/iso/rips` (virtual drives) instead. The patch that replaced it is `e4477d60` "feat(devtools): ISO library mount and the API-driven iso-smoke" on `origin/feat/iso-source-rip` (#101) (`git log -S'pause_managed_ripper' origin/feat/drive-lifecycle-4..origin/feat/iso-source-rip`); the tip carries the same patch re-sha'd as straggler `5ed5c5c9`, but the content is in an open PR, so this is fixed-later, not open. Recommend: **leave** — the whole borrow-a-drive mechanism is deleted by #101; a fix in #65 would be thrown away.

**Suggested fix location.** feat/drive-lifecycle-4 only if #65 is expected to merge and ship alone for a while: gate the resume on `docker ps --format '{{.Names}}' | grep -qx "${RIPPER_CTR}"` rather than on `ISO_RIPPER_DOWN`.

**Verification.** Static read of `on_exit`/`run_iso_ripper`; untested-needs-hardware for the live path (`bash devtools/iso-smoke.sh` with the compose network removed).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/22

### D-021  S3  open  ui-neu  origin #66

**Title.** Detected list offers "Enroll" on a drive that is not present, which the backend always refuses (409), and the row gives no presence indication.

**Where.** `services/ui-neu/frontend/src/lib/components/DriveLifecycleLists.svelte:31-44` (row snippet; Enroll button `:42`) at `1693775f` (introduced `dcad6e56`).

**What.** A DETECTED row with `present: false` (unplugged, within the 7-day prune window) renders identically to a connected one except for `last_seen_at`; Enroll is enabled. `enroll_drive` refuses with `cannot enroll a drive that is not present` (`routers/drives.py:360-363`), so the click only yields an error line. The row should either disable Enroll (with a "not connected" hint) or show presence so the action reflects what the backend will accept — the diagnostic endpoint already emits `not connected since …` for the same row.

**Repro / evidence.** Render `DriveLifecycleLists` with `detected=[{lifecycle:'detected', present:false, …}]` → `getByTestId('enroll-<id>')` is enabled; `POST /api/drives/<id>/enroll` → 409. No `present` reference in the component (`grep present DriveLifecycleLists.svelte` → none).

**Tip check.** Still present at `71129cd9`: tip `DriveLifecycleLists.svelte` Enroll button is disabled only by `busy[d.id] || enrollDisabledReason` (ripper-service-down), still no `present` check or indicator (`connectionLabel` is the bus type, not presence); backend tip `routers/drives.py:403` still refuses `not present`.

**Suggested fix location.** feat/drive-lifecycle-6 (#66) — the component is new in this PR; the tip's straggler rewrite (`5bd2fe9f`) would need the same `present` gate.

**Verification.** Code read at head and tip; DriveLifecycleLists.test.ts has no absent-drive case.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/23

### D-022  S4  open  ui-neu  origin #66

**Title.** "Look for issues" flags healthy rows as issues: an ignored PORT-identity drive (notes `['ignored', _PORT_NOTE]`, `healthy: true`) and any present-but-unenrolled drive (`healthy: true`, one informational note) turn the status bar to "Issues Found", contradicting the backend's `healthy` verdict and the PR-body claim.

**Where.** `services/ui-neu/frontend/src/routes/settings/+page.svelte:614` at `1693775f` (`8027b154`); backend note emission `services/backend/arm_backend/routers/drives.py:137-140` at `1693775f` (`d1a3bbf8`).

**What.** The UI derives `unhealthy` as `!d.healthy || (notes.length > 0 && !(notes.length === 1 && notes[0] === 'ignored'))`, i.e. "any note except exactly `ignored`". The backend appends `_PORT_NOTE` to every PORT-identity row regardless of lifecycle while only marking ENROLLED ones unhealthy, and gives present DETECTED rows the `not enrolled: …` note with `healthy: true`. Either the UI should trust `healthy` (and render notes as info) or the backend should not add `_PORT_NOTE` to ignored rows. Coverage confirms the ignored/detected PORT branch is untested (`drives.py` partial branch `139->141`).

**Repro / evidence.** `_drive(DriveLifecycle.IGNORED, identity_kind=PORT, serial=None, by_id_name=None)` → diagnostic item `healthy: true, notes: ['ignored', 'no by-id link, …']`; UI filter at `:614` includes it in `unhealthy` → "Issues Found".

**Tip check.** Still present at `71129cd9`: `+page.svelte:722-723` (same filter), `routers/drives.py:167-169` (`_PORT_NOTE` appended for every PORT row).

**Suggested fix location.** feat/drive-lifecycle-6 (#66) — both halves are introduced here.

**Verification.** Code read; backend behaviour confirmed by the coverage partial-branch report; not run in a browser.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/24

### D-023  S4  fixed-later  ui-neu  origin #66

**Title.** Ignored-section toggle uses one-off text glyphs `▾`/`▸` where the shared `Glyph` component (`chevron-down` / `chevron-right`) already exists.

**Where.** `services/ui-neu/frontend/src/lib/components/DriveLifecycleLists.svelte:62` at `1693775f` (`dcad6e56`); `Glyph.svelte` + `glyph-names.ts` (`chevron-down`, `chevron-right`) exist at the same commit.

**What.** Violates the standard-UI-patterns rule (`.claude/memory/feedback_standard_ui_patterns.md` on the tip, owner directive 2026-09-05; this PR's commits are dated 2026-09-04 but the branch was restacked 2026-09-23).

**Repro / evidence.** `DriveLifecycleLists.svelte:62  Ignored ({ignored.length}) {ignoredOpen ? '▾' : '▸'}`

**Tip check.** Gone at `71129cd9` (tip uses `<Glyph name={ignoredOpen ? 'chevron-down' : 'chevron-right'} …/>`). The fixing commit on the tip is `5bd2fe9f` (`feat(ui): drive enrollment states, connection/media chips, essentials card, 3-state mode`), which is a rebased copy of `33390730` on `feat/first-run-setup` (same subject, same diffstat) — so Fixed by #102. Recommend: **leave** — cosmetic, and the fix is part of #102's drive-list rewrite.

**Suggested fix location.** feat/drive-lifecycle-6 (#66) — swap the two characters for `Glyph`; or land the straggler `5bd2fe9f` in an open PR.

**Verification.** Code read at head and tip; containment via `git branch -r --contains`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/25

### D-024  S4  fixed-later  ui-neu  origin #66

**Title.** Diagnostic notes render an inline SVG warning path that duplicates `Glyph name="warning"`.

**Where.** `services/ui-neu/frontend/src/routes/settings/+page.svelte:658-660` at `1693775f` (block rewritten in `dcad6e56`/`8027b154`; the path pre-existed in the base and was carried into the new per-drive loop).

**What.** `GLYPH_PATHS.warning` is byte-identical to the inline `d="M12 9v2m0 4h.01…"`; the shared component should be used.

**Repro / evidence.** `+page.svelte:659` vs `glyph-names.ts` `warning:` entry.

**Tip check.** Fixed by #74 (chore/ui-neu-css-cleanup) in `390ea291` (`feat(ui-neu): styling system: tokens, block vocabulary, themed schemes, no inline styling` — the diag block was rebuilt on shared components); recommend: leave — cosmetic and the fix rides on #74's styling system.

**Suggested fix location.** chore/ui-neu-css-cleanup (#74) already has it.

**Verification.** `git log -S'M12 9v2m0 4h' …` + `git branch -r --contains 390ea291`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/26

### D-025  S4  open  ui-neu  origin #66

**Title.** `deleteDrive()` API wrapper left dead after DriveCard's Remove button was replaced by Unenroll.

**Where.** `services/ui-neu/frontend/src/lib/api/drives.ts:12` at `1693775f`; only remaining caller is `src/lib/__tests__/drives-api.test.ts:61-64` (removed production use: `DriveCard.svelte` in `dcad6e56`).

**What.** The backend `DELETE /api/drives/{id}` remains valid, but no ui-neu surface calls it; the wrapper and its test survive only to cover each other.

**Repro / evidence.** `grep -rn deleteDrive services/ui-neu/frontend/src | grep -v test` → only the definition.

**Tip check.** Still present at `71129cd9`: `api/drives.ts:14` with the same lone test caller.

**Suggested fix location.** feat/drive-lifecycle-6 (#66) — remove with the Remove button, or keep deliberately with a comment.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/27

### D-026  S4  open  ui-neu  origin #66

**Title.** Unenroll uses the native `confirm()` while the same PR introduces the shared `ConfirmDialog` for the sibling destructive action (Remove Missing Drives).

**Where.** `services/ui-neu/frontend/src/lib/components/DriveCard.svelte:170` at `1693775f` (`dcad6e56`); `DriveMaintenance.svelte:60-68` uses `ConfirmDialog` in the same PR.

**What.** Two destructive drive actions on the same tab confirm through different mechanisms; `ConfirmDialog` is a listed standard (`feedback_standard_ui_patterns.md`). The native dialog also cannot be tested with the testing-library patterns the PR uses elsewhere (DriveCard.test.ts stubs `window.confirm`).

**Repro / evidence.** `DriveCard.svelte:170  if (!confirm(`Unenroll ${name}? …`)) return;`

**Tip check.** Still present at `71129cd9`: `DriveCard.svelte:260` (`!confirm(`).

**Suggested fix location.** feat/drive-lifecycle-6 (#66).

**Verification.** Code read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/28

### D-027  S3  open  backend  origin #75

**Title.** A partial placeholder rip (`RIPPED_PARTIAL` + `flags.unidentified`) never gets its routed session applied: rip-complete gates `after_rip` off, and resolve only runs `after_rip` for `RIPPED_AWAITING_IDENTIFY`.

**Where.** `services/backend/arm_backend/routers/ripper.py:1137-1145` (rip-complete skips `after_rip` for any unidentified ripped job) and `services/backend/arm_backend/routers/jobs.py:960,991-998` (`was_ripped_placeholder = job.status == JobStatus.RIPPED_AWAITING_IDENTIFY`; the `else` branch only calls `fan_out_waiting_identify_applications`, never `maybe_auto_apply_session`) at `7fe7b5e7` (introduced in 3c46f57d "gate after_rip on the unidentified flag for partial rips too").

**What.** Fix 75-3 correctly stops rip-complete from fanning out an unidentified partial rip under the volume-label title, and the comment promises "a parked application still drains safely once resolve lands". But the other half of `after_rip` — `maybe_auto_apply_session` (the manual-trigger `pending_session_id` choice or the drive default) — is never run for this job: rip-complete skipped it because of the flag, and resolve takes the non-placeholder branch because the status is `RIPPED_PARTIAL`, not `RIPPED_AWAITING_IDENTIFY`. Result: a manual-trigger rip with an explicit session (`POST /api/jobs/manual {session_id}`) that identifies late and loses one track ends resolved with no transcode tasks and no indication why; the same disc with zero failed tracks would be auto-applied. Workaround: operator applies the session by hand, hence S3.

**Repro / evidence.** Fake-session path: identify with `block_on_miss=false` (sets `flags.unidentified`) and `pending_session_id=S`; rip-complete with one failed track -> status `RIPPED_PARTIAL`, `after_rip` skipped (ripper.py:1137); `POST /resolve {title:...}` -> jobs.py:998 branch -> only parked applications are drained; no `SessionApplication` for S is ever created. No test covers resolve of an unidentified RIPPED_PARTIAL job with a pending_session_id (`grep -n "RIPPED_PARTIAL" services/backend/tests/test_jobs_router.py` has none in the resolve tests).

**Tip check.** Still present at `71129cd9`: `routers/ripper.py:1276-1283` (same gate) and `routers/jobs.py:1020,1074-1079` (`if was_ripped_placeholder: ... after_rip` / else fan-out only).

**Suggested fix location.** feat/phase2-job-metadata — the gate and the resolve branch are both introduced here; make the resolve branch key on "rip already finished AND was unidentified" (e.g. `job.status in {RIPPED_AWAITING_IDENTIFY, RIPPED_PARTIAL} and flag_is_set(old_metadata, "unidentified")`, captured before Fix 75-6 clears the flag).

**Verification.** Code trace at head and tip; not executed against hardware (would need `devtools/iso-smoke.sh` with a forced track failure to see end-to-end).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/29

### D-028  S3  untested-needs-hardware  backend  origin #75

**Title.** identify writes the ripper-supplied `pending_session_id` straight into an FK column without an existence check — a session deleted between manual trigger and identify turns identify into a 500 that the ripper retries forever.

**Where.** `services/backend/arm_backend/routers/ripper.py:546-547` (`job.pending_session_id = req.pending_session_id`, committed at the identify `session.commit()`) at `7fe7b5e7`; FK from `migrations/versions/0031_job_identity_columns.py:50-57`.

**What.** Before this PR the id was a free-form metadata key. Now the column carries `FOREIGN KEY (pending_session_id) REFERENCES sessions(id)`. `manual_trigger` validates the session exists (jobs.py:800-806), but identify trusts whatever the ripper sends. `DELETE /api/sessions/{id}` only refuses built-ins and drive defaults (sessions.py:187-201), so a session chosen for one manual rip can be deleted while the disc is scanning; identify's commit then raises `IntegrityError` (unhandled -> 500). The ripper's identify loop treats 5xx as retriable (`job_controller.py:480-497`: only 4xx is "not retriable; parking pipeline"), so it re-POSTs identify with the same dangling id with exponential backoff until restarted, holding the drive. Window is seconds to a minute; workaround is to re-create the session or restart the ripper, hence S3 (race window). The routed-session resolver already tolerates a missing row (`_load_routed_session` logs and falls back), so the fix is a one-line existence check (or `SELECT ... FOR` the id and drop it with a warning).

**Repro / evidence.** Fake-session tests cannot see FK violations; on a real DB: `POST /api/jobs/manual {drive_id, session_id:S}`, `DELETE /api/sessions/S` before the ripper's identify POST, observe 500 `IntegrityError ... fk_jobs_pending_session_id` and the ripper log "identify failed (...); retrying in Ns" repeating.

**Tip check.** Still present at `71129cd9`: `routers/ripper.py:643-644` (unconditional assignment, no existence check).

**Suggested fix location.** feat/phase2-job-metadata — the FK and the column write are both introduced here.

**Verification.** untested-needs-hardware (needs a real Postgres + ripper); code trace only. Drill: `bash devtools/iso-smoke.sh` with a session deleted between trigger and identify.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/30

### D-029  S4  open  docs  origin #75

**Title.** Stale migration numbers and stale "inert" / "reads metadata_json['disc']" comments left in code the PR itself changed.

**Where.** `packages/arm_common/arm_common/schemas/job_metadata.py:21` and `:95` ("rows written before migration 0031" — the sections/flags lift is 0032), `services/backend/arm_backend/transcode_apply.py:68` ("pre-0031 fallback" — music section is 0032) and `:100` ("metadata-mirror scrub (migration 0032)" — it is 0033), `services/backend/arm_backend/routers/jobs.py:961` ("pre-0031 top-level key" — 0032), `packages/arm_common/arm_common/enums.py:78-81` (says both "Set by rip-complete when a placeholder disc rips…" and "Inert today — no code path sets this yet" — rip_complete now sets it at `routers/ripper.py:1108`), `services/backend/arm_backend/metadata/musicbrainz.py:111-114` ("transcode_apply reads metadata_json['disc']" — transcode_apply now reads `job.disc_number`, lifted at identify `routers/ripper.py:586-589`). All at `7fe7b5e7`.

**What.** Commit 35a77144 renumbered the migrations 0030-0032 -> 0031-0033 and 4c8eb7b7 claims to "fix stale migration-renumber prose", but these references still point at the pre-renumber ids, and the enum comment contradicts itself inside a single comment block that this PR edited. A future reader following "before migration 0031" to decide whether a fallback can be removed would look at the wrong migration.

**Repro / evidence.** `grep -n "003[0-9]" packages/arm_common/arm_common/schemas/job_metadata.py services/backend/arm_backend/transcode_apply.py services/backend/arm_backend/routers/jobs.py`; `grep -n "Inert today" packages/arm_common/arm_common/enums.py`.

**Tip check.** Still present at `71129cd9`: `job_metadata.py:21,105` ("migration 0031"), `transcode_apply.py:80` ("pre-0031"), `routers/jobs.py:1021` ("pre-0031"), `enums.py:106-111` ("Inert today — no code path sets this yet"), `metadata/musicbrainz.py:113`.

**Suggested fix location.** feat/phase2-job-metadata — the renumber commit is in this PR.

**Verification.** grep at head and tip, as above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/31

### D-030  S4  open  ui-neu  origin #75

**Title.** `readJobMetadata` prefers the stale `provider_raw.arm_server.video_type` over the new authoritative `job.media_type` column, and legacy rows lose their Type/multi_title/source_type entirely.

**Where.** `services/ui-neu/frontend/src/lib/utils/job-fields.ts:64-80` at `7fe7b5e7`; migration `services/backend/migrations/versions/0032_job_metadata_sections.py:88-91` (unhandled strays go to `provider_raw["legacy"]`).

**What.** The PR makes `media_type` the routing input and `TitleSearch.svelte:123-127` now writes it (`media_type: editType === 'series' ? 'tv' : 'movie'`) instead of `metadata.video_type`. But the details panel still reads `armServer.video_type` first and only falls back to `job.media_type` when that is absent — so after an operator re-identifies a 1337server-matched disc from movie to series, the Type field keeps showing the arm_server payload's "movie" (the backend's `JobMetadata` docstring says `provider_raw` is "never read for behaviour"). Separately, 0032 files pre-PR arm_server extras under `provider_raw.legacy`, not `provider_raw.arm_server`, and 0031 does not backfill `media_type`, so every job identified before the upgrade shows no Type / multi_title / source_type after it. UI state disagreeing with the column is a lie about backend state, but it is display-only, hence S4.

**Repro / evidence.** `services/ui-neu/frontend/src/lib/utils/job-fields.ts`: `const vt = asScalarString(armServer.video_type); if (vt !== undefined) { out.video_type = vt; } else if (job?.media_type) {...}`. Unit repro: `readJobMetadata({provider_raw:{arm_server:{video_type:'movie'}}}, {media_type:'tv', season:null, pending_session_id:null}).video_type === 'movie'`.

**Tip check.** Still present at `71129cd9`: `job-fields.ts:64,73-77` (same precedence; `provider_raw.arm_server` only).

**Suggested fix location.** feat/phase2-job-metadata — the column fallback was added here; flip the precedence (column first) and either read `provider_raw.legacy` too or backfill `media_type` in 0031 from the legacy `video_type`/`kind` keys.

**Verification.** Code read at head and tip; svelte-check/vitest pass so no test asserts either way.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/32

### D-031  S4  open  migrations  origin #75

**Title.** 0032's downgrade is a no-op although its upgrade moves `artist`/`album`/`tracks` out of the top level — after `alembic downgrade 0031` the base-branch code can no longer name or list music tracks.

**Where.** `services/backend/migrations/versions/0032_job_metadata_sections.py:111-112` (`def downgrade(): pass`) at `7fe7b5e7`.

**What.** The docstring argues "the sections remain readable by the pre-migration code's fallbacks", but the pre-migration code (base `transcode_apply._build_track_ctx`, base ui-neu `extractMusicTracks`) reads `metadata_json["artist"|"album"|"tracks"]` at the top level and has no `music.*` fallback — the fallbacks only exist in the *new* code. Likewise `imdb_id`/`tmdb_id` move under `identity.external_ids` and the base `job-fields.ts` reads `md.imdb_id`. So the migration is reversible in schema terms only; a rollback silently blanks `{artist}`/`{album}`/`{track_title}` for every migrated music job. 0031's downgrade has the smaller, documented equivalent (dropped `season`/`disc` keys are not restored). Data-only, rollback-only, hence S4 under the "migrations must be reversible" invariant.

**Repro / evidence.** `git show origin/feat/drive-lifecycle-6:services/backend/arm_backend/transcode_apply.py | grep -n 'metadata.get("artist")'` vs 0032 `_reshape` moving the key into `out["music"]`.

**Tip check.** Still present at `71129cd9`: `0032_job_metadata_sections.py:111-112` (`downgrade(): pass`).

**Suggested fix location.** feat/phase2-job-metadata — implement the inverse reshape (copy `music.artist/album/tracks`, `identity.external_ids.*` and `flags.*` back to the top level, re-spread `provider_raw.legacy`) or document the irreversibility in the migration docstring instead of claiming readability.

**Verification.** Code read; not executed (no Postgres in the sandbox).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/33

### D-032  S4  open  backend  origin #75

**Title.** New uncovered backend statements: resolve's `tvdb` / `musicbrainz_release` external-id overlay branches.

**Where.** `services/backend/arm_backend/routers/jobs.py:940` and `:942` at `7fe7b5e7` (introduced in 52ce650f / 365b8638).

**What.** `uv run coverage run -m pytest -q && uv run coverage report -m` reports `routers/jobs.py` 99% with lines 940 and 942 missing. Both are new in this PR (the per-field `model_fields_set` overlay from Fix 75-5); only the `imdb`/`tmdb` members are exercised by `test_jobs_router.py`. The Backend holds a 100%-statement policy, and the uncovered lines are exactly the "explicit null clears" semantics the PR body advertises, so a regression there would be invisible.

**Repro / evidence.** `uv run coverage report -m --include='services/backend/arm_backend/routers/jobs.py'` -> `Missing: 940, 942`.

**Tip check.** Still present at `71129cd9`: `routers/jobs.py:1003-1006` (same branches); `git grep -n "tvdb\|musicbrainz_release" origin/integration/all-prs-3 -- services/backend/tests` finds no resolve test touching either member (only config key-check / identity-settings tests), so no later PR or straggler covered them.

**Suggested fix location.** feat/phase2-job-metadata — add the two members to the existing `external_ids` resolve test.

**Verification.** coverage run at head (whole suite, 2169 tests).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/34

### D-033  S3  open  backend  origin #76

**Title.** Unidentified music CD (media_type=None, disc_type=cd) is still routed to the drive's video default; the seeded music routes never fire for it.

**Where.** `services/backend/arm_backend/auto_session.py:533-534` (`if job.media_type is None: return drive.default_session_id`) and `:548-549` (routes skipped when media_type is None) at `4580f65a` (head `517defe3`); `services/backend/arm_backend/routers/ripper.py:580` sets `job.media_type` only when MusicBrainz returned a result.

**What.** For a CD the backend knows `disc_type=cd` at identify regardless of MusicBrainz, but `job.media_type` is only set on a MusicBrainz hit. When lookup fails (no disc id, no match, offline), `resolve_routed_session_id` short-circuits to the drive default (typically a movie session) because `job.media_type is None`, bypassing the compatibility gate and the `(music, cd)` / `(music, NULL)` seeded routes. At rip-complete `maybe_auto_apply_session` then applies a video session to audio tracks → `compute_outputs` resolves nothing → an empty WAITING_IDENTIFY application is parked (`auto_session.py:454-470`, `skipped_reason="no_outputs"`) that no drain can ever fill, and the user must hand-apply the music session. G-17's "a drive default must not permanently swallow a media type it was never meant for" is only enforced when identification succeeded; `disc_type=cd` alone is a sufficient signal that the job is music.

**Repro / evidence.** `services/backend/tests/test_session_routing.py::test_unknown_job_media_type_still_prefers_drive_default` enshrines the behaviour (job media_type=None, drive default returned even with a route present); combine with `routers/ripper.py:574-580` (media_type assignment inside `if result is not None:`). Equivalent manual drill: insert a CD not in MusicBrainz on a drive whose default session is a movie session with `auto_transcode_on_idle=true`; observe a parked empty application for the movie session instead of the Music FLAC route.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/auto_session.py:1041-1043` (`if job.media_type is None: return drive.default_session_id`) and `:1057-1058`; tip `routers/ripper.py` still has no CD→MUSIC fallback (only `DiscType.CD: "rpr_builtin_music_standard"` for the rip preset).

**Suggested fix location.** feat/phase3-session-routing — either set `job.media_type = MediaType.MUSIC` at identify when `disc_type == CD` and lookup failed, or make the drive-default gate/route lookup use `disc_type == CD ⇒ music` when `media_type is None`.

**Verification.** Code trace + existing test; `untested-needs-hardware` for the live drill (a real CD absent from MusicBrainz).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/35

### D-034  S3  open  ui-neu  origin #76

**Title.** SessionRoutesCard cannot display or create a route to a compatible-but-different-media-type session the backend accepts (e.g. movie → iso-dump session, movie → tv session).

**Where.** `services/ui-neu/frontend/src/lib/components/settings/SessionRoutesCard.svelte:38-40` (`sessionsFor` strict `s.media_type === mediaType`) and `:159-176` (select `value={route?.session_id ?? ''}` over those options) at `4580f65a`/`88eee5de` (head `517defe3`).

**What.** Commit 79969314 made `PUT /api/session-routes` accept any `_media_types_compatible` pairing (tests `test_upsert_movie_route_to_iso_session_accepted`, `..._to_tv_session_accepted`), and the resolver honours such routes. The card only offers sessions whose media_type equals the row's media_type, so (a) an admin cannot create a movie→iso route from the UI, and (b) an existing one (created via API, or a tv session routed for movie discs) renders in the Movie grid row with a `<select>` whose value matches no option — the row reads as none/blank while the backend route is live and winning resolution. The "Other routes" fallback (88eee5de) only catches rows whose *media_type/disc_type* are off-grid, not off-filter sessions. Workaround: the Clear button still appears for the row.

**Repro / evidence.** `curl -X PUT /api/session-routes -d '{"media_type":"movie","disc_type":null,"session_id":"<iso session id>"}'` (200), then open Settings › Sessions: the Movie / Any disc select shows no selected session. Backend test proving acceptance: `services/backend/tests/test_session_routes_router.py::test_upsert_movie_route_to_iso_session_accepted`.

**Tip check.** Still present at `71129cd9`: `SessionRoutesCard.svelte:39-41` (`return sessions.filter((s) => s.media_type === mediaType);`).

**Suggested fix location.** feat/phase3-session-routing — filter options with the same compatibility matrix the backend uses (movie/tv ∪ iso/data for video rows), or at least include the currently-routed session in the option list.

**Verification.** Code read at head and tip; backend acceptance confirmed by the PR's own router tests.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/36

### D-035  S4  open  backend  origin #76

**Title.** Three new backend statements are uncovered (100%-statement policy): factory-raise branch and old-client close guard in the SSH-rebuild path; blank-output_path skip in find_collisions.

**Where.** `services/backend/arm_backend/transcode_dispatcher.py:594-600` and `:620-621`, `services/backend/arm_backend/transcode_apply.py:191` at `4580f65a` (PR head `517defe3`).

**What.** `uv run coverage run -m pytest -q && uv run coverage report` at the PR head reports these lines as missed. They are new in this PR (`git blame` → 4580f65a) and carry no `pragma: no cover`. The `except Exception as factory_exc: ... raise` branch (docker factory raising), the `except Exception: pass` around `old_docker.close()`, and the `if not row.output_path: continue` guard have no test at this PR's head.

**Repro / evidence.**

```
services/backend/arm_backend/transcode_apply.py           142      1     58      2    98%   191, 193->189
services/backend/arm_backend/transcode_dispatcher.py      294      5     82      2    98%   217->239, 558->563, 594-600, 620-621
```

**Tip check.** OPEN. On the tip the lines are covered by tests added in `0048ca44` ("test(backend): cover the remaining 45 uncovered statements": `test_transcode_dispatcher.py` asserts "rebuild failed" and `dead.close.side_effect = RuntimeError(...)`; `test_transcode_apply_full.py::test_find_collisions_skips_live_rows_without_output_path`). `git branch -r --contains 0048ca44` → only `origin/integration/all-prs-3` — fixed only on the integration tip by `0048ca44`, which is in no open PR.

**Suggested fix location.** feat/phase3-session-routing — cherry-pick the three tests from 0048ca44 (or add `pragma: no cover` with justification on the two best-effort except blocks).

**Verification.** Ran coverage at head; grep'd tip tests; branch containment checked.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/37

### D-036  S4  open  docs  origin #76

**Title.** Stale migration references in model docstrings/comments after the 0034/0035 renumber and the conditional seed-marker UPDATE.

**Where.** `packages/arm_common/arm_common/models/session_route.py:89` ("see migration 0033's docstring") and `packages/arm_common/arm_common/models/config.py:97-98` ("See migration 0035_session_routes_seed_marker for why it defaults true on any already-deployed Postgres DB") at `345892b8`/`96aa8fcc` (head `517defe3`).

**What.** The routing table migration is `0034_session_routes`, not 0033 (`0033_drop_metadata_mirrors` is PR #75's). And 0035 sets `session_routes_seeded=true` only `WHERE EXISTS (SELECT 1 FROM session_routes)` (96aa8fcc) — on an already-deployed DB without routes it stays `false`; the config.py comment still describes the pre-96aa8fcc unconditional behaviour and contradicts the migration's own docstring.

**Repro / evidence.** `grep -n "0033" packages/arm_common/arm_common/models/session_route.py`; `grep -n "defaults true" packages/arm_common/arm_common/models/config.py` vs `migrations/versions/0035_session_routes_seed_marker.py:66-72`.

**Tip check.** Still present at `71129cd9`: `session_route.py:25` ("see migration 0033's docstring"), `config.py:127` ("why it defaults true on any already-deployed Postgres DB").

**Suggested fix location.** feat/phase3-session-routing — same PR introduced both comments.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/38

### D-037  S4  open  backend  origin #76

**Title.** Concurrent `PUT /api/session-routes` for the same `(media_type, disc_type)` turns the NULLS-NOT-DISTINCT unique violation into a 500 (acknowledged follow-up).

**Where.** `services/backend/arm_backend/routers/session_routes.py:52-87` at `4580f65a` (head `517defe3`).

**What.** The upsert is select-then-insert with no `IntegrityError` handling; two writers racing on a new key both pass the `existing is None` check and the second `commit()` raises `IntegrityError` → unhandled 500 (jobs.py's apply path handles the same class → 409). The PR body lists "IntegrityError → 409 on concurrent route upserts" as a deliberate follow-up; recorded here so it does not fall off the register. Workaround: retry the PUT (it then updates in place).

**Repro / evidence.** Needs real Postgres (the fake-session tier has no unique index): two parallel `PUT /api/session-routes` with identical body for an unrouted key; second returns 500.

**Tip check.** Still present at `71129cd9`: `routers/session_routes.py` upsert has no `except IntegrityError` (grep).

**Suggested fix location.** feat/phase3-session-routing — mirror jobs.py's `except IntegrityError: rollback; 409`.

**Verification.** Code read; not executed (needs Postgres).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/39

### D-038  S2  open  backend  origin #73

**Title.** Stored bash secret can be unmasked through PATCH with a script name that is not on disk (claimed-impossible `secret_keys` forgery).

**Where.** `services/backend/arm_backend/notifications/bash_hook.py:188-191` (`storage_config` FileNotFoundError fallback trusts `incoming["secret_keys"]`) and `:161-172` (`merge_bash_config` substitutes the stored value for `<hidden>` before that), called from `services/backend/arm_backend/routers/notifications.py:271-276` at `1db7341b` (introduced in `961e6327` "secret_keys is server-owned and script errors are redacted").

**What.** An authenticated writer (admin role) PATCHes a bash channel with `{"config": {"type":"bash","script":"does-not-exist.sh","inputs":{"SMTP_PASS":"<hidden>", ...}}}`. `merge_bash_config` replaces `<hidden>` with the stored clear-text secret; `storage_config` cannot read a header for the missing file and takes `secret_keys` from the request, which `BashChannelConfig` defaults to `[]`. The stored config now has the secret in `inputs` with `secret_keys == []`, so `mask_bash_config` on the next GET returns it in clear (the attacker then PATCHes the script name back). Expected: when the script header cannot be read, keep the *existing* channel's `secret_keys` (and never let the request body shrink the set), or refuse a `<hidden>` input whose key is not in the resulting secret set.

**Repro / evidence.** Scratch fake-session router test at head (not committed) using the PR's own `_bash_channel()` fixture (stored `inputs.SMTP_PASS="pw"`, `secret_keys=["SMTP_PASS"]`):
```
PATCH /api/notifications/channels/ncl_b  {"config":{"type":"bash","script":"does-not-exist.sh","inputs":{"TO":"me@x","SMTP_PASS":"<hidden>"}}}  -> 200
BEFORE {'script': 'ok.sh', 'inputs': {'TO': 'me@x', 'SMTP_PASS': '<hidden>'}, 'secret_keys': ['SMTP_PASS']}
AFTER  {'script': 'does-not-exist.sh', 'inputs': {'TO': 'me@x', 'SMTP_PASS': 'pw'}, 'secret_keys': []}
```
The PR's own test `test_storage_config...` (test_notifications_bash_hook.py:173-177) asserts the fallback "keeps the caller's secret_keys" — i.e. it tests the forgeable behaviour. Severity S2 rather than S1 because `require_writer` is admin-only (`auth.py:124-129`), so this is admin→admin read-back of a value the same role could overwrite; it is still a stated security property that is not delivered and a persisted clear-text secret.

**Tip check.** Still present at `71129cd9`: `git diff 1db7341b origin/integration/all-prs-3 -- services/backend/arm_backend/notifications/bash_hook.py` is empty; router bash paths unchanged (only `inbox_dismiss_all` differs). No straggler fixes it.

**Suggested fix location.** feat/notifications-bash-channel — the PR introduces `storage_config`; in `patch_channel` pass the existing channel's `secret_keys` as the fallback (union with incoming) instead of the request's.

**Verification.** Reproduced with the scratch test above at head (3 runs), then file removed; `git status` clean.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/40

### D-039  S3  open  backend  origin #73

**Title.** `POST /scripts/preview` with `run: true` returns script stdout/stderr/error unredacted, including stored secret values merged in via `channel_id`.

**Where.** `services/backend/arm_backend/routers/notifications.py:380-384` at `1db7341b` (`result = await run_script(...)` returned as-is; `redact_secrets` is applied only in `_bash_send` at `:463` and in `BashListener` at `bash_listener.py:65`).

**What.** The preview endpoint deliberately lets a caller fill `<hidden>` inputs from the stored channel (`channel_id`) and run the script. If the script echoes an input (`set -x`, `env`, a curl error quoting `--user`), the stored secret comes back in `result.stdout`/`stderr`/`error` and is rendered in the Test panel (`BashTestPanel.svelte:290-291`). The dispatch and `/channels/{id}/test` paths redact the same output before persisting; the preview should apply `redact_secrets` to all three fields.

**Repro / evidence.** Scratch router test at head: script `echo "pass=$SMTP_PASS"; echo "err=$SMTP_PASS" >&2; exit 1`, stored channel with `SMTP_PASS="pw"`; `POST /scripts/preview {"channel_id":"ncl_b","run":true,"config":{...,"inputs":{"SMTP_PASS":"<hidden>"}}}` → 200 with `result.stdout == "pass=pw\n"`, `result.stderr == "err=pw\n"`, `result.error == "script exit code 1: err=pw"`, while `inputs.SMTP_PASS == "<hidden>"` in the same response.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/routers/notifications.py:380-384` identical (router diff head→tip touches only `inbox_dismiss_all`).

**Suggested fix location.** feat/notifications-bash-channel — wrap `result` fields with `redact_secrets(..., run)` in `preview_script`.

**Verification.** Reproduced with scratch test at head; file removed afterwards.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/41

### D-040  S3  open  backend  origin #73

**Title.** Timeout kills only the `bash` process; the script's children keep running (no process group / `killpg`).

**Where.** `services/backend/arm_backend/notifications/bash_runner.py:67-81` at `1db7341b` (`create_subprocess_exec(...)` without `start_new_session=True`; `proc.kill()` on timeout).

**What.** On timeout `proc.kill()` SIGKILLs bash; whatever bash was waiting on (`curl`, `sleep`, an SMTP client) is reparented and keeps running with the backend's resources, every tick, for every stuck hook. The PR body claims "timeout kill/reap". Expected: start the hook in its own session/process group and `os.killpg(proc.pid, SIGKILL)` on timeout.

**Repro / evidence.** Scratch script against head's `run_script` (Python 3.14.8): hook `sleep 8`, `timeout_seconds=1` → result `script timed out after 1s` returned at 1.03s, and `pgrep -af 'sleep 8'` immediately after shows the orphaned `sleep 8` still alive. The PR's `test_run_script_timeout` (test_notifications_bash_runner.py:119-122) asserts only the result object, not the tree.

**Tip check.** Still present at `71129cd9`: `bash_runner.py` byte-identical to head.

**Suggested fix location.** feat/notifications-bash-channel.

**Verification.** Empirical, see above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/42

### D-041  S3  open  backend  origin #73

**Title.** A hook that exits 0 but leaves a background child holding stdout/stderr is recorded as a timeout failure.

**Where.** `services/backend/arm_backend/notifications/bash_runner.py:78-89` at `1db7341b` (`wait_for(proc.communicate(), timeout)` — completion is gated on pipe EOF, not process exit).

**What.** The v2 `BASH_SCRIPT` idiom of kicking off long work in the background (`long-task &` / `nohup ... &`, `exit 0`) keeps the inherited stdout/stderr pipes open, so `communicate()` never returns until the child exits; the run is reported "script timed out after Ns", `last_error` is set, the dispatch-log row is `success=false`, and the channel shows red, although the script succeeded. The docs never mention that background children must redirect their fds. Expected: await process exit and treat open pipes after exit as success (drain with a short grace), or document the `>/dev/null 2>&1 &` requirement.

**Repro / evidence.** Scratch script at head: hook `sleep 8 &\nexit 0`, `timeout_seconds=1` → `ok=False, error="script timed out after 1s: bg.sh"` after 1.0s, even though bash had exited 0 immediately.

**Tip check.** Still present at `71129cd9`: `bash_runner.py` identical.

**Suggested fix location.** feat/notifications-bash-channel (same hunk as C3).

**Verification.** Empirical, see above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/43

### D-042  S3  open  backend  origin #73

**Title.** `OSError` from `create_subprocess_exec` (e.g. E2BIG from an input template with a width spec) is uncaught: 500 on preview, and the listener skips bookkeeping and the remaining bash channels for that event.

**Where.** `services/backend/arm_backend/notifications/bash_hook.py:64-68` (`_render_input` has no output cap, unlike `resolve_title_body`'s 4000/16000 caps at `notification_format.py:95-100`) and `bash_runner.py:67-76` (no `except OSError`), surfaced at `routers/notifications.py:380-383` (`preview_script`) and `bash_listener.py:61-67` (only `HookError` is caught) at `1db7341b`.

**What.** An input value like `{job_title:>300000}` (any writer can type it) renders to a 300 kB env var; Linux `MAX_ARG_STRLEN` (128 kB) makes `execve` fail with `OSError: [Errno 7] Argument list too long`. `preview_script(run=True)` returns 500; in `BashListener.handle` the exception escapes the per-channel try (which only catches `HookError`), so `last_*`/dispatch-log are not written for that channel and the `for channel in targets` loop aborts before later bash channels; the dispatcher logs it and marks the event notified. Expected: cap rendered input length like title/body, and convert `OSError` from spawn into a `BashRunResult(ok=False, error=...)`.

**Repro / evidence.** `prepare_run(config={"script":"echo.sh","inputs":{"TO":"{job_title:>300000}"}}, ...)` then `run_script(...)` at head → `OSError [Errno 7] Argument list too long: '/usr/bin/env'`. Scratch router test: `POST /scripts/preview {"run": true, "config": {..., "inputs": {"TO": "{job_title:>300000}"}}}` → HTTP 500.

**Tip check.** Still present at `71129cd9`: `bash_hook.py`, `bash_runner.py`, `bash_listener.py` identical to head.

**Suggested fix location.** feat/notifications-bash-channel.

**Verification.** Empirical at head (python script + scratch router test).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/44

### D-043  S3  open  devtools  origin #73

**Title.** `install.sh` (the canonical installer) neither creates `scripts/` nor mounts `/scripts` into `arm-backend`, so installer-deployed stacks cannot use bash hooks without a hand-written override.

**Where.** `install.sh:311` (creates/chmods only `raw media logs`) and `install.sh:1393-1399` (arm-backend `volumes:` block: `./raw`, `./media`, `./logs`, certs, docker.sock — no `./scripts:/scripts:ro`) at `1db7341b`; the mount exists only in `docker-compose.yml.example:98` (used by `devtools/setup-dev.sh`).

**What.** Memory `feedback_ui_port_8081.md`: "the installer is the source of truth for deployment values". With `install.sh` the backend has no `/scripts`; `list_scripts` returns `[]` and the picker says "No scripts found" forever. The PR body acknowledges this ("install.sh is untouched (legacy); the mount is logged for the installer rewrite") and documents a `docker-compose.override.yml` workaround in `docs/ops/notification-scripts.md:20-31`, hence S3 not S2.

**Repro / evidence.** `grep -n "scripts" install.sh` at head → no mount, no mkdir; same at tip (`git show origin/integration/all-prs-3:install.sh | grep -n "scripts:ro\|arm/scripts"` → empty).

**Tip check.** Still present at `71129cd9`: tip `install.sh:1396` block still lacks the mount; no PR in the stack adds it.

**Suggested fix location.** feat/notifications-bash-channel (or #83 feat/setup-dev-stack-lifecycle, which touches deployment scripts) — add `mkdir -p "$PREFIX/scripts"` next to line 311 and `- ./scripts:/scripts:ro` to the backend volumes template.

**Verification.** Code reading of both heads; untested on a live installer run.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/45

### D-044  S3  open  backend  origin #73

**Title.** An unreadable file in `/scripts` makes `GET /api/notifications/scripts` 500 for every script (PermissionError not handled).

**Where.** `services/backend/arm_backend/notifications/script_meta.py:121-123` (`_read_head` opens every entry) called unguarded from `list_scripts` at `:158` and from `read_script_info` at `:134`; `get_scripts` at `routers/notifications.py:331-333` and `get_script` at `:388-394` (catches only `ValueError, FileNotFoundError`) at `1db7341b`.

**What.** The mount is a host directory edited as root; a file copied with `sudo cp` under a 077 umask, or deliberately `chmod 700 root:root` because it embeds a token, is listed by `iterdir()`/`is_file()` but `open("rb")` raises `PermissionError` for the PUID user. The whole listing 500s, so the picker shows "Could not list scripts" and no bash channel can be created or edited until the operator finds the offending file. Expected: skip unreadable entries (or report them `executable: false` with a reason) and 404/422 on detail.

**Repro / evidence.** Code path: `list_scripts` → `_read_head(p)` → `path.open("rb")`; no `except OSError` anywhere in `script_meta.py` (`grep -n "PermissionError\|OSError" script_meta.py` → none). Cannot trigger EACCES as root in this sandbox.

**Tip check.** Still present at `71129cd9`: `script_meta.py` identical to head.

**Suggested fix location.** feat/notifications-bash-channel.

**Verification.** Code reading; to confirm on a host: `sudo install -m 700 -o root /dev/null arm/scripts/x.sh` then `GET /api/notifications/scripts` as admin.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/46

### D-045  S4  open  devtools  origin #74

**Title.** Style lint misses `style={…}` bindings and value-less `style:prop` shorthand; the PR itself relies on the gap.

**Where.** `devtools/ui-neu-style-lint.mjs:66-73` at `2ed17bf2` (introduced in `390ea291`); escapees at `services/ui-neu/frontend/src/routes/jobs/[id]/+page.svelte:295`, `src/lib/components/PosterImage.svelte:34,47`, `src/lib/components/Skeleton.svelte:14-15`.

**What.** Rule 1 is `/\sstyle="([^"]*)"/` and rule 2 is `/\sstyle:([a-zA-Z-]+)=/`. A Svelte `style={expr}` attribute, a single-quoted `style='…'`, and the shorthand directive `style:width` (no `=`) are never visited, so arbitrary inline CSS passes the gate. At base the job page had `style="aspect-ratio: {…}"` (`+page.svelte:302` at `1db7341b`), which this lint WOULD flag; commit `390ea291` changed it to `style={`aspect-ratio: ${…}`}` and the lint reports 0. Themes cannot override these inline declarations, which is exactly what the body says the system prevents.

**Repro / evidence.**

```
cd services/ui-neu/frontend && npm run lint:styles            # 0 violation(s) in 120 file(s)
grep -nE "\sstyle=\{|\sstyle:(width|height)\b" src/routes/jobs/[id]/+page.svelte src/lib/components/PosterImage.svelte src/lib/components/Skeleton.svelte
# +page.svelte:295  style={`aspect-ratio: ${job.disc_type === 'cd' ? '1/1' : '2/3'}`}
# PosterImage.svelte:34,47  style={styleStr || undefined}
# Skeleton.svelte:14-15  style:width / style:height
node -e "import('./devtools/ui-neu-style-lint.mjs').then(m=>console.log(m.lintSource('<div style={x} style:width></div>','a.svelte')))"   # []
```

**Tip check.** Still present at `71129cd9`: lint regexes unchanged (`git diff 2ed17bf2 71129cd9 -- devtools/ui-neu-style-lint.mjs` only adds comment-stripping in rule 4d, straggler `f4375669`, in no PR branch); escapees at tip `routes/jobs/[id]/+page.svelte:375`, `PosterImage.svelte:42,64`, `Skeleton.svelte:11` (`style:width style:height`).

**Suggested fix location.** chore/ui-neu-css-cleanup — extend rule 1 to `style=\{` and `style='`, rule 2 to `style:([a-zA-Z-]+)(?=[\s=>/])`, then convert the job-page `aspect-ratio` to a `data-disc-type` rule (PosterImage/Skeleton dynamic sizes can go through `style:--w`/`style:--h` custom properties, which the lint already allows).

**Verification.** Ran lint and the greps above at head; read tip files.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/47

### D-046  S4  open  devtools  origin #74

**Title.** Lint is a ban-list, not the allow-list the body and the `ALLOWED` table describe; ~437 sizing/position utilities pass unchecked.

**Where.** `devtools/ui-neu-style-lint.mjs:25,57-58` at `2ed17bf2` (`// anything else is a vocabulary or local class: allowed`).

**What.** Tokens that match neither `ALLOWED` nor `BANNED_FAMILIES` are accepted. Tailwind families `w-*`/`h-*` (other than full/auto), `fixed`, `top-*`/`right-*` (other than 0), `object-*`, `aspect-*`, `line-clamp-*`, `basis-*`, `h-screen`, fractional sizes are all in that gap. A future `w-[37px]`-free but still arbitrary `w-96 fixed top-1 right-1` will pass, contradicting "bans utility styling outside the allowed layout families" and the "0 violations" table. (Icon sizing `h-4 w-4` is explicitly intended per `Glyph.svelte` comment; the rest is not.)

**Repro / evidence.**

```
cd services/ui-neu/frontend && node /tmp/claude-0/-home-user/e06fb963-3780-5816-b936-b6d6249b1440/scratchpad/pr74-leak.mjs
# distinct leaked tokens 51 total 437
# table-cell:84 table-header:69 w-4:34 h-4:33 ... fixed:4 top-1:2 right-1:2 h-screen:1 aspect-square:1 object-cover:1 line-clamp-2:2 basis-full:2 h-2/5:1 w-2/5:1 max-w-0:1
# e.g. src/lib/components/PosterImage.svelte:11 'poster-image h-28 w-20 shrink-0 object-cover'; TitleSearch.svelte:239 'line-clamp-2'; DriveMaintenance.svelte:53 'basis-full'
```

**Tip check.** Still present at `71129cd9`: `ALLOWED`/`BANNED_FAMILIES` unchanged; `object-cover` (2 files), `h-screen`, `aspect-square`, `line-clamp-2`, `basis-full`, `top-1`/`right-1` (2 files), `h-2/5` all still in tip `.svelte` sources.

**Suggested fix location.** chore/ui-neu-css-cleanup — either add the sizing/position families to `ALLOWED` explicitly (and say so in `docs/ui-neu-theming.md`) or flip the default to "unknown Tailwind-shaped token = violation"; the body's claim should match the code either way.

**Verification.** Script above at head; `git grep` on the tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/48

### D-047  S4  open  docs  origin #74

**Title.** `THEME_TEMPLATE.md` still requires the alias tokens this PR removed and nothing consumes.

**Where.** `services/ui-neu/THEME_TEMPLATE.md:95-105` (JSON skeleton), `:112` ("13 required CSS custom properties"), `:131-140` (Token Reference) at `2ed17bf2` (file untouched by the PR).

**What.** The template tells theme authors to set `--color-primary-dark`, `--color-primary-light-bg`, `--color-primary-light-bg-dark`, `--color-primary-border` ("Deep accent for borders/outlines", "highlighted row/card bg"). After this PR `tokens.css` drops them (`tokens.test.ts` asserts they stay gone) and no CSS anywhere reads them: `grep -rn "var(--color-primary-light-bg\|var(--color-primary-border\|var(--color-primary-dark" src static docs` → 0 hits at head. `applyTokens` (`colorScheme.ts`) still writes whatever keys a scheme supplies, so the tokens are set but dead. The new `docs/ui-neu-theming.md` never mentions `THEME_TEMPLATE.md`, so authors following the template get silently ignored tokens and no pointer to the real contract.

**Repro / evidence.**

```
sed -n 95,105p services/ui-neu/THEME_TEMPLATE.md      # lists the 4 dead tokens as required
git grep -n "var(--color-primary-light-bg\|var(--color-primary-border\|var(--color-primary-dark" 2ed17bf2 -- services/ui-neu docs   # (no output)
```

**Tip check.** Still present at `71129cd9`: `git diff 2ed17bf2 71129cd9 -- services/ui-neu/THEME_TEMPLATE.md` is empty; same `git grep` on the tip returns nothing.

**Suggested fix location.** chore/ui-neu-css-cleanup — rewrite the template's token list to the `tokens.css` roles (or delete it and point at `docs/ui-neu-theming.md`), since this is the PR that retired the aliases.

**Verification.** greps above at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/49

### D-048  S4  open  docs  origin #74

**Title.** `.claude/memory/MEMORY.md` index drops the em-dash entry and omits three new memory files.

**Where.** `.claude/memory/MEMORY.md:16` at `2ed17bf2`; dropped by `d863ba2a` ("memory: special-character rule is correction only, not rewording"), first contained in `origin/chore/ui-neu-css-cleanup`.

**What.** The PR's diff replaces the `[No em-dashes in UI copy](feedback_no_em_dashes_in_ui_copy.md)` index line with the Standard-UI-patterns line instead of adding it, while the em-dash file is still present (and modified in this same diff). The diff also adds `feedback_glyph_icons_not_emoji.md`, `feedback_install_sh_legacy.md`, `feedback_no_session_links.md` without index lines. CLAUDE.md: "When saving a new memory … update MEMORY.md there" and "read MEMORY.md — it's a short index (one line per entry)". Un-indexed entries are never read at session start.

**Repro / evidence.**

```
comm -13 <(grep -oE "\]\([a-z_0-9-]+\.md\)" .claude/memory/MEMORY.md | tr -d '](' | tr -d ')' | sort) <(ls .claude/memory | grep -v MEMORY.md | sort)
# feedback_glyph_icons_not_emoji.md  feedback_install_sh_legacy.md  feedback_no_em_dashes_in_ui_copy.md  feedback_no_session_links.md
git diff origin/feat/notifications-bash-channel...2ed17bf2 -- .claude/memory/MEMORY.md   # -No em-dashes line / +Standard UI patterns line
```

**Tip check.** Partially fixed: `feedback_no_session_links.md` is indexed on the tip (`MEMORY.md:23`); `feedback_no_em_dashes_in_ui_copy.md`, `feedback_glyph_icons_not_emoji.md`, `feedback_install_sh_legacy.md` are still un-indexed at `71129cd9` → OPEN (partial fix noted).

**Suggested fix location.** chore/ui-neu-css-cleanup — restore the em-dash line and add the three missing lines.

**Verification.** Commands above at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/50

### D-049  S4  open  ui-neu  origin #74

**Title.** Markup rewrite leaves ARIA state/label attributes on role-less elements (files-page root tabs, channel-type label).

**Where.** `services/ui-neu/frontend/src/routes/files/+page.svelte:480` and `src/lib/components/notifications/AddChannelForm.svelte:83` at `2ed17bf2` (both from `390ea291`).

**What.** The files page's `<nav aria-label="File root tabs">` (base `1db7341b`) became `<div class="tabs" aria-label="File root tabs">` with no `role`: `aria-label` is prohibited on a generic element (ARIA 1.2; axe `aria-prohibited-attr`) and the navigation landmark is lost, while every other tab strip in the PR kept a role (`role="tablist"` in SessionsArea:237, `role="radiogroup"` in LogView:146/160 and InterfaceSettings:50, `<nav>` in settings:315). `AddChannelForm` gained `<label … aria-checked={…}>` as a styling hook; `aria-checked` is not permitted on `label` (the hidden radio input already carries the state). The body's "unruled `role` additions … resolved" removed roles but left the orphaned ARIA attributes.

**Repro / evidence.**

```
grep -n 'aria-label="File root tabs"' src/routes/files/+page.svelte        # 480: <div class="tabs" aria-label="File root tabs">
grep -n 'aria-checked' src/lib/components/notifications/AddChannelForm.svelte   # 83: <label class="channel-type-option" aria-checked={type === t.key}>
```

**Tip check.** Still present at `71129cd9`: `routes/files/+page.svelte:496` (`<div class="tabs" aria-label="File root tabs">`), `AddChannelForm.svelte:110` (`aria-checked` on `<label>`), styled via `.channel-type-option[aria-checked='true']` at `:255`.

**Suggested fix location.** chore/ui-neu-css-cleanup — restore `<nav>` (or `role="tablist"` as SessionsArea does) on the files tabs; swap the label hook to `data-selected` or `:has(input:checked)`.

**Verification.** Read head and tip sources.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/51

### D-050  S3  open  ui-neu  origin #81

**Title.** `wsClient.start()` during the reconnect back-off clears the "Live updates unavailable" banner with no backend change (and opens a duplicate socket).

**Where.** `services/ui-neu/frontend/src/lib/api/ws.ts:49-53` (`start()`: `if (this.ws !== null) return; … statusStore.set('connecting'); this.connect();`) at `b2b7dad5`; status machine at `ws.ts:113`.

**What.** After a drop, the close handler sets `this.ws = null` and arms `reconnectTimer`; after the second failure `wsStatus` is `'offline'` and the banner shows. `start()` only guards on `this.ws !== null`, so any later `start()` call made while the timer is pending (a) resets `wsStatus` to `'connecting'`, hiding the banner although the backend is exactly as unreachable as before, and (b) opens a socket immediately while the pending timer fires a second one. `start()` is reached on every page mount: dashboard `routes/+page.svelte:228,233` (`startWS()`, `startRipperEvents()`), job detail `routes/jobs/[id]/+page.svelte:179`; `stopWS()` (`stores/rips.svelte.ts:50`) never calls `wsClient.stop()`, so the client is never in `idle` once started and every dashboard<->job navigation re-enters `start()`. The banner should stay until a connection actually authenticates, as the PR body and the component comment promise ("holds until a connection actually authenticates"). The duplicate-socket half is pre-existing at BASE (same guard); the status reset is new in this PR.

**Repro / evidence.** Added `services/ui-neu/frontend/src/lib/api/__tests__/ws.repro-pr81.test.ts` (same FakeWS harness as `ws.test.ts`); passes at head, i.e. the defect reproduces:
```ts
wsClient.start(); authAck(FakeWS.instances[0]);
FakeWS.instances[0].emit('close', {}); vi.advanceTimersByTime(1000);
FakeWS.instances[1].emit('close', {});
expect(get(wsStatus)).toBe('offline');            // banner up
wsClient.start();                                  // page mount during back-off
expect(get(wsStatus)).toBe('connecting');          // banner gone, backend unchanged
expect(FakeWS.instances.length).toBe(3);           // immediate extra socket
vi.advanceTimersByTime(2000);
expect(FakeWS.instances.length).toBe(4);           // pending timer fires a 4th
```

**Tip check.** Still present at `71129cd9`: `services/ui-neu/frontend/src/lib/api/ws.ts:50-52` identical; callers multiplied — `routes/jobs/[id]/+page.svelte:241,249`, `lib/stores/encoders.svelte.ts:76`, `lib/components/settings/GpusCard.svelte:156`, `lib/components/setup/steps/FinishStep.svelte:39` all call `wsClient.start()` on mount. `git log -S"statusStore.set('connecting')" origin/chore/ui-neu-css-cleanup..origin/integration/all-prs-3` shows only b2b7dad5.

**Suggested fix location.** feat/ws-origins-live-status — in `start()` return early when `this.reconnectTimer !== null` (the back-off already owns the retry), and only set `'connecting'` from the idle state (`retryIdx === 0`), so the banner is cleared solely by the auth-ack path at `ws.ts:137`.

**Verification.** Reproduced with the vitest above at head (1560 passed including it); same code at tip by `git show`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/52

### D-051  S3  fixed-later  devtools  origin #81

**Title.** Emptying the `ARM_ALLOWED_ORIGINS` default breaks WS for the Vue `arm-ui` on 8081 (the image install.sh deploys and the dev compose's 8081 service), whose nginx never forwards `X-Forwarded-Host`.

**Where.** `.env.example:45` (`ARM_ALLOWED_ORIGINS=`) at `b2b7dad5`, against `services/ui/nginx.conf:38-46` (`location = /ws { … proxy_set_header Host arm-backend; }`, no `X-Forwarded-Host`), `docker-compose.yml.example:140-149` (`arm-ui` -> `services/ui/Dockerfile`, `8081:443`), `.github/workflows/release.yml:49` (`service: [backend, ripper, transcode, ui]`).

**What.** `devtools/setup-dev.sh:251-265` creates `.env` from `.env.example`, and `setup-dev.sh:345` tells the developer to open `https://localhost:8081`, which at this commit is the Vue UI. Its nginx rewrites `Host` to `arm-backend` and this PR only adds `X-Forwarded-Host/-Proto` to ui-neu's `nginx.conf:55-56` and the vite proxy. The backend therefore compares Origin `https://localhost:8081` to `https://arm-backend` and closes with 1008 — exactly the "silent retry forever" the PR set out to fix, now on the canonical port with a fresh dev `.env`. The installed deployment is unaffected only because `install.sh:1159` still hardcodes `https://localhost:8081`, which also means G-28 (LAN IP / hostname) remains open for the published `arm-ui` image at this commit. Workaround: set `ARM_ALLOWED_ORIGINS` manually.

**Repro / evidence.**

```bash
# at b2b7dad5
grep -n "X-Forwarded-Host" services/ui/nginx.conf      # no output
grep -n "^ARM_ALLOWED_ORIGINS=" .env.example           # 45:ARM_ALLOWED_ORIGINS=
DATABASE_URL=postgresql://x:x@localhost/x ARM_SERVICE_TOKEN=x uv run python -c "from arm_backend.ws.router import _origin_allowed, settings; settings.ARM_ALLOWED_ORIGINS=[]; print(_origin_allowed('https://localhost:8081', [], request_host='arm-backend'))"   # prints False (verified at head)
```

**Tip check.** Fixed by #89 (chore/remove-vue-ui) in `daddb6a4` ("chore(ui): remove the Vue UI; ui-neu becomes arm-ui on 8081" — deletes `services/ui/`, compose has a single `arm-ui` on `8081:443` built from ui-neu whose nginx carries the forwarded headers); `git branch -r --contains daddb6a4` -> origin/chore/remove-vue-ui and above. Recommend: **move down** — merged alone, #81 leaves the 8081 UI (the one install.sh ships and setup-dev.sh points at) with no live updates on every fresh dev `.env`; a two-line `proxy_set_header X-Forwarded-Host $http_host; X-Forwarded-Proto $scheme;` in `services/ui/nginx.conf` (or keeping the 8081 default in `.env.example` until #89) closes it.

**Suggested fix location.** feat/ws-origins-live-status — same nginx hunk as `services/ui-neu/nginx.conf:52-56`, applied to `services/ui/nginx.conf`.

**Verification.** Static (nginx config + `_origin_allowed` evaluation); end-to-end confirmation needs the compose stack (`bash devtools/setup-dev.sh up`, open `https://localhost:8081`, watch the backend log for "origin not allowed") — untested here, no Docker.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/53

### D-052  S4  open  backend  origin #81

**Title.** Stale test docstring: "empty allowlist means service-token only" contradicts the same PR's same-origin default.

**Where.** `services/backend/tests/test_ws_origin.py:41` at `b2b7dad5`.

**What.** The test keeps the Phase-4 wording while the PR changes the semantics: an empty allowlist now accepts same-origin browsers; the assertion only still passes because no `request_host` is supplied (the `if not host: return False` branch at `router.py:83-84`). The docstring should say "no host context and empty allowlist -> rejected".

**Repro / evidence.**

```
41:    """Phase 4 default: empty allowlist means service-token only."""
```

**Tip check.** Still present at `71129cd9`: `services/backend/tests/test_ws_origin.py:41` identical (`git log -S"Phase 4 default: empty allowlist" origin/chore/ui-neu-css-cleanup..origin/integration/all-prs-3` is empty).

**Suggested fix location.** feat/ws-origins-live-status — one-line docstring edit.

**Verification.** Read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/54

### D-053  S2  fixed-later  devtools  origin #83

**Title.** `setup-dev.sh up` force-removes rippers/transcoders with work in flight — a routine redeploy kills a running rip.

**Where.** `devtools/setup-dev.sh:50-60` (`docker rm -f ${ids}`) invoked unconditionally from the `up` branch at `:400`, at `42cf7ea7` (introduced in `9e5828c9`).

**What.** `remove_spawned_containers` does not look at container state or at what is running inside it. On `up` it SIGKILLs any ripper mid-`makemkvcon`/`abcde`/`dd` and any transcoder mid-HandBrake. The previous documented path (`docker compose up -d --build`) never touched these containers, and CLAUDE.md in this same PR now mandates the new path, so the change makes the standard redeploy strictly more destructive with no check and no warning. The transcode is requeued by the dispatcher's stale threshold (attempt++ toward `ARM_TRANSCODE_MAX_ATTEMPTS`); the rip stays `RIPPING` until a backend restart runs `sweep_in_flight_jobs` (`main.py:194-200`) — and with C1 the backend may not restart, so the job is stuck with no ripper.

**Repro / evidence.** Diff hunk at head:
```
if [[ "${ACTION}" == "up" ]]; then
    remove_spawned_containers        # no running/active check
    echo "==> building + starting the stack"
    compose up -d --build
```

**Tip check.** Fixed by #85 (`feat/no-transcode-mode`, which carries the setup-dev hardening commits) in `34260a69` "harden setup-dev.sh up (build-first, DB backup, ripper guard, health wait)" + `d67096f2` (guards ACTIVE work only, idle rippers still replaced) + `3ecd0e58` (dd detection, bounded exec waits): tip `devtools/setup-dev.sh:483-519` `guard_running_spawned` refuses with exit 1 unless `--force` when a running `arm.task_id` container exists or a running ripper has makemkvcon/abcde/dd. `lowest_pr.sh 34260a69` -> #85 (the reviewer's `git branch -r --contains` reading of #89 was an alphabetical-listing artefact). Recommend: **move down** — #83 alone ships a mandated command that destroys in-flight work.

**Suggested fix location.** feat/setup-dev-stack-lifecycle — bring `guard_running_spawned` + `--force` down with the build-first ordering.

**Verification.** Code trace; untested-needs-hardware for the live effect: start a rip (or `bash devtools/iso-smoke.sh` mid-transcode), run `bash devtools/setup-dev.sh up`, observe the ripper/transcoder container is removed and the job status.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/55

### D-054  S3  fixed-later  devtools  origin #83

**Title.** `setup-dev.sh up` removes every ripper container but nothing respawns them when compose leaves the backend running.

**Where.** `devtools/setup-dev.sh:399-402` at `42cf7ea7` (introduced in `9e5828c9`); respawn is startup-only at `services/backend/arm_backend/main.py:252` (`reconcile_enrolled_rippers` is called only from `lifespan`; `grep -rn reconcile_enrolled_rippers services/backend` shows no other caller).

**What.** `up` runs `remove_spawned_containers` (docker rm -f of all `arm.drive_id` containers) and then `compose up -d --build`. The backend only reconciles enrolled drives → ripper containers in its lifespan hook. When the backend image/config is unchanged (UI-only change, or simply re-running `up`), compose does not recreate `arm-backend`, so every enrolled drive is left with no ripper until someone restarts the backend or re-enrolls. Same outcome if the build fails after the removal (removal happens before the build at head).

**Repro / evidence.**

```
bash devtools/setup-dev.sh up          # stack running, drive enrolled -> arm-ripper-<serial> exists
bash devtools/setup-dev.sh up          # no code change: "==> removing backend-spawned ripper/transcoder containers"
docker ps --filter label=arm.drive_id  # empty; `docker compose ps arm-backend` shows the SAME container, never restarted
```

**Tip check.** Fixed by #94 (`chore/ui-neu-ux-polish`) in `4f80aee3` "setup-dev up respawns rippers when the backend keeps running": records `backend_started_at` before `up`, `compose restart arm-backend` when unchanged (`respawn_rippers_if_needed`), and `34260a69` (#89) moved the removal AFTER the build. `git branch -r --contains 4f80aee3` includes `origin/chore/ui-neu-ux-polish` → not a straggler. Recommend: **move down** — #83 merged alone makes the documented "always use this" path strand enrolled drives on every no-op redeploy.

**Suggested fix location.** feat/setup-dev-stack-lifecycle — cherry-pick the `backend_started_at`/`respawn_rippers_if_needed` block and the build-before-remove ordering.

**Verification.** Code trace at head (main.py:240-255 is the only reconcile call site; `compose up -d --build` does not recreate an unchanged service). untested-needs-hardware for the live run: `bash devtools/setup-dev.sh up` twice on a box with one enrolled drive, then `docker ps --filter label=arm.drive_id`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/56

### D-055  S3  fixed-later  devtools  origin #83

**Title.** `arm-data:/data` named volume is created root-owned, so the EACCES this commit claims to fix persists.

**Where.** `docker-compose.yml.example:109-113,175-176` at `42cf7ea7` (commit 42cf7ea7 "persist /data on a named volume in the template"); `services/backend/Dockerfile` at the same sha has no `/data` directory; `services/_common/docker-entrypoint.sh:299` guards only `/logs /raw /media` and never chowns.

**What.** Docker seeds a new named volume from the image's content at the mount path; when the image has no `/data`, the daemon creates the mountpoint root:root 0755 and the volume stays root-owned. The backend drops to PUID via gosu and writes `/data/cache/thediscdb` and `/data/cache/images` (`config.py:42,45`), so every refresh still fails with `[Errno 13]`; `_thediscdb_refresh_loop` swallows it (`main.py:139-140` "never kill the loop") and logs a warning each cycle. The persistence goal of the commit is achieved, the stated EACCES fix is not; nothing fails fast because `/data` is not in the entrypoint guard list.

**Repro / evidence.**

```
grep -n '/data' services/backend/Dockerfile            # (nothing) at 42cf7ea7
sed -n 299p services/_common/docker-entrypoint.sh      # for d in /logs /raw /media; do   -> /data not guarded
docker volume create t && docker run --rm -v t:/data python:3.14-slim-bookworm stat -c '%u:%g %a' /data   # 0:0 755
```

**Tip check.** Fixed by #85 (`feat/no-transcode-mode`, which carries the infra commits) in `b399d010` "bake /data ownership so fresh arm-data volumes are writable" (tip `services/backend/Dockerfile:53-55` `mkdir -p /data/cache/images /data/cache/thediscdb /data/themes && chown -R 1000:1000 /data && chmod -R 2775 /data`), `baa87ca9` (entrypoint guard now `for d in /logs /raw /media /data`, tip `docker-entrypoint.sh:299`), and `ff4578d5`/`60975f5d` (one-shot `arm-data-init` service re-owns the volume to PUID:PGID for non-1000 ids). `lowest_pr.sh b399d010` -> #85 (not #89 as first reported). Recommend: **move down** — at minimum `b399d010` belongs with the volume it makes usable; #83 alone adds a volume the backend cannot write.

**Suggested fix location.** feat/setup-dev-stack-lifecycle — Dockerfile `/data` seeding + entrypoint `/data` guard; `arm-data-init` can stay in #89.

**Verification.** Code inspection of Dockerfile/entrypoint at head + docker volume-seeding semantics. untested-needs-hardware for the end-to-end: `bash devtools/setup-dev.sh up && docker compose logs arm-backend | grep -i 'thediscdb.*Errno 13'`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/57

### D-056  S4  open  docs  origin #83

**Title.** Contributor docs still tell people to use bare `docker compose up -d`, which this PR's CLAUDE.md says never to do.

**Where.** `CONTRIBUTING.md:65-66` and `arm_wiki/Contribute.md:32-33,43` at `42cf7ea7`; the rule they contradict is added at `CLAUDE.md:60-66` in `9e5828c9`.

**What.** CLAUDE.md now says "Always spin the stack up/down through `setup-dev.sh` — a bare `docker compose down` strands the backend-spawned ... containers", and the PR's `up` depends on being the entry point (it removes stale rippers before rebuild). CONTRIBUTING.md and the wiki Contribute page, the two documents a contributor actually reads, still give `bash devtools/setup-dev.sh` then `docker compose up -d` / `docker compose up -d --build --force-recreate`. The PR updated only CLAUDE.md.

**Repro / evidence.**

```
CONTRIBUTING.md:65:bash devtools/setup-dev.sh     # one-shot, idempotent dev-env setup
CONTRIBUTING.md:66:docker compose up -d           # bring up the stack
arm_wiki/Contribute.md:33:docker compose up -d --build      # build images from your working tree and start
```

**Tip check.** Still present at `71129cd9`: `CONTRIBUTING.md:65-66` (identical text) and `docs/developers/contributing/Contribute.md:32-33,43` (the wiki page moved by `a1b0c7c3`, same instructions). Not fixed by any PR or straggler.

**Suggested fix location.** feat/setup-dev-stack-lifecycle — replace both snippets with `bash devtools/setup-dev.sh up` / `down` alongside the CLAUDE.md change.

**Verification.** grep at head and at tip (above).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/58

### D-057  S3  untested-needs-hardware  backend  origin #84

**Title.** Removing the boot-time truncate makes orphaned BUSY GPU rows permanent: `cancel_running`'s docker-stop path (and deleting a spawned-but-unclaimed task) deletes the task row without releasing its GPU.

**Where.** `services/backend/arm_backend/main.py:87-105` (`_refresh_gpu_inventory`, early `return` at :105 when rows exist) and `services/backend/arm_backend/transcode_dispatcher.py:746-804` (`cancel_running`: `container.stop(timeout=5)` at :789 ... `await db.delete(row)` at :804, no `release_gpu_for_task`) at `ed087cf2`.

**What.** A GPU claim is `gpus.status=BUSY` + `claimed_by_task_id`, released only by the transcoder's `/complete` / `/fail` call or by `sweep_stale_claims` (which only looks at IN_PROGRESS tasks). When a cancel falls through to `docker stop` (the transcoder has no SIGTERM handler, so no `/fail` is sent), or an operator deletes a task that has been spawned but has not yet called `/claim` (still QUEUED), the task row is deleted; the FK `ondelete="SET NULL"` nulls `claimed_by_task_id` but `status` stays `busy`. Before this PR every backend boot truncated and re-filled `gpus` from `ARM_GPUS`, which healed this. With seed-once the row is BUSY forever: NULL-hw_preference presets queue forever ("waiting for GPU"), `any` presets silently go CPU, and `/api/transcodes/stats` shows 0/N available. The DELETE 409 guard does not catch it (claimed_by_task_id is NULL), so the only recovery is delete-row + restart, or a manual UPDATE.

**Repro / evidence.**

```
# packages/arm_common/arm_common/models/gpu.py:32  ForeignKey("transcode_tasks.id", ondelete="SET NULL")  — status untouched
# transcode_dispatcher.py cancel_running: emit task.cancel -> sleep 10 -> container.stop(timeout=5) -> db.delete(row); no release_gpu_for_task(db, task_id)
# services/transcode/arm_transcode: no add_signal_handler / SIGTERM handling -> docker stop never produces a /fail call
```
Drill (needs a GPU host): start a GPU transcode, `docker pause` the transcoder so it ignores `task.cancel`, DELETE the task via the UI; after the 10 s grace, `SELECT status, claimed_by_task_id FROM gpus` shows `busy | NULL`; restart the backend — it stays `busy` (pre-PR it reset to `available`).

**Tip check.** Still present at `71129cd9`: `transcode_dispatcher.py` cancel_running (`container.stop(timeout=5)` at ~1256, `await db.delete(row)` at ~1271, no release in between; `git log -S'release_gpu_for_task' origin/feat/gpu-inventory-alignment..origin/integration/all-prs-3 -- transcode_dispatcher.py` is empty); `main.py:111-114` still returns early when rows exist, and no boot-time "BUSY with NULL claim" reconcile exists anywhere on the tip (`grep claimed_by_task_id` across arm_backend at tip: only release/claim sites).

**Suggested fix location.** feat/gpu-inventory-alignment — the PR that removed the truncate should add `await release_gpu_for_task(db, task_id)` before `db.delete(row)` in `cancel_running` and in the synchronous delete path of `routers/transcodes.py:delete_transcode`, plus a boot-time reconcile in `_refresh_gpu_inventory` (`status=BUSY AND claimed_by_task_id IS NULL` -> AVAILABLE, and BUSY rows whose task is terminal/missing).

**Verification.** Code trace (FK + both delete paths + absence of signal handling in arm_transcode); untested-needs-hardware for the end-to-end drill above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/59

### D-058  S3  open  ui-neu  origin #84

**Title.** Transcoder page per-device GPU rows are fetched once on mount and never refreshed, so their busy/available state contradicts the polled summary count.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:125-139` (`gpuRows` state at :125, `loadGpus()` called only from `onMount` at :139) at `ed087cf2`.

**What.** `stats`/`workers` stores poll, so "GPUs: 0/1 available" updates when the dispatcher claims a GPU, but `gpuRows` keeps the snapshot from page load and still renders a green dot + "available" (or keeps "busy" after the task finishes). The PR body sells these as "live status per GPU"; they are static until navigation.

**Repro / evidence.** Open /transcoder with an idle GPU, start a GPU transcode; the summary flips to 0/1 while the row below stays `available`. (No poll or `wsClient.subscribe('transcode.events', ...)` in the page; the Settings GpusCard on the tip did get a WS-driven reload, the transcoder page did not.)

**Tip check.** Still present at `71129cd9`: `routes/transcoder/+page.svelte:132-148` (`loadGpus()` only inside `onMount`; `grep -n "subscribe\|loadGpus"` shows no other caller).

**Suggested fix location.** feat/gpu-inventory-alignment — reload `gpuRows` on the same cadence as `stats` (or on `transcode.events`), as the tip's GpusCard does.

**Verification.** Code read of head and tip; vitest test only asserts the mounted snapshot.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/60

### D-059  S3  open  ui-neu  origin #84

**Title.** GpusCard never shows the "in use by a running transcode" message on a 409: it string-matches `'409'` in a message the API client has already replaced with the server `detail`.

**Where.** `services/ui-neu/frontend/src/lib/components/settings/GpusCard.svelte:66-70` (`msg.includes('409')` at :68) at `ed087cf2`; client behaviour at `services/ui-neu/frontend/src/lib/api/client.ts:63-73` (`message = detail` at :68, `throw new ApiError(res.status, message, body)` at :73).

**What.** `handle()` throws `ApiError(res.status, message, body)` where `message = detail` whenever `detail` is a string; the backend's 409 detail is `"gpu is in use by a running transcode"`, so `e.message.includes('409')` is false and the operator sees the generic "Deleting the GPU failed." The test `a 409 delete shows the in-use message` passes only because it rejects with `new Error('HTTP 409')` — a shape the real client never produces (a test asserting on its own mock).

**Repro / evidence.**

```
// GpusCard.svelte
error = msg.includes('409') ? 'That GPU is in use by a running transcode. ...' : 'Deleting the GPU failed.';
// client.ts handle(): if (typeof detail === 'string') message = detail;  throw new ApiError(res.status, message, body);
// GpusCard.test.ts: mockDeleteGpu.mockRejectedValue(new Error('HTTP 409'));
```

**Tip check.** Still present at `71129cd9`: `GpusCard.svelte:142` (`error = msg.includes('409')`), `client.ts:80/92` unchanged (`message = detail; throw new ApiError(res.status, message, body)`).

**Suggested fix location.** feat/gpu-inventory-alignment — `e instanceof ApiError && e.status === 409`, and make the test reject with an `ApiError(409, 'gpu is in use by a running transcode', ...)`.

**Verification.** Code read of client + card + test at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/61

### D-060  S3  open  backend  origin #84

**Title.** Fresh install: the config seeder creates the singleton and returns before the `max_parallel_transcodes` backfill, so the column stays NULL until the second boot; meanwhile `/api/config` reports `1` while the dispatcher uses the env value.

**Where.** `services/backend/arm_backend/seeders.py:110-123` (`if existing is None: session.add(Config(...)); await session.flush(); return`) and `:135-140` (backfill only on the `existing` branch); view fallback at `services/backend/arm_backend/routers/config.py:73` (`... else 1`) at `ed087cf2`.

**What.** `Config(...)` is constructed without `max_parallel_transcodes`, so a first boot leaves it NULL. `max_parallel_transcodes(db, default=env)` falls back to `MAX_PARALLEL_TRANSCODES` (say 3), but `_to_view` hardcodes `1` for NULL, so Settings > Transcoding shows "1" while 3 containers run — UI state that lies about backend state for the whole first boot. It self-corrects on the next restart (the `existing` branch backfills), so there is a workaround.

**Repro / evidence.** `tests/e2e` app_client boots a fresh SQLite DB: after lifespan, `SELECT max_parallel_transcodes FROM config` is NULL; `GET /api/config` -> `max_parallel_transcodes: 1` regardless of `MAX_PARALLEL_TRANSCODES`.

**Tip check.** Still present at `71129cd9`: `seeders.py:108-122` creates the row and `return`s before the backfill at `:134-137`; `routers/config.py:90` still `else 1`.

**Suggested fix location.** feat/gpu-inventory-alignment — pass `max_parallel_transcodes=settings.MAX_PARALLEL_TRANSCODES` in the `Config(...)` constructor (or move the backfill above the early return), and make `_to_view` fall back to the same env value the dispatcher uses.

**Verification.** Code trace of seeder control flow; not run against a fresh DB.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/62

### D-061  S4  open  backend  origin #84

**Title.** `/api/transcodes/stats.gpus_available` counts disabled GPUs as available.

**Where.** `services/backend/arm_backend/routers/transcodes.py:94-95` (`gpus_available = len([g for g in gpus if g.status == GpuStatus.AVAILABLE])`) at `ed087cf2`.

**What.** The PR adds `enabled` and makes the dispatcher skip disabled rows, but the summary the Transcoder page renders ("GPUs: 2/2 available") still counts a disabled device as available even though it will never be claimed. The per-device rows directly below say "disabled", so the page contradicts itself.

**Repro / evidence.** PATCH `/api/gpus/{id}` `{"enabled": false}` then GET `/api/transcodes/stats` -> `gpus_available` unchanged.

**Tip check.** Still present at `71129cd9`: `routers/transcodes.py:95` (`g.status == GpuStatus.AVAILABLE`, no `g.enabled`).

**Suggested fix location.** feat/gpu-inventory-alignment — `g.enabled and g.status == GpuStatus.AVAILABLE` (and decide whether `gpus_total` should exclude disabled rows).

**Verification.** Code read head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/63

### D-062  S4  open  ui-neu  origin #84

**Title.** "Manage GPUs in Settings" links to `/settings`, which opens the Metadata tab; the GPUs card lives under `#transcoding`.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:241` (`<a href="/settings" ...>`) at `ed087cf2`; tab routing at `routes/settings/+page.svelte:84-98` (`parseHash()` falls back to `'Metadata'`).

**What.** Settings tabs are hash-routed (`screenTabs` includes `'transcoding'`), so the link should be `/settings#transcoding`. As written the operator lands on Metadata and has to find the Transcoding tab themselves.

**Repro / evidence.** Click the link on /transcoder; URL `/settings`, active tab Metadata, no GpusCard visible.

**Tip check.** Still present at `71129cd9`: `routes/transcoder/+page.svelte:284` (`href="/settings"`).

**Suggested fix location.** feat/gpu-inventory-alignment.

**Verification.** Code read of both routes.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/64

### D-063  S4  open  ui-neu  origin #84

**Title.** GPU inventory row markup (status-dot + vendor badge + mono device path + state label) is duplicated inline in GpusCard and the Transcoder page instead of a shared component.

**Where.** `services/ui-neu/frontend/src/lib/components/settings/GpusCard.svelte:97-105` and `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:224-237` at `ed087cf2`.

**What.** `feedback_standard_ui_patterns.md`: when a pattern appears in two places, extract it under `lib/components/`. The same row (dot `data-status` ternary, `badge` vendor, `title`d device path, disabled/available/busy label) and its CSS (`.gpus-card-device` / `.transcoder-page-gpu-device`) are written twice with slightly different label logic (`statusLabel()` vs an inline `{#if}` chain that can print raw `g.status`).

**Repro / evidence.** Diff hunks above; no `GpuRow`/`GpuInventoryRow` component exists.

**Tip check.** Still present at `71129cd9`: both sites still inline (`git ls-tree -r origin/integration/all-prs-3 services/ui-neu/frontend/src/lib/components | grep -i gpu` -> only GpusCard.svelte + its test; tip `transcoder/+page.svelte:262-283` is the inline row).

**Suggested fix location.** feat/gpu-inventory-alignment — extract a `GpuInventoryRow` component used by both.

**Verification.** Code read head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/65

### D-064  S4  open  devtools  origin #84

**Title.** install.sh's `.env` template and docker-compose.yml.example still tell operators to "Re-run install.sh after a GPU/driver change" — the backend now ignores `ARM_GPUS` once the table is populated.

**Where.** `install.sh:1178-1181` (".env exists; preserving secrets, re-deriving ... ARM_GPUS" at `:1082` rewrites the value; template comment "The GPU-free backend reads this to fill the gpus table ... Re-run install.sh after a GPU/driver change") and `docker-compose.yml.example:78-81` at `ed087cf2`.

**What.** With seed-once semantics a re-run installer (or a driver upgrade that now passes the `ARM_NVENC_MIN_DRIVER` gate) rewrites `ARM_GPUS` to no effect; the operator must also delete every row in Settings > GPUs and restart, which only the UI card says. The installer's "advertising NVENC" log (`install.sh:493`) is misleading on an upgraded host. The ARM_NVENC_MIN_DRIVER lockstep itself is intact (install.sh:477 and setup-dev.sh:97 both 530; Dockerfile NVCODEC_VERSION 12.1.14.0).

**Repro / evidence.** `grep -n "Re-run install.sh after a GPU" install.sh`; the PR touches neither install.sh nor setup-dev.sh nor the compose example.

**Tip check.** Still present at `71129cd9`: `install.sh:1179-1181` (same comment, `git show origin/integration/all-prs-3:install.sh | grep -n -i "re-seed\|Settings > GPUs"` finds nothing).

**Suggested fix location.** feat/gpu-inventory-alignment — update the template/compose comments and have the installer's upgrade path print the re-seed instruction when it rewrites `ARM_GPUS`.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/66

### D-065  S3  open  backend  origin #85

**Title.** Transcode re-enable PATCH 500s when a per-job re-drain fails: `job.id` read after `rollback()` (MissingGreenlet).

**Where.** `services/backend/arm_backend/auto_session.py:795` at `df50078e` (introduced for the re-drain reuse in `c5f687f8`; caller `services/backend/arm_backend/routers/config.py:229`).

**What.** `PATCH /api/config {"transcode_enabled": true}` commits the toggle, then `_redrain_parked_applications` calls `drain_parked_applications_after_rip(session, job, hub, trigger="transcode re-enable")` per parked job. If `fan_out_waiting_identify_applications` or its `commit()` raises, the except block does `await db.rollback()` and then logs `job.id`. A real `AsyncSession.rollback()` expires every identity-map instance (`expire_on_commit=False` does not apply to rollback), so the PK read triggers a sync lazy load inside async code and raises `sqlalchemy.exc.MissingGreenlet` out of the except block. The PATCH returns 500 even though the toggle is already committed, so the operator sees a failure for a save that succeeded; the remaining parked jobs in the loop are never re-drained. The same read-after-rollback pre-exists in `after_rip`, but this PR adds a second caller (a user-facing HTTP route) and a new `trigger` argument to that exact line.

**Repro / evidence.**

```python
# services/backend/arm_backend/auto_session.py:792-796
    except Exception:  # noqa: BLE001 - hook must never break rip-complete
        await db.rollback()
        logger.exception("%s: draining parked session_applications failed job_id=%s", trigger, job.id)
```
`services/backend/tests/test_config_transcode_enabled.py::test_reenable_redrain_failure_never_fails_the_patch` only covers the *listing* failure before the loop; the per-job failure path is covered by no test, and the FakeSession's no-op `rollback()` could not surface the expiry anyway (the PR's own `tests/e2e/test_dispatcher_real_session.py` exists precisely because of this class of bug).

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/auto_session.py:847` (`logger.exception("%s: draining parked session_applications failed job_id=%s", trigger, job.id)` after `await db.rollback()`), caller at `routers/config.py:269`.

**Suggested fix location.** feat/no-transcode-mode — capture `job_id = job.id` before the `try`, log the local, and wrap the per-job loop in `_redrain_parked_applications` in its own try/except so one job cannot abort the rest; the PR body already proposes exactly this.

**Verification.** Code trace + SQLAlchemy semantics (rollback expires all); no automated repro because the fast suite uses FakeSession. A real-session regression test belongs next to `tests/e2e/test_dispatcher_real_session.py`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/67

### D-066  S3  untested-needs-hardware  backend  origin #85

**Title.** Cancelling an in-process passthrough task does not stop the copy: the file still lands in `/media` and the raw source is unlinked after the user deleted the task.

**Where.** `services/backend/arm_backend/passthrough_executor.py:181` and `services/backend/arm_backend/transcode_dispatcher.py:924` at `df50078e` (introduced in `ee0d9d2d`/`b7240a1f`).

**What.** `DELETE /api/transcodes/{id}` -> `cancel_running` emits `task.cancel`, sleeps 10s, then force-stops the *container* (`self._docker.containers.list(...)`) and deletes the row. An in-process passthrough has no container and ignores the WS cancel: `asyncio.to_thread(transcode_none, ...)` keeps copying (cross-mount copies of multi-GB rips take minutes), `transcode_none` then `unlink`s the `/raw` source, and the executor merely logs "deleted mid-move; skipping terminal update". Net effect: the user cancelled, the row is gone, yet the output appears in the library at the resolved path and the raw file is consumed — the opposite of the container path, where the stop kills the copy. Memory `project_no_transcode_mode.md` lists this as follow-up 3, but the PR body's "mirrors the container lifecycle exactly" does not.

**Repro / evidence.**

```python
# passthrough_executor.py:179-186 — no cancellation check, no event to abort the thread
            final = Path(settings.MEDIA_ROOT) / task_output_path
            try:
                size = await asyncio.to_thread(transcode_none, Path(track_output_path), final)
# transcode_dispatcher.py:921-924 — only a container can be stopped
        if still_running and self._docker is not None:
            survivors = self._docker.containers.list(filters={"label": f"{_DOCKER_LABEL_KEY}={task_id}"})
```

**Tip check.** Still present at `71129cd9`: `passthrough_executor.py:181` (`await asyncio.to_thread(transcode_none, ...)`, no cancel path), `transcode_dispatcher.py:1247` (`if still_running and self._docker is not None:`); `IN_PROCESS_CLAIMANT` is never consulted by `cancel_running` on the tip.

**Suggested fix location.** feat/no-transcode-mode — either refuse DELETE for `claimed_by == IN_PROCESS_CLAIMANT` while IN_PROGRESS (409 "passthrough move in flight") or copy to `<final>.arm-inprogress` and check a per-task cancel flag before the final rename/unlink so a cancel can discard the partial.

**Verification.** Code trace; untested-needs-hardware for timing (needs a cross-mount `/raw`->`/media` copy long enough to cancel: `bash devtools/iso-smoke.sh` with a passthrough session, `DELETE /api/transcodes/{id}` during the copy, then inspect `/media` and `/raw`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/68

### D-067  S3  open  ui-neu  origin #85

**Title.** Ripper-only (`ARM_TRANSCODE_CAPABLE=false`) hides the Transcoder page and nav while the backend silently holds previously queued encode tasks forever.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:142` and `:166` at `df50078e` (commit `b40b0279`/`0a1c663a`); backend hold at `services/backend/arm_backend/transcode_dispatcher.py:519` and `transcode_apply.py:transcode_enabled_now`.

**What.** A box that had encode tasks QUEUED (or a container that dies and is swept back to QUEUED) and is then redeployed with `setup-dev.sh --ripper-only` keeps those rows: `transcode_enabled_now` returns False when not capable, `spawn_pending` counts them as `held_encode` and only logs at DEBUG, and nothing fails or expires them. The UI, keyed on capability, removes `/transcoder` from the nav and renders "Transcoding is not available on this deployment (ripper-only install)" for the deep link without fetching tasks, so the held queue, its session applications (stuck RUNNING/QUEUED) and their jobs' transcode state are invisible — the page says there is nothing to transcode while the backend holds work. The capable-but-disabled case deliberately keeps the queue visible with a banner ("drain semantics need the held queue visible"); the not-capable case drops that.

**Repro / evidence.**

```svelte
<!-- +page.svelte:142 --> if (!get(transcoderEnabled)) return;   // no stats/jobs fetch
<!-- +page.svelte:166 --> {#if !$transcoderEnabled} ... Transcoding is not available on this deployment (ripper-only install).
```
```python
# transcode_dispatcher.py:516-521
                if not enabled:
                    held_encode += 1
                    continue
                if self._docker is None or not self.host_paths_set():
                    held_encode += 1
                    continue
```

**Tip check.** Still present at `71129cd9`: `routes/transcoder/+page.svelte:173` (`{#if !$transcoderEnabled}`) / `:180` ("Transcoding is not available on this deployment (ripper-only install)"); dispatcher hold at `transcode_dispatcher.py:629-632`.

**Suggested fix location.** feat/no-transcode-mode — when not capable, still fetch and render the queue (or at least a count of held encode tasks with a "re-run setup without --ripper-only to resume or delete these" hint), or have `/api/system/diagnostics` report held encode rows instead of the unconditional `ok` added in `routers/system.py:155`.

**Verification.** Code trace of both sides; the ripper-only UI branch is unit-tested only for "fetches nothing" (`transcoder-page.test.ts` "renders a full-page empty state and fetches no task data when not capable").

**Issue.** https://github.com/uprightbass360/arm-v3/issues/69

### D-068  S4  open  backend  origin #85

**Title.** `GET /api/config` reports `transcode_enabled: true` on a ripper-only deployment where encode is effectively disabled.

**Where.** `services/backend/arm_backend/routers/config.py:84` at `df50078e` (commit `6bdd95f5`).

**What.** `_to_view` returns the raw column (`cfg.transcode_enabled is not False`), while every enforcement point (`transcode_enabled_now`, apply gates, dispatcher) treats not-capable as disabled. So the wire contract says `{transcode_enabled: true, transcode_capable: false}` and the settings UI has to special-case it ("Always rendered off: on a ripper-only box the backend column still defaults to true" — `routes/settings/+page.svelte` ripper-only branch hard-codes `checked={false}`). Any other API consumer (scripts, the Vue UI still present at this head, future first-run setup) reading `transcode_enabled` gets a value that contradicts behaviour.

**Repro / evidence.**

```python
# routers/config.py:83-85
        # None-coerce covers rows/fixtures predating the column (NULL = enabled).
        transcode_enabled=cfg.transcode_enabled is not False,
        transcode_capable=effective_transcode_capable(settings),
```

**Tip check.** Still present at `71129cd9`: `routers/config.py:93-94` (identical two lines).

**Suggested fix location.** feat/no-transcode-mode — `transcode_enabled=capable and cfg.transcode_enabled is not False` (and drop the hard-coded `checked={false}` in the settings page), keeping the PATCH 422 as is.

**Verification.** Code read; `test_config_transcode_capable.py` asserts the view only under the default capable settings.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/70

### D-069  S3  fixed-later  ui-neu  origin #87

**Title.** GpusCard subscribes to `gpu.probed` without starting the WebSocket and shows no in-progress state after Re-probe, so on a directly loaded Settings page the row stays "Never probed"/stale forever.

**Where.** `services/ui-neu/frontend/src/lib/components/settings/GpusCard.svelte:109-115` at `e5bd1493` (introduced in `0259bd56`).

**What.** `onMount` calls `load()` and `wsClient.subscribe('transcode.events', ...)` but never `wsClient.start()`. At this head the only `start()` callers are `rips.svelte.ts`, `ripperEvents.svelte.ts` and `encoders.svelte.ts#followProbes` (the latter only runs on `encodersStore.refresh()`, which GpusCard calls only after a toggle/delete). The Settings route imports none of those stores, so a user who loads `/settings` directly, clicks Re-probe (202 returned, `pending` cleared immediately) sees no "probing" indicator, the row keeps showing "Never probed" / the old chips, and the `gpu.probed` event that would refresh it is never delivered; a second click yields a 409 "gpu probe already running" alert. The card should start the socket and show a per-row in-progress state until `gpu.probed` arrives.

**Repro / evidence.**

```
grep -rn "wsClient.start()" services/ui-neu/frontend/src --include=*.svelte --include=*.ts | grep -v __tests__
# -> only stores/rips.svelte.ts, stores/ripperEvents.svelte.ts, stores/encoders.svelte.ts
grep -n "import" services/ui-neu/frontend/src/routes/settings/+page.svelte   # none of those stores
```

**Tip check.** Fixed by #102 (`feat/first-run-setup`) in `81ab0281` "feat(ui): GPU card encoder chips, probe progress, CPU empty state" (adds `wsClient.start()` in `onMount` with the comment "Start the socket ourselves: on the setup walkthrough no other store has", plus a per-row `StatusStrip` "Testing encoders..." with a 2-minute timeout keyed on `gpu.probed.payload.gpu_id`). The same patch also sits on the tip as `9ff1aa08` (patch-id identical). Recommend: move down the one-line `wsClient.start()` into #87 (without it the Re-probe button this PR adds does not visibly do anything on a fresh Settings load); leave the progress-strip part in #102 (it depends on `StatusStrip`/`Glyph` names that arrive later).

**Suggested fix location.** feat/encoder-first-presets — the Re-probe button and the subscription are both introduced here.

**Verification.** Code-read of head and tip (`git show origin/integration/all-prs-3:...GpusCard.svelte`); vitest passes at head because tests inject events directly. Browser check: load `https://localhost:8081/settings` cold (not via the dashboard), click Re-probe, observe the row never updates.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/71

### D-070  S3  untested-needs-hardware  backend  origin #87

**Title.** An infrastructure failure during a re-probe (container could not start, docker wait error, 120 s timeout) is written as `encoder_kinds=[]`, wiping a previously verified device so queued vendor-pinned tasks terminally fail and `any_*` work silently drops to CPU.

**Where.** `services/backend/arm_backend/gpu_probe_runner.py:386,392-393` (returns `[]` for infra errors) and `:433` (`gpu.encoder_kinds = verified` unconditionally) at `e5bd1493` (introduced in `5d5b31f6`).

**What.** `_run_container` returns `([], error)` for every failure mode, including ones that say nothing about the device's encoders (a dead ssh transport to `ARM_TRANSCODE_DOCKER_HOST`, a transient daemon error, a slow host tripping `PROBE_TIMEOUT_S`). `_write` then replaces the verified list with `[]`. Unlike the spawn path, the probe runner does not use the dispatcher's transport-death rebuild (`_is_transport_death` / `_docker_factory`), so on a remote host whose connection dropped, a "Re-probe"/"Re-probe all" click or the boot pass turns every verified device into "Verified nothing". On the next tick `_claim_gpu_for_task` fails each queued `qsv_*`/`nvenc_*`/`vaapi_*` task with "no enabled device has verified ..." (retryable only by hand) and `any_*` tasks fall back to CPU. The previously verified list should be kept (write `probe_error` only) when the probe did not actually run, or the error should be classified separately from "verified nothing". The PR body discloses this as behavior change 8; recorded because the consequence (terminal task failure from a transient error) has only a manual workaround.

**Repro / evidence.**

```
# gpu_probe_runner.py:380-393 — every except branch returns [] as the verified list;
# _write (:433) stores it; _claim_gpu_for_task then takes the "fail" branch for pinned encoders.
uv run pytest -q -k "test_gpu_probe_runner and (timeout or could_not_start)"
```

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/gpu_probe_runner.py:386,392-393,433` (file byte-identical to head: `git diff --quiet origin/feat/encoder-first-presets origin/integration/all-prs-3 -- services/backend/arm_backend/gpu_probe_runner.py`).

**Suggested fix location.** feat/encoder-first-presets — the runner is new here.

**Verification.** Code-read + existing runner tests; the end-to-end consequence is untested-needs-hardware: on a GPU host with a queued `qsv_h265` task, stop the remote docker daemon (or `docker pause` it) and click Re-probe; expect the row to flip to "Verified nothing" and the queued task to FAILED on the next tick.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/72

### D-071  S3  open  transcode  origin #87

**Title.** A `vaapi_*` (or AMD-resolved `any_*`) preset with `container=webm` passes preset validation but every task fails at run time because the ffmpeg VAAPI engine only muxes MKV/MP4.

**Where.** `services/transcode/arm_transcode/engines/ffmpeg_vaapi.py:28,41-43` (`FFMPEG_MUXER` has only MKV/MP4, `raise ValueError`) at `e5bd1493` (introduced `1e87bc6d`); `services/backend/arm_backend/routers/transcode_presets.py:20-30` `_validate_encoder` checks only encoder-vs-tool, not container; `services/ui-neu/frontend/src/lib/components/TranscodePresetForm.svelte:231` offers WebM for every encoder.

**What.** `vaapi_av1` + WebM (and `any_av1` + WebM once the claim lands on an AMD row) is accepted by POST/PATCH `/api/transcode-presets` and by the form, applies cleanly, and then `main._run_encoder` -> `build_command` raises `ValueError("ffmpeg_vaapi does not support container webm")` on each attempt, failing the task with a message the user can only fix by editing the preset. The combination should be refused at create/update (422) and greyed in the picker, or the engine should map WEBM to the `webm` muxer for AV1.

**Repro / evidence.**

```
uv run pytest -q -k test_unsupported_container_rejected   # pins the ValueError (services/transcode/tests/test_ffmpeg_vaapi.py:92)
# while POST /api/transcode-presets {"tool":"handbrake","container":"webm","encoder":"vaapi_av1",...} returns 201
```

**Tip check.** Still present at `71129cd9`: `services/transcode/arm_transcode/engines/ffmpeg_vaapi.py:28,41-43` (identical), `routers/transcode_presets.py:20` `_validate_encoder` still container-blind (identical), `TranscodePresetForm.svelte:207` still offers WebM unconditionally.

**Suggested fix location.** feat/encoder-first-presets — the engine, the validator and the picker are all introduced here.

**Verification.** Code-read + the engine unit test; the live failure path is untested-needs-hardware (AMD VAAPI device).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/73

### D-072  S3  open  devtools  origin #87

**Title.** install.sh-generated compose does not forward `ARM_TRANSCODE_IMAGE_QSV` / `_VAAPI` / `_NVENC` to the backend, so the PR's operator instruction for air-gapped/private-registry installs has no effect.

**Where.** `install.sh:1380-1391` (backend `environment:` heredoc lists `ARM_TRANSCODE_IMAGE` ... `ARM_TRANSCODE_PGID`, no `_QSV/_VAAPI/_NVENC`, no `env_file`) at `e5bd1493`; claim at `arm_wiki/Hardware-Transcoding.md:174-178` (`77c2a94c`) and PR body "Operator actions".

**What.** `Settings.ARM_TRANSCODE_IMAGE_QSV/_VAAPI/_NVENC` (config.py, `2f9747c9`) are read from the backend container's environment. The dev `docker-compose.yml.example` was updated to pass them, but install.sh's generated compose was not (PR body: "install.sh itself is unchanged"). An install.sh operator who follows the wiki and sets `ARM_TRANSCODE_IMAGE_QSV=myregistry/...` in `~/arm/.env` gets no override: the backend derives `<prefix>/arm-transcode:<tag>-intel` and tries to pull it from the public registry. Workaround: hand-edit the generated compose.

**Repro / evidence.**

```
grep -n "ARM_TRANSCODE_IMAGE_QSV" install.sh        # no output
grep -n "env_file" install.sh | grep -v 'env_file="\$PREFIX' # no compose env_file
```

**Tip check.** Still present at `71129cd9`: `install.sh:1380-1394` backend env block unchanged except an added `ARM_HOST_ISO_LIBRARY_PATH`; `docs/user/Hardware-Transcoding.md:174-178` still tells operators to set the override.

**Suggested fix location.** feat/encoder-first-presets — add the three lines to the install.sh heredoc next to `ARM_TRANSCODE_IMAGE`, or drop the install.sh instruction from the wiki/PR body.

**Verification.** Code-read of install.sh heredoc at head and tip; untested-needs-hardware for the end-to-end pull (`bash install.sh` on a QSV host with the override set, then `docker inspect armv3-backend | grep ARM_TRANSCODE_IMAGE_QSV`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/74

### D-073  S4  open  devtools  origin #87

**Title.** install.sh still runs the now-deprecated `--probe-encoders` container at install time; its `{}` output is discarded by the backend, so the step only costs an image pull plus up to 60 s.

**Where.** `install.sh:541` (`timeout 60 docker run ... python -m arm_transcode.main --probe-encoders`) at `e5bd1493`; deprecation in `services/transcode/arm_transcode/main.py:263-271` (`5e777946`).

**What.** `main.py` now prints `{}` for `--probe-encoders` and the backend seeds every row with `encoder_kinds=[]` regardless of the hint (`main.py::_refresh_gpu_inventory`, `gpu_probe.py`). `devtools/setup-dev.sh` had its `probe_encoder_caps` removed in this PR (`d5511639`), but install.sh keeps the whole `probe_encoder_caps`/`kinds_for` machinery, including its "fall back to h264+h265" comment that is no longer true of anything downstream. Dead code with a real install-time cost; acknowledged in the memory entry as "install.sh has no variant awareness".

**Repro / evidence.** `grep -n "probe-encoders" install.sh` -> `:541`; `grep -n "probe-encoders" devtools/setup-dev.sh` -> none.

**Tip check.** Still present at `71129cd9`: `install.sh:541`.

**Suggested fix location.** feat/encoder-first-presets — same change already made to setup-dev.sh (`detect_gpus` emits `encoder_kinds:[]` without probing).

**Verification.** Code-read; `bash devtools/test-setup-dev.sh` asserts the setup-dev side only.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/75

### D-074  S4  open  docs  origin #89

**Title.** The docs sweep changed Settings `/config` -> `/settings` in one place but left the same wrong route in `docs/README-OMDBAPI.md`.

**Where.** `docs/README-OMDBAPI.md:29` at `480138c6` (the PR's "docs: describe the SvelteKit UI" commit, which edited `arm_wiki/Configuring-ARM.md:51` for exactly this).

**What.** The file tells users to "navigate to **Settings** (`/config`)" and enter the OMDb key under Metadata. ui-neu has no `/config` route (routes at head: `/`, `/login`, `/change-password`, `/files`, `/jobs/[id]`, `/logs`, `/logs/[job_id]`, `/notifications`, `/settings`, `/setup`, `/transcoder`); the page is `/settings` (Metadata tab). Same stale claim the PR fixed in the wiki.

**Repro / evidence.**

```
$ grep -rn '(`/config`)' arm_wiki docs
arm_wiki/Configuring-ARM.md:51 ... (`/settings`)      <- fixed by this PR
docs/README-OMDBAPI.md:29:Open the ARM web UI and navigate to **Settings** (`/config`). Under **Metadata / identification**,
```

**Tip check.** Still present at `71129cd9`: `docs/developers/reference/legacy/README-OMDBAPI.md:29` (file relocated by #88 feat/docs-site into a `legacy/` folder, text unchanged — `git grep -n '(\`/config\`)' origin/integration/all-prs-3 -- docs arm_wiki`).

**Suggested fix location.** chore/remove-vue-ui — one-word change in the commit that already does this sweep.

**Verification.** verified by grep + ui-neu route listing at head.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/76

### D-075  S4  open  ci  origin #89

**Title.** The published `arm-ui` image no longer ships `/LICENSE`: ui-neu's Dockerfile lacks the `COPY LICENSE /LICENSE` every other image (and the removed Vue arm-ui image) has.

**Where.** `services/ui-neu/Dockerfile:12-20` (nginx stage, no LICENSE copy) as wired into the `arm-ui` legs of `.github/workflows/release.yml:111`, `publish-main.yml:103`, `weekly-rebuild.yml:181` at `d2a9489e`; the deleted `services/ui/Dockerfile:25` (`COPY LICENSE /LICENSE`) at `daddb6a4`.

**What.** Before this PR the `arm-ui` image was built from `services/ui/Dockerfile`, which bundled the project license like `services/backend/Dockerfile:62`, `services/ripper/Dockerfile:166`, `services/transcode/Dockerfile:146`. Switching the `arm-ui` leg to `services/ui-neu/Dockerfile` silently drops it from the published image, although the root `.dockerignore` explicitly keeps `LICENSE` in the context "so a `COPY LICENSE` can bundle it into each image". Cosmetic/compliance regression in the shipped artifact.

**Repro / evidence.**

```
$ grep -n LICENSE services/*/Dockerfile
services/backend/Dockerfile:62:COPY LICENSE /LICENSE
services/ripper/Dockerfile:166:COPY LICENSE /LICENSE
services/transcode/Dockerfile:146:COPY LICENSE /LICENSE
$ git show origin/feat/encoder-first-presets:services/ui/Dockerfile | grep -n LICENSE
25:COPY LICENSE /LICENSE
```

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:services/ui-neu/Dockerfile | grep LICENSE` matches only a comment (line 4); no `COPY LICENSE`.

**Suggested fix location.** chore/remove-vue-ui — the commit that makes ui-neu the arm-ui image (`d2a9489e`) is where the image contract changes.

**Verification.** verified by reading both Dockerfiles; image not built locally (CI `build-images` job builds `services/ui-neu/Dockerfile` already at base, so the build itself is known-good).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/77

### D-076  S4  open  ci  origin #88

**Title.** New `site/` npm lockfile has no Dependabot coverage, unlike every other dependency manifest in the repo.

**Where.** `.github/dependabot.yml:26-34` (npm ecosystem lists only `/services/ui-neu/frontend`) vs `site/package.json` / `site/package-lock.json` added in `a8b43886` (head `84f9a2f5`).

**What.** The PR adds a third npm manifest (`markdown-it`, `shiki`, `minisearch`, `tailwindcss`, `@tailwindcss/cli`) that is built in CI (`test-site`), in the Pages deploy, and inside the ui-neu image (`services/ui-neu/Dockerfile:7-11`), but `dependabot.yml` was not extended with a `/site` npm entry. The repo's convention (memory `feedback_pin_actions_to_sha.md`, `dependabot.yml` comments) is that Dependabot keeps actions, uv, the ui-neu npm tree and every Dockerfile dir bumped; `site/` is the only manifest left outside that.

**Repro / evidence.**

```
grep -n "directory" .github/dependabot.yml   # "/", "/", "/services/ui-neu/frontend", 4 docker dirs — no "/site"
ls site/package-lock.json                     # exists, 41 KB
```

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:.github/dependabot.yml | grep directory` -> same seven entries, no `/site`.

**Suggested fix location.** feat/docs-site — add `- package-ecosystem: "npm"  directory: "/site"` (weekly, `dependencies` label, grouped) next to the ui-neu entry.

**Verification.** Verified by reading the file at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/78

### D-077  S4  open  docs  origin #88

**Title.** `project_docs_site.md` memory (and the PR body) record the wrong stacking base: "on `feat/encoder-first-presets` (#87)" with a stack list that omits #89/#90.

**Where.** `.claude/memory/project_docs_site.md:31-34` at `84f9a2f5` (text introduced in `b6e98108`, touched again in `f87cf33f`).

**What.** The entry says the branch "sits at the end of the wolfy PR stack, on `feat/encoder-first-presets` (#87; the stack runs #61..#66, #75, #76, #73, #74, #81, #83, #84, #85, #87)". The PR's base is `chore/ui-neu-eslint-prettier` (#90) and the head already contains #89 (Vue removal) and #90 (eslint/prettier): `git merge-base --is-ancestor origin/chore/ui-neu-eslint-prettier origin/feat/docs-site` is true. CLAUDE.md makes this memory authoritative for every session, so the stale rebase/merge-order note misleads the next person who follows "Rebase/merge order matters."

**Repro / evidence.**

```
git merge-base --is-ancestor origin/chore/ui-neu-eslint-prettier origin/feat/docs-site && echo contains-90
sed -n 31,34p .claude/memory/project_docs_site.md
```

**Tip check.** Still present at `71129cd9`: `diff <(git show origin/integration/all-prs-3:.claude/memory/project_docs_site.md) .claude/memory/project_docs_site.md` is empty; lines 31-34 unchanged.

**Suggested fix location.** feat/docs-site — the memory entry is this PR's own artifact; update the base/stack line (or drop the volatile stack list and keep only "base = the branch below it in the stack").

**Verification.** Verified via git ancestry and file contents at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/79

### D-078  S4  open  docs  origin #88

**Title.** Former `docs/ops/` pages now published to the GitHub wiki carry relative `../../services/...` repo links that cannot resolve on the wiki.

**Where.** `docs/user/MakeMKV-Ripper.md:25`, `:51`, `:52` at `84f9a2f5` (page moved into the wiki source dir by `a1b0c7c3`; links are `../../services/ripper/arm_ripper/makemkv_key.py`, `../../services/ripper/install/install_makemkv.sh`, `../../services/ripper/install/update_key.sh`).

**What.** `publish-wiki.yml` now syncs `docs/user/` verbatim to the wiki (`source: docs/user`, `publish-wiki.yml:31`), and the PR deliberately "joined" the user-facing ops notes to the wiki source. On the wiki, a relative `../../services/...` href resolves against `https://github.com/<org>/<repo>/wiki/` and 404s; the wiki has no `services/` tree. The site/app are unaffected (the resolver rewrites these to `blob/main` URLs, `links.mjs:106-107`), so only the wiki rendering is wrong. The PR's own contributor rule says the opposite: "link into the repo with full GitHub URLs" (`docs/developers/contributing/Contribute-Wiki.md:46-47`). (`docs/user/Notification-Scripts.md:128,130` link `examples/*.sh`, which the PR intends to work via the synced `docs/user/examples/`; not counted.)

**Repro / evidence.**

```
grep -n "](\.\./" docs/user/*.md
# docs/user/MakeMKV-Ripper.md:25 ... (../../services/ripper/arm_ripper/makemkv_key.py)
# docs/user/MakeMKV-Ripper.md:51 ... (../../services/ripper/install/install_makemkv.sh)
# docs/user/MakeMKV-Ripper.md:52 ... (../../services/ripper/install/update_key.sh)
```

**Tip check.** Still present at `71129cd9`: `git grep -n "](\.\./" origin/integration/all-prs-3 -- docs/user` -> `docs/user/MakeMKV-Ripper.md:25`, `:52`, `:53` (one line shifted by a later edit; same three links).

**Suggested fix location.** feat/docs-site — rewrite the three hrefs as full `https://github.com/<repo>/blob/main/...` URLs (the site resolver maps those back to `repo` links, `links.mjs:58-64`, so site/app output is unchanged).

**Verification.** Verified link text at head and tip and the wiki-sync source dir; the wiki rendering itself is untested (no GitHub access) — a human can open the wiki page "MakeMKV-Ripper" after the next `publish-wiki.yml` run and click the three links.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/80

### D-079  S4  open  ui-neu  origin #94

**Title.** `dismissAllNotifications` doc comment states the opposite of the backend behaviour this same PR introduced.

**Where.** `services/ui-neu/frontend/src/lib/api/notifications.ts:34` at `4f80aee3` (comment added in `ff5a4751`, contradicted by `e8d40f23`).

**What.** Commit `e8d40f23` changes `POST /inbox/dismiss-all` to mark every not-yet-cleared row seen *and* cleared (purgeable), and the page relies on that (`+page.svelte:66-68` "Like a per-row dismiss ... seen and cleared"). The API client's comment still reads "Marks every unseen row seen. It does NOT clear them, so they are not purgeable." A future caller reading the client will build on the wrong contract.

**Repro / evidence.**

```
$ sed -n 34,36p services/ui-neu/frontend/src/lib/api/notifications.ts
// Marks every unseen row seen. It does NOT clear them, so they are not purgeable.
export function dismissAllNotifications(): Promise<NotificationDismissAllResult> {
	return post<NotificationDismissAllResult>('/api/notifications/inbox/dismiss-all');
$ sed -n 647,660p services/backend/arm_backend/routers/notifications.py   # same PR: sets r.cleared = True for every non-cleared row
```

**Tip check.** Still present at `71129cd9`: `services/ui-neu/frontend/src/lib/api/notifications.ts:34` (identical line, `git show origin/integration/all-prs-3:...`).

**Suggested fix location.** chore/ui-neu-ux-polish — the contradicting backend change is in this PR; one-line comment fix ("Marks every not-yet-cleared row seen and cleared, same as a per-row dismiss").

**Verification.** Read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/81

### D-080  S4  open  docs  origin #94

**Title.** Status-Roadmap describes maintenance "buttons" for orphaned log files and clearing the raw rip area that do not exist in the UI; this PR deleted their last stubs.

**Where.** `docs/user/Status-Roadmap.md:44-46` at `4f80aee3` (added in `7021daa5`; stubs removed in `16b84d1e`).

**What.** The new roadmap bullet says maintenance tools "find and remove orphaned media folders **and log files**, clean up finished transcode jobs, **and clear the raw rip area** from the UI. The buttons are hidden until these endpoints exist in v3." The UI at head has only the Orphan-folders and Clean-up-transcoder buttons (`routes/files/+page.svelte:570-`); there is no orphan-logs or clear-raw UI, and this PR removes `fetchOrphanLogs/deleteLog/bulkDeleteLogs/clearRaw` from `lib/api/maintenance.ts` as "stubs with no callers". The doc promises hidden features that are not built.

**Repro / evidence.**

```
$ grep -rniE "orphan.?log|clear.?raw|raw rip|raw area" services/ui-neu/frontend/src | grep -v test   # -> no matches
$ git diff origin/feat/docs-site...4f80aee3 -- services/ui-neu/frontend/src/lib/api/maintenance.ts | grep -E "^-export async function (fetchOrphanLogs|deleteLog|bulkDeleteLogs|clearRaw)"
```

**Tip check.** Still present at `71129cd9`: `docs/user/Status-Roadmap.md:43-45` ("find and remove orphaned media folders and log files, clean up finished transcode jobs, and clear the raw rip area from the UI. The buttons are hidden..."); still no orphan-log/clear-raw UI on the tip.

**Suggested fix location.** chore/ui-neu-ux-polish — same commit series introduced the text; reword to the two tools that exist (orphan folders, transcoder job cleanup).

**Verification.** grep at head and tip; docs-only.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/82

### D-081  S3  open  backend  origin #95

**Title.** A parked application that stays parked after rip-complete makes a `ripped` job read "Transcoding 0/0" forever (and stay live/polling).

**Where.** `services/backend/arm_backend/auto_session.py:477` (park on `job.status not in POST_RIP_JOB_STATUSES`, commit 53555eb5) with `services/backend/arm_backend/routers/jobs.py:143-146` (`_session_app_is_terminal` treats WAITING_IDENTIFY with 0 tasks as non-terminal; pre-existing) and `services/ui-neu/frontend/src/lib/utils/job-status.ts:19-20` (`effectiveJobStatus` -> 'transcoding').

**What.** PR #95 deliberately defers output-path resolution for every pre-rip apply to drain time ("A required token that is still empty at drain time stays parked with a template reason"). When the drain fails (e.g. a `{year}` clone template and a job with no year, or `no_outputs`), the row stays WAITING_IDENTIFY on a RIPPED job. `_summarize_transcode_progress` then yields `state='transcoding', tasks_total=0, percent=100.0`; the UI folds that into effective status `transcoding` (badge, lifecycle stepper on the Transcoding stage, "Transcoding 0/0" in the table, `isLive()` true so the detail page polls every 5s and the log panel streams indefinitely), while the new `parked_session_ids` line on the same page says "<session>, waiting". Nothing is transcoding and nothing will. The root (`_session_app_is_terminal`) predates this PR, but this PR widens the entry (Apply is now offered on `awaiting_review` and parks instead of 409ing, and the resolve-fanout/redrain paths park too) and documents the silent park as intended, without making the read layer distinguish "parked with a terminal reason" from "in flight".

**Repro / evidence.**

```
DATABASE_URL=postgresql+asyncpg://u:p@localhost/x ARM_SERVICE_TOKEN=tok-service uv run python -c "
from arm_backend.routers.jobs import _summarize_transcode_progress
from arm_common import SessionApplication, SessionApplicationStatus
sa = SessionApplication(session_id='ses_x', job_id='job_x', status=SessionApplicationStatus.WAITING_IDENTIFY, overwrite=False)
print(_summarize_transcode_progress([sa], []))"
# -> state='transcoding' tasks_total=0 tasks_done=0 tasks_failed=0 percent=100.0
```
Flow: hold_for_review on, apply a user-cloned session with `{year}` to a held disc with no year -> 200 + `waiting_identify` (test_held_disc_apply_flow.py proves the park) -> rip completes -> `drain_parked_applications_after_rip` logs WARN `reason=template` and the row stays parked -> `GET /api/jobs/{id}` has `transcode_progress.state == "transcoding"`.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/routers/jobs.py:180-183` (`return task_count == 0 and sa != SessionApplicationStatus.WAITING_IDENTIFY`), `auto_session.py:478`, `job-status.ts:5` (`POST_RIP = new Set(['ripped','ripped_partial'])`). #96 reduces the frequency (built-ins use `{year?}`) but user clones with `{year}` and the `no_outputs` park still hit it.

**Suggested fix location.** fix/job-status-actions — either persist the drain skip reason on the application (so `_summarize_transcode_progress` can treat a terminally-parked app as terminal and the UI can show "parked: <reason>"), or make `_session_app_is_terminal` ignore WAITING_IDENTIFY rows on POST_RIP jobs when computing `all_terminal`.

**Verification.** Verified the summary function with the real code (above) and traced the UI fold in job-status.ts / job-status-groups.ts; end-to-end drill: `devtools/iso-smoke.sh` with hold_for_review on, apply a clone session whose template uses `{year}` to a job with no year, then inspect the job page after rip-complete (untested-needs-hardware for the live stack).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/83

### D-082  S3  open  ui-neu  origin #95

**Title.** Parked-session line promises "applies when the rip finishes" on failed and abandoned jobs; nothing ever cancels a parked application when the rip fails or the job is abandoned.

**Where.** `services/ui-neu/frontend/src/lib/utils/job-fields.ts:124` at afa8b309 (`isPostRipStatus(job.status) ? 'waiting' : 'applies when the rip finishes'`); `services/backend/arm_backend/routers/ripper.py:1082` (rip-complete FAILED branch) and `services/backend/arm_backend/routers/jobs.py:399` (abandon) touch no SessionApplication rows.

**What.** `isPostRipStatus` is false for `failed` and `abandoned`, so a job whose rip failed (or was abandoned) with a parked session shows `Session: <name>, applies when the rip finishes` in the detail metadata (and the same text via `parkedSessionLine` on the review card). No rip will finish; the WAITING_IDENTIFY row is never cancelled (`after_rip` is only called for RIPPED/RIPPED_PARTIAL), so the promise is false and permanent. The row also keeps `transcode_progress.state='transcoding'` on a failed job (see C1 mechanics), though `isLive` stops at FINAL statuses so at least polling stops.

**Repro / evidence.** `job-fields.ts:116-125`: only two branches, keyed on `POST_RIP` membership. `JobStatus.FAILED`/`ABANDONED` fall into the "applies when the rip finishes" branch. Backend: `grep -n "SessionApplication\|WAITING_IDENTIFY" services/backend/arm_backend/routers/ripper.py` finds no cleanup in `rip_complete`; `abandon_job` (jobs.py:368-433) only flips the job and emits WS events.

**Tip check.** Still present at `71129cd9`: `services/ui-neu/frontend/src/lib/utils/job-fields.ts:124` (identical line); tip `routers/ripper.py` and `routers/jobs.py` abandon still touch no `SessionApplication` rows.

**Suggested fix location.** fix/job-status-actions — this PR introduced `parked_session_ids`/`parkedSessionLine`; add a third branch for FINAL statuses ("not applied: rip failed/abandoned") and, ideally, cancel WAITING_IDENTIFY rows in rip-complete's FAILED branch and in abandon.

**Verification.** Code trace at head and tip; unit-level repro: call `parkedSessionLine({parked_session_ids:['ses_x'], status:'failed'}, new Map())` -> `"ses_x, applies when the rip finishes"`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/84

### D-083  S4  open  common  origin #95

**Title.** `REDRAIN_JOB_STATUSES` includes pre-rip statuses whose parked applications the redrain can never promote; every transcode re-enable logs a WARN per such row.

**Where.** `packages/arm_common/arm_common/enums.py:144-146` at 53555eb5 (`REDRAIN_JOB_STATUSES = {RIPPED, RIPPED_PARTIAL, IDENTIFIED, AWAITING_REVIEW}`), used at `services/backend/arm_backend/routers/config.py:215`.

**What.** The comment above the set says "the rip is done and identity is known, so the only thing that held an encode application parked was the toggle", but IDENTIFIED and AWAITING_REVIEW are pre-rip. For them `drain_parked_applications_after_rip` -> `_fan_out_tasks_for_application` hits the new `job.status not in POST_RIP_JOB_STATUSES` park and returns `no_tracks`, so the redrain does nothing except log `WARNING transcode re-enable: parked session_application=... stays parked reason=no_tracks` for each pre-rip parked row on every toggle. The PR even adds a test (`test_reenable_leaves_pre_rip_application_parked_even_with_review_tracks`) asserting the no-op. Base had IDENTIFIED in the local tuple; this PR added AWAITING_REVIEW and moved the set to arm_common with a contradicting comment.

**Repro / evidence.** `uv run pytest -q -k test_reenable_leaves_pre_rip_application_parked_even_with_review_tracks` passes and the captured log shows the WARN line; `enums.py:140-146` comment vs members.

**Tip check.** Still present at `71129cd9`: `packages/arm_common/arm_common/enums.py:171-173` (same four members).

**Suggested fix location.** fix/job-status-actions — restrict the set to `POST_RIP_JOB_STATUSES - {RIPPED_AWAITING_IDENTIFY}` (or just RIPPED/RIPPED_PARTIAL) and fix the comment; pre-rip rows drain at rip-complete anyway.

**Verification.** Code trace; test run at head.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/85

### D-084  S4  open  ui-neu  origin #95

**Title.** Detail-page metadata says `State: In progress` for an idle `ripped` job with no session applied.

**Where.** `services/ui-neu/frontend/src/lib/utils/job-fields.ts:132,153` at ce5ef0ab (`const active = isLive(job)` -> `'In progress'`).

**What.** `buildMetadataFields` switched from `isJobActive(status)` (false for `ripped` at base, so the field read "Finished") to `isLive(job)`, which is true for `ripped`/`ripped_partial`/`ripped_awaiting_identify` with no transcode. A disc that finished ripping and is waiting for the operator to pick a session now reads "In progress" although nothing is running; the same `isLive` also opens the log panel by default and keeps it streaming for such jobs (acknowledged in the PR body), but the State label is a plain mis-statement.

**Repro / evidence.** `job-fields.ts:132-156`; base `job-type.ts:119-156` `ACTIVE_STATUSES` did not contain `ripped`.

**Tip check.** Still present at `71129cd9`: `services/ui-neu/frontend/src/lib/utils/job-fields.ts:132,153`.

**Suggested fix location.** fix/job-status-actions — use `isInProgress(job)` for the State field (that helper exists in the same PR precisely to exclude idle post-rip statuses) or add a third label ("Waiting for session").

**Verification.** Code trace at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/86

### D-085  S4  open  ui-neu  origin #95

**Title.** `JobStatsPanel.svelte` and `JobStatsPanel.test.ts` left behind after their last consumer was removed.

**Where.** `services/ui-neu/frontend/src/lib/components/BulkActionsMenu.svelte:1-14` at ce5ef0ab (removed `import type { JobStats } from './JobStatsPanel.svelte'` and the `jobsStats` prop); `services/ui-neu/frontend/src/lib/components/JobStatsPanel.svelte` still present.

**What.** The PR removes the only import of `JobStatsPanel` and acknowledges the files are now unreferenced, but leaves them (and their vitest file) in the tree. Dead component + a test that exercises nothing shipped.

**Repro / evidence.** `grep -rn JobStatsPanel services/ui-neu/frontend/src --include=*.svelte --include=*.ts | grep -v JobStatsPanel\.` returns nothing at afa8b309.

**Tip check.** Still present at `71129cd9`: `git ls-tree origin/integration/all-prs-3 services/ui-neu/frontend/src/lib/components/` lists `JobStatsPanel.svelte` and `JobStatsPanel.test.ts`; no straggler removed them.

**Suggested fix location.** fix/job-status-actions — delete both files in the commit that drops the import.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/87

### D-086  S4  open  backend  origin #96

**Title.** New `except TemplateValidationError: raise` makes the `malformed template` re-wrap branch uncovered; backend 100%-statement policy regresses.

**Where.** `services/backend/arm_backend/path_template.py:122-125` at f764be4c (`feat(backend): optional output path tokens with {token?}`).

**What.** Before this PR an unknown token raised `TemplateValidationError` inside `format_map`; since it subclasses `ValueError`, it was caught by `except (IndexError, ValueError)` and re-wrapped, so that clause executed in every unknown-token test. The PR adds `except TemplateValidationError: raise` ahead of it to keep the "unknown token" message intact (correct), but no test now exercises a genuinely malformed template (e.g. `"{title"` -> `malformed template: expected '}' before end of string`), so lines 124-125 are uncovered. There is no pragma and no justification.

**Repro / evidence.**

```
uv run coverage run -m pytest -q -k "path_template or naming or sessions_router or transcode_apply" && uv run coverage report | grep path_template
# at afa8b309 (#95 head): no line for path_template.py (100%)
# at 2dcd294f (#96 head): services/backend/arm_backend/path_template.py  73  2  18  0  98%  124-125
```
Full-suite run at 2dcd294f confirms the same two lines missing.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/path_template.py:121-125` has the same clause order and `git grep -n malformed origin/integration/all-prs-3 -- services/backend/tests` finds no path-template test (only drive_scanner/episode tests). No straggler adds one.

**Suggested fix location.** fix/optional-template-tokens — add one test in `services/backend/tests/test_path_template.py` asserting `expand_template("{title", ctx)` raises `TemplateValidationError` matching `malformed template`.

**Verification.** Coverage runs at both heads (above).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/88

### D-087  S4  open  docs  origin #96

**Title.** Architecture docs that `path_template.py` says it mirrors were not updated for the `{token?}` syntax or the new built-in defaults.

**Where.** `docs/developers/architecture/02-job-lifecycle.md:310` (token table, `{year}` row; no mention of optional syntax) and `docs/developers/architecture/04-data-model.md:140` (built-in example still `{title} ({year})/{title} ({year}) - {transcode_slug}.{ext}`) at df22f259 (`docs: optional output path tokens`), which added only `docs/user/Web-UI.md`.

**What.** `path_template.py:6` states "The token whitelist per MediaType mirrors arch §02". The PR introduces new template grammar (`{token?}`, NEVER_OPTIONAL, empty-after-drop rejection) and changes all seven shipped defaults to `{year?}`, but the developer architecture docs still describe the old grammar and show the old default. Docs out of date against the code in the same PR.

**Repro / evidence.** `git grep -n 'year?' origin/fix/optional-template-tokens -- docs` matches only `docs/user/Web-UI.md`; `docs/developers/architecture/04-data-model.md:140` still shows `({year})`.

**Tip check.** Still present at `71129cd9`: `git grep -n 'year?' origin/integration/all-prs-3 -- docs` matches only `docs/user/Web-UI.md:74-85`.

**Suggested fix location.** fix/optional-template-tokens — add the `?` rule to the token table in 02-job-lifecycle.md §"Output paths and naming" and update the 04-data-model.md example.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/89

### D-088  S3  open  backend  origin #97

**Title.** `test_identify_repost_on_held_disc_keeps_operator_exclusion` passes without ever reaching the resolver it claims to test.

**Where.** `services/backend/tests/test_ripper_router.py:620-672` at `cf4e6d73` (refactor(backend): identify and rip-start go through the identity resolver).

**What.** The test seeds `identity_claims` with a `preset` claim (`selected: False` for track 2) and a `manual` claim (`selected: True`), a track with `identity_provenance={"excluded": "manual"}`, and documents "The preset claim must not flip it back". But a re-POST for a disc whose job is reused takes the `already_identified = True` Guard-1 path in `identify` (`routers/ripper.py:481-487`), which skips the `hold_for_review` branch entirely — `_persist_review_tracks`, `record_preset` and `resolve_job` are never called. The assertion `reenabled.excluded is False` therefore holds because nothing touches the row, not because manual outranks preset. The claims fixture and the stated precedence guarantee are untested (the precedence itself IS covered elsewhere, e.g. `test_identity_resolver.py::test_manual_selected_false_beats_thediscdb_selected_on_unguarded_field` and `test_jobs_router.py::test_patch_sibling_edit_keeps_migrated_legacy_exclusion`, so this is a wrong-reason test, not a missing-coverage defect).

**Repro / evidence.** With an autouse plugin that monkeypatches `arm_backend.routers.ripper.resolve_job` and `record_preset` to raise `AssertionError`, the test still passes:
```
$ PYTHONPATH=$SCRATCH uv run pytest -q -p probe_plugin -k test_identify_repost_on_held_disc_keeps_operator_exclusion
1 passed, 2703 deselected in 2.83s
```

**Tip check.** Still present at `71129cd9`: `services/backend/tests/test_ripper_router.py:692` — same fixture (`"preset": {... "2": {"selected": False}}`, `"manual": ...`) and same two assertions (`len(db.rows["tracks"]) == 2`, `reenabled.excluded is False`); the Guard-1 early path in `identify` is unchanged on the tip.

**Suggested fix location.** feat/identity-core — either retitle/trim it to what it checks (reuse path is a no-op for tracks and claims) or make it exercise the real precedence path (e.g. a held job with existing review tracks + PATCH toggling `excluded`, then assert the stored manual claim and `excluded` after `resolve_job`; or drive `_persist_review_tracks` + `resolve_job` directly with the fixture).

**Verification.** Monkeypatch probe above; code read of `routers/ripper.py:478-487, 547-552`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/90

### D-089  S4  open  docs  origin #97

**Title.** `04-data-model.md` tracks section still documents `role_source` and free-text `role`; new columns undocumented.

**Where.** `docs/developers/architecture/04-data-model.md:84-85` at `12bd0a66` (the migration commit that drops `role_source`/`video_type` and adds `episode_number_end`/`identity_provenance`).

**What.** The PR removes `tracks.role_source` and `tracks.video_type`, turns `role` into the `TrackRole` enum (`main|episode|extra|trailer|other`, validated app-side) and adds `tracks.episode_number_end`, `tracks.identity_provenance` and `jobs.identity_provenance`. The data-model doc in the same PR still lists `role_source` ("community | user | heuristic") and describes `role` as free text with values `feature, alternate_cut, …`, and lists none of the new columns. Docs out of date against code in the same PR.

**Repro / evidence.**

```
$ git grep -n "role_source" origin/feat/identity-core -- docs/developers/architecture/04-data-model.md
84:- `role` (text, nullable — semantic role within the disc: `feature`, `alternate_cut`, ... Free-text, not enum ...)
85:- `role_source` (text, nullable — `community` | `user` | `heuristic`. ...)
$ git grep -n "identity_provenance\|episode_number_end" origin/feat/identity-core -- docs/developers/architecture/04-data-model.md   # (no output)
```

**Tip check.** Still present at `71129cd9`: `docs/developers/architecture/04-data-model.md:85` (`role_source` line unchanged; no `identity_provenance`/`episode_number_end` anywhere in the file on the tip).

**Suggested fix location.** feat/identity-core — the PR that changed the schema should update the data-model doc (tracks + jobs sections).

**Verification.** git grep at head and tip, as above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/91

### D-090  S4  fixed-later  backend  origin #97

**Title.** PR body promises `put_source` keeps last-good claims on a same-inputs error; the code is a plain overwrite.

**Where.** `services/backend/arm_backend/identity/proposals.py:52-55` at `5fb706b0` (feat(backend): identity claim storage and manual/preset recorders).

**What.** `put_source(job, source_id, source_claims)` replaces the source entry unconditionally; there is no `status == "error"` / `inputs` comparison, so a later source run that errors would wipe the previous good proposals. In #97 itself nothing records an error status (TheDiscDB lookup failures are only logged), so there is no runtime impact at this PR; it is a claim in the PR body the diff does not deliver.

**Repro / evidence.**

```python
# proposals.py @5fb706b0
def put_source(job: Job, source_id: str, source_claims: SourceClaims) -> None:
    claims = claims_of(job)
    claims.sources = {**claims.sources, source_id: source_claims}
    _store(job, claims)
```

**Tip check.** Fixed by #99 (feat/identity-episode-matcher) in `daf5b2b4` ("resolver keeps last good on error, leaves unknown owners, reports changed tracks": adds the `status=="error" and existing.status=="ok" and inputs unchanged -> keep existing, stash last_error in extra` branch). The same patch is also on the tip as `2348fe16`, which `lowest_pr.sh` reports TIP-ONLY by sha, but the code is present on `origin/feat/identity-episode-matcher` and above (git grep), absent on `origin/feat/identity-disc-hints`. Recommend: **leave** — the fix is only meaningful once sources that report `status="error"` with `inputs` exist (#98/#99); #97 merged alone is not broken by its absence. Alternatively, drop the sentence from the #97 PR body.

**Suggested fix location.** feat/identity-episode-matcher already has it; edit the #97 PR description.

**Verification.** Code read at head; `git grep -c 'source_claims.status == "error"' origin/<branch> -- services/backend/arm_backend/identity/proposals.py` across the stack.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/92

### D-091  S3  untested-needs-hardware  ripper  origin #98

**Title.** BDMT disc-title probe silently yields nothing for UDF-only Blu-ray sources (no ISO 9660 PVD) — pycdlib refuses to open them and the probe soft-fails to None.

**Where.** `services/ripper/arm_ripper/scan/bd_meta.py:66` (`iso.open(source_path)`) and `:84-94` (`probe_bd_meta` catches the exception and returns None) at `bcf72f90` (feat(ripper): read the Blu-ray BDMT disc title), unchanged through head `d826dc55`.

**What.** `_read_bdmt` is the only read path; `PyCdlib.open()` raises `PyCdlibInvalidISO('Valid ISO9660 filesystems must have at least one PVD')` (`pycdlib/pycdlib.py:685` in the pinned 1.14.0) for a pure-UDF 2.50 image, which is exactly what DVDFab-style Blu-ray backups (and plausibly pressed BD-ROMs, which are UDF 2.50 by spec) look like. For those the feature the PR adds never fires: `bd_meta` stays None, `bd_title` records `skipped: "no BDMT disc title"`, and identify falls back to the raw volume label / file name. The volume-label hint still works, so there is a workaround (S3, not S2). The ISO-9660+UDF bridge case does work — verified end-to-end against a pycdlib-authored UDF 2.60 image (`probe_bd_meta` returned `name='Test Show: Season 2' set_number=3 num_sets=4 language='eng'`, English preferred over `bdmt_jpn.xml`).

**Repro / evidence.**

```
# pinned pycdlib refuses any image lacking an ISO 9660 PVD:
grep -n "must have at least one PVD" .venv/lib/python3.14/site-packages/pycdlib/pycdlib.py   # -> :685
# tip straggler commit message confirms the real-world case:
git show --no-patch 89a5cf53   # "PyCdlib refuses an image without an ISO 9660 primary volume descriptor,
                               #  which is what DVDFab's UDF 2.50 Blu-ray backups are, so for them the disc
                               #  title from BDMV/META ... were both unavailable"
```

**Tip check.** GONE on the tip, but fixed only on the integration tip by `89a5cf53` ("feat(ripper): read UDF-only images through 7-Zip for the BD title and matrix256" — adds `scan/udf_image.py` (`7z l -slt -ba -- <img>` / `7z e -so -- <img> <path>`, `--` guard, 180s/60s timeouts, None when the binary is missing), installs `7zip` in the ripper Dockerfile, and `bd_meta.py:108` falls back to `_read_bdmt_udf` when pycdlib raises) plus `2837d671` ("the UDF image reader runs 7zz when 7z is not installed" — Debian 12's `7zip` package ships only `7zz`, so the first fix never activated in the image). `lowest_pr.sh` → `TIP-ONLY` for both; they are in no open PR, so the stack can merge without them → **OPEN**. The 7z path keeps the ripper unprivileged (no mount, no caps — consistent with feedback_ripper_unprivileged_no_mount).

**Suggested fix location.** feat/identity-disc-hints — this PR introduces the BDMT read and the body claims it works for Blu-rays; cherry-pick `89a5cf53` + `2837d671` (udf_image.py, bd_meta fallback, Dockerfile `7zip`, the two test files) down into it, dropping the matrix256_fp.py hunk which belongs to off-stack #82.

**Verification.** untested-needs-hardware — needs a UDF-only BD image or a pressed Blu-ray. Human: `ARM_SOURCE_PATH=/path/to/udf-only.iso bash devtools/iso-smoke.sh` (or insert a retail BD) and check the ripper log for `bdmt device=... name=...` and `identity_claims.sources.bd_title.status == "ok"` on the job; at #98 head expect `skipped`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/93

### D-092  S4  open  backend  origin #98

**Title.** `parse_label` leaves a year token inside the "cleaned" hint title (e.g. `THE_OFFICE_2005_S1_D2` → `"the office 2005"`), so the first-searched candidate carries the year as query text and the TV search has no year filter to compensate.

**Where.** `services/backend/arm_backend/identity/sources/label_hints.py:113` (title construction) and `:150` (title emitted whenever a season/disc marker was stripped) at `7d62a807`; consumed at `services/backend/arm_backend/metadata/dispatcher.py:147` (hint candidate searched before the label candidate) at `5a46df1a`.

**What.** The module docstring promises "a cleaned search title", and the dispatcher's own `_normalize_volume_label` strips a trailing year (`_YEAR_SUFFIX_RE`) and passes it as the `year` filter; `parse_label` only strips trailing S/D/DISC markers, so a year that sits before the marker survives into the hint. Because `hint_is_tv` is True for these labels, `_search_title(..., tv_first=True)` calls `tmdb.search_tv("the office 2005")` — `search_tv` takes no year, so the year is pure query noise; the movie fallback gets `year=label_year` only via the dispatcher's label pass. A miss falls through to the label candidate (`"THE OFFICE 2005 S1 D2"`), which is worse still. Rare label shape (year + season/disc marker), cosmetic/quality impact, hence S4.

**Repro / evidence.**

```
uv run python -c 'import os;os.environ.setdefault("DATABASE_URL","postgresql://x:x@localhost/x");os.environ.setdefault("ARM_SERVICE_TOKEN","t")
from arm_backend.identity.sources.label_hints import parse_label
print(parse_label("THE_OFFICE_2005_S1_D2")); print(parse_label("BAND_OF_BROTHERS_2001_D1"))'
# LabelHints(title='the office 2005', season=1, disc_number=2, ...)   LabelHints(title='band of brothers 2001', disc_number=1, ...)
```

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/identity/sources/label_hints.py:113` (tip's label_hints.py differs from head only by the added `inputs()` method; `dispatcher.py:152` still appends the hint candidate first).

**Suggested fix location.** feat/identity-disc-hints — strip a trailing `(19|20)\d{2}` from `s` after the marker pass (or reuse `_YEAR_SUFFIX_RE`) and let the dispatcher keep supplying `label_year`.

**Verification.** Reproduced with the command above at head `d826dc55`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/94

### D-093  S3  open  backend  origin #99

**Title.** `/identity/match apply=true` → `invalidate()` → the rerun-once starts while the router is still computing and later overwrites the operator's stored match with a default-input recompute.

**Where.** `services/backend/arm_backend/identity/stage_runner.py:229-231` (`_done` reschedules the moment the invalidated run finishes), `:358` (phase 2 only skips when `job_id in self._rerun`), and `services/backend/arm_backend/routers/identity.py:192` (`stage_runner.invalidate(job_id)` is called BEFORE the router's own network round-trip and commit) at `78a78826` (introduced in `b2fb0fbf`/`eac6df2a`).

**What.** When a background run for the job is pending or in flight (right after identify / rip-start, during the startup-sweep backlog behind `MAX_CONCURRENT_RUNS=2`, or while a provider is slow/backing off), the router marks it for rerun and then spends seconds on providers. The invalidated run reaches phase 2, returns without writing, and `_done` immediately `schedule()`s the rerun, whose phase-1 snapshot is taken before the router commits: it sees no pin, the old `job.season`, and the default tolerance. Its phase 2 blocks on `FOR UPDATE` until the router commits, then `put_source` replaces the router's freshly stored `episodes_*` entry (operator tolerance / `/match` season gone; a different season may have been scanned) while the pin the router set remains, so the resolver now applies the rerun's claims instead of what the operator previewed and applied. The rerun should not start until the caller's write has landed (e.g. `invalidate()` hands back a deferral the router releases after commit, or the router calls `schedule()` itself after commit and `_done` does not auto-reschedule an invalidated run).

**Repro / evidence.** Script using the PR's own test doubles (`_GatedSeasonProvider`, `FakeSession`), run with `uv run python` from the worktree root:
```
rerun started while router still computing: True | pin seen by rerun: {}
router stored inputs: {'show_id': '100', 'season': 1, 'disc_number': None, 'tolerance': 123, 'nominal_runtimes': False}
after rerun   inputs: {'show_id': '100', 'season': 1, 'disc_number': None, 'tolerance': 300, 'nominal_runtimes': False}
pin still: {'episode': 'episodes_tmdb'} | provider.season calls: [('season', 1), ('season', 1)]
```
(`/tmp/claude-0/-home-user/e06fb963-3780-5816-b936-b6d6249b1440/scratchpad/pr99/race_repro.py`: schedule → block in `season()` → `invalidate()` → release → rerun's `season()` reached → emulate the router's commit (`put_source` with tolerance 123 + `set_pin`) → release rerun → stored inputs are back to tolerance 300.) The existing `test_invalidate_marks_rerun_when_run_has_started` never models the caller's write, so it passes without exercising this ordering.

**Tip check.** Still present at `71129cd9`: `identity/stage_runner.py:229-231` (`if job_id in self._rerun and not self._shutdown: ... self.schedule(job_id)`), `:358` (`if fresh_job is None or job_id in self._rerun:`), `routers/identity.py:192` (`stage_runner.invalidate(job_id)`). The only tip change to `stage_runner.py` is the `ids_before.get(field) != value` line (338); no later commit touches the rerun scheduling.

**Suggested fix location.** feat/identity-episode-matcher — the runner and the `/match` route are both introduced here; the fix is self-contained (defer the rerun until the caller commits).

**Verification.** Reproduced with the script above against the PR head; no hardware needed.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/95

### D-094  S4  open  backend  origin #99

**Title.** Operator-supplied external ids are interpolated unescaped into provider URL paths.

**Where.** `services/backend/arm_backend/identity/episodes/providers/tmdb.py:122` (`f"{settings.ARM_TMDB_BASE_URL}/find/{external_id}"`) and `services/backend/arm_backend/identity/episodes/providers/tvdb.py:94` (`f".../search/remoteid/{ids.imdb}"`) at `78a78826` (introduced in `f598a247` / `8dfa7a87`).

**What.** `ExternalIds` (`packages/arm_common/arm_common/schemas/job_metadata.py:35-43`) has no pattern, and `ResolveRequest.external_ids` accepts any string, so an operator pasting an IMDb URL, an id with trailing whitespace, or anything containing `/`, `?` or `#` produces a malformed provider path (a `?` even injects query params ahead of `external_source`). TMDb/TVDB answer 404 → `SourceMiss` → the stage records `status="miss", detail="show not found"` with no hint that the id was malformed. `urllib.parse.quote(value, safe="")` at the two call sites (or an `^tt\d+$` / digits validator on the id fields) would make the failure explicit. TVmaze is unaffected (ids go in `params`).

**Repro / evidence.** `POST /api/jobs/{id}/resolve {"title":"X","external_ids":{"imdb":"https://www.imdb.com/title/tt0903747/"}}` then `GET /api/jobs/{id}/identity/episodes?source=tmdb&season=1` → `GET /3/find/https://www.imdb.com/title/tt0903747/?external_source=imdb_id` → 404 → "no tmdb show id known for job". No `quote` usage anywhere under `identity/` (`grep -rn quote services/backend/arm_backend/identity/` is empty).

**Tip check.** Still present at `71129cd9`: `providers/tmdb.py:52` (`f"{settings.ARM_TMDB_BASE_URL}/find/{external_id}"`), `providers/tvdb.py:94` (`.../search/remoteid/{ids.imdb}`). The providers directory has no commits above this PR on the tip.

**Suggested fix location.** feat/identity-episode-matcher — the two provider call sites are new here.

**Verification.** Code read + grep; the HTTP path shape follows from httpx's URL handling (not executed against the live providers — no key).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/96

### D-095  S4  open  docs  origin #99

**Title.** `02-job-lifecycle.md` still says Play-All titles are "not auto-detected" while this PR's matcher detects them (sum-of-episodes and sum-of-other-titles) and roles them `extra`.

**Where.** `docs/developers/architecture/02-job-lifecycle.md:287` at `78a78826` (the PR edits lines 285 and adds the "Episode matching" section at 295-298 but leaves 287 as-is).

**What.** Line 287: `"Play All" tracks ... are *not* auto-detected and filtered — "duration ≈ sum of other tracks" doesn't work because special features on the same disc confound the heuristic.` The same PR adds `matcher._is_play_all` (3+ consecutive episode sum, sum of ≥3 other titles, or exactly-two-others within 10 s) and `episode_stage._ok_claims` stores every `play_all` ref as `TrackClaim(role=EXTRA)` (`episode_stage.py:311-312`). The sentence contradicts the new section two paragraphs below; it should say the naming layer does not filter them but the episode stage marks them `extra`.

**Repro / evidence.** `grep -n 'not\* auto-detected' docs/developers/architecture/02-job-lifecycle.md` → line 287; `grep -n play_all services/backend/arm_backend/identity/episode_stage.py` → 311, 328.

**Tip check.** Still present at `71129cd9`: `docs/developers/architecture/02-job-lifecycle.md:287` (identical sentence).

**Suggested fix location.** feat/identity-episode-matcher — the contradicting section is added by this PR.

**Verification.** Code/doc read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/97

### D-096  S3  open  ui-neu  origin #100

**Title.** Emptying an int setting now sends `null`; for `thediscdb_refresh_days` and `manual_wait_seconds` the backend has no None check, so Save ends in an unhandled NOT NULL IntegrityError (HTTP 500).

**Where.** `services/ui-neu/frontend/src/lib/components/settings/ConfigSchemaField.svelte:86` at `037ef7f2` (`value = raw === '' ? null : Number(raw);`); backend side `services/backend/arm_backend/routers/config.py:160-162` (None/positive check covers only `drive_scan_interval_seconds`, `drive_detected_prune_days`, `max_parallel_transcodes`) and `:208` (`setattr` loop) at head `0afe5abe`.

**What.** Before this PR an int field was a text input: clearing it sent `""`, which Pydantic rejected with a 422 the form displayed. The new `type="number"` input converts an empty box to `null`, which `ConfigUpdateRequest.thediscdb_refresh_days: int | None` accepts; `update_config` writes `None` into a `nullable=False` column and `session.commit()` raises `IntegrityError` -> 500, shown as "Couldn't save settings. API 500: Internal Server Error". `thediscdb_refresh_days` sits in Settings > Metadata > Lookup, `manual_wait_seconds` in Ripping. Workaround: type a number. Either the input must not emit `null` for a NOT NULL int, or the router must 400 like it does for the other three ints (the PR itself added exactly that style of check for `episode_match_tolerance_seconds`).

**Repro / evidence.** Temporary e2e test (real SQLite harness, `tests/e2e/conftest.py` `app_client` + `admin_token`), run with `uv run pytest -q -k test_pr100_repro_null_int_fields`:
```
PATCH /api/config {"thediscdb_refresh_days": null}  -> IntegrityError: NOT NULL constraint failed: config.thediscdb_refresh_days
PATCH /api/config {"manual_wait_seconds": null}     -> IntegrityError: NOT NULL constraint failed: config.manual_wait_seconds
PATCH /api/config {"drive_scan_interval_seconds": null} -> 400 "must be a positive integer"   (the validated one, for contrast)
```
The UI path: `SchemaConfigForm.buildPayload()` sends the field because `unchanged(null, 7)` is false.

**Tip check.** Still present at `71129cd9`: `ConfigSchemaField.svelte:106-113` (`type="number"` ... `raw === '' ? null : Number(raw)`), `routers/config.py:158` (same three-key list; the tip only adds a `max_parallel_iso_rips` 1..8 check from #101), `routers/config.py:210` setattr loop. The straggler `67f81e06` on the tip is a byte-identical re-commit of `037ef7f2` (interdiff empty), not a fix.

**Suggested fix location.** feat/identity-settings — the PR introduced the `null` emitter; add `thediscdb_refresh_days`/`manual_wait_seconds` to the positive-int 400 list in `routers/config.py` (backend defence) and/or keep the number input from emitting `null` for a non-nullable int.

**Verification.** Executed the repro above against the real-DB e2e harness at the PR head (file removed afterwards); UI side traced through `ConfigSchemaField` -> `SchemaConfigForm.buildPayload` -> `saveArmConfig`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/98

### D-097  S3  open  backend  origin #100

**Title.** Changing `episode_sources` / `disc_hint_sources` does not re-resolve existing jobs, so a disabled source's already-applied fields stay on the job until an unrelated trigger runs the resolver.

**Where.** `services/backend/arm_backend/routers/config.py:208-220` at `23c0b15a` (fields are `setattr`'d and committed; nothing re-resolves jobs); `services/backend/arm_backend/identity/pipeline.py:35-38` at `29640970` (the only place `disabled_source_ids(cfg)` is consulted is inside `resolve_job`); docs claim `docs/developers/architecture/02-job-lifecycle.md:297` at `39c8278a` ("unchecking one stops it running and resets the fields it owned").

**What.** Operator sees a wrong season/disc number from the `label` hint (or a wrong episode placement from `episodes_tmdb`) on an `awaiting_review`/`identified` job, unchecks that source in Settings > Metadata > TV episodes and saves. The job page keeps showing the old values and the rip/transcode will use them: the resolver logic is right (test `test_resolve_job_resets_when_config_disables_the_winning_source` shows the reset) but `resolve_job` is only run by the episode stage, `PATCH /api/jobs/{id}`, `/resolve`, `/identity/match` and `/identity/pin`. Nothing runs it after a config change. Workaround: `POST /api/jobs/{id}/identity/match` or `PATCH` any identity field on each affected job. Either re-run `resolve_job` (and the episode stage, since a newly enabled source has no stored claims yet) for live jobs when these keys change, or change the doc/PR-body wording to "takes effect the next time the job is resolved".

**Repro / evidence.** `test_resolve_job_resets_when_config_disables_the_winning_source` (`services/backend/tests/test_identity_pipeline.py`) needs a second explicit `await resolve_job(db, job)` after swapping the config row; grep shows no `resolve_job`/`EpisodeStageRunner` reference in `routers/config.py` at head or tip.

**Tip check.** Still present at `71129cd9`: `routers/config.py:210` (setattr loop, no identity follow-up; tip adds only the transcode re-drain and ISO cap), `identity/pipeline.py:38`, doc sentence at `02-job-lifecycle.md:297`.

**Suggested fix location.** feat/identity-settings — the PR introduces both the setting and the doc claim; a follow-up in #101/#102 would still leave the claim false for this PR merged alone.

**Verification.** Traced statically; backend tests at head exercise `resolve_job` only when called explicitly. No hardware needed to confirm (a PATCH to `/api/config` followed by `GET /api/jobs/{id}/identity` on a dev stack shows the unchanged fields).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/99

### D-098  S4  open  ui-neu  origin #100

**Title.** `RankedListField`'s "Needs <source> key" chip hardcodes the `Metadata` tab in its deep link instead of deriving it from the required key's field metadata.

**Where.** `services/ui-neu/frontend/src/lib/components/settings/RankedListField.svelte:91` at `dc362123` (`href="#Metadata/{missing}"`).

**What.** `ranked` is a generic field type and `enum_requires` maps a value to an arbitrary secret key; the component is reused by first-run setup per `feedback_setup_reuses_settings_components.md`. The settings deep link is `#<tab>/<field key>` (`routes/settings/+page.svelte:120-135`), so a ranked field whose required key lives in another group would open the wrong tab. Today both keys happen to be in Metadata, so it works by coincidence. Should look the key up in the group list / `CONFIG_FIELD_META` (the form already has `group.fields`) or receive the tab from the parent.

**Repro / evidence.** `RankedListField.test.ts` asserts the literal `'#Metadata/tvdb_api_key'`; no group lookup exists in the component.

**Tip check.** Still present at `71129cd9`: `RankedListField.svelte:91` `href="#Metadata/{missing}"`.

**Suggested fix location.** feat/identity-settings — the component is introduced here.

**Verification.** Static read of head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/100

### D-099  S4  open  ui-neu  origin #100

**Title.** Two recurring visual patterns are re-implemented inline instead of shared: the TV-episodes summary strip copies SessionCard's recipe strip, and the "Advanced" label copies `.session-card-recipe-label` (`feedback_standard_ui_patterns.md`: a pattern in two places is extracted).

**Where.** `services/ui-neu/frontend/src/lib/components/settings/TvEpisodesSummary.svelte:61-62, 92-125` at `639f68db` ("Recipe strip metrics copied from SessionCard.svelte's .session-card-recipe"); `services/ui-neu/frontend/src/lib/components/settings/SchemaConfigForm.svelte:323-335` at `037ef7f2` ("the session-card-recipe-label look (SessionCard.svelte), restated here since this is its only other consumer - not yet a shared block").

**What.** Both comments acknowledge the duplication. The memory rule is explicit that the second site is the moment to extract. On the tip a shared `sessions/RecipeStrip.svelte` (cells + chevron arrows, mobile stacking) now exists and is used by SessionCard and the setup disc table, but `TvEpisodesSummary` still carries its own copy of the strip markup and CSS, so Settings > Metadata and Settings > Sessions will drift as RecipeStrip evolves (it already differs: tint token, separator breakpoint 40rem vs the shared one's).

**Repro / evidence.** `git show 71129cd9:services/ui-neu/frontend/src/lib/components/settings/TvEpisodesSummary.svelte | grep -n import` -> only `Glyph` and the type import; `RecipeStrip.svelte` added by `e7945cd4` "refactor(ui): shared RecipeStrip (sessions + setup disc table)".

**Tip check.** Still present at `71129cd9`: `TvEpisodesSummary.svelte:61` (copy comment) and `:92` (`.tv-episodes-summary-strip`), `SchemaConfigForm.svelte:383-384` (advanced label copy). The extraction commit `e7945cd4` is TIP-ONLY (in no open PR) and did not migrate TvEpisodesSummary anyway.

**Suggested fix location.** feat/identity-settings for the advanced label (introduced here, trivially a shared `.section-label` utility); the strip should adopt `RecipeStrip` once that straggler lands in a PR (or extract it here and let `e7945cd4` rebase onto it).

**Verification.** Static read of head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/101

### D-100  S2  open  ripper  origin #101

**Title.** The extract fallback (`iso_extract`) needs 7-Zip, but this PR's ripper image never installs it; every image MakeMKV cannot open fails as "no titles".

**Where.** `services/ripper/arm_ripper/iso_extract.py:92-95` (`shutil.which("7z") or shutil.which("7zz")` -> `logger.error("7-Zip (7z / 7zz) is not installed")`, return False) and `services/ripper/Dockerfile` runtime apt list (no `7zip`/`p7zip`) at `d2de3dde` (introduced by b84c4470 "unpack an image MakeMKV cannot open", 7038537f "runs 7zz when 7z is not installed").

**What.** The PR advertises (memory `project_iso_source_ripping.md`, doc 10 section "Extract fallback", commits b84c4470/7038537f) that a DVDFab UDF 2.50 ISO MakeMKV crashes on is unpacked with `7z x -tudf` and ripped as a folder. The PR touches no Dockerfile and the ripper image's apt lists contain no 7-Zip package, so `_run_7z` always returns False, `extract()` returns None, `_scan_extracted` returns None, and rip-start fails the job with `ISO_NO_TITLES` ("even after unpacking it" — misleading, nothing was unpacked). The ripper tests only pass because they monkeypatch `shutil.which` (`tests/test_iso_extract.py:226,242`) or skip (`needs_7z`).

**Repro / evidence.**

```
grep -n "7zip\|7zz\|p7zip" services/ripper/Dockerfile        # head: no output
git show origin/integration/all-prs-3:services/ripper/Dockerfile | grep -n 7zip   # tip: line 93 "7zip \"
git log -S'7zip' origin/feat/identity-settings..origin/integration/all-prs-3 -- services/ripper/Dockerfile
# -> 89a5cf53 feat(ripper): read UDF-only images through 7-Zip for the BD title and matrix256   (lowest_pr.sh: TIP-ONLY)
```

**Tip check.** Fixed only on the integration tip by `89a5cf53` (`feat(ripper): read UDF-only images through 7-Zip for the BD title and matrix256`, adds `7zip` to the ripper runtime apt list at Dockerfile:93), which is in no open PR -> OPEN.

**Suggested fix location.** feat/iso-source-rip — add `7zip` to the runtime stage's `apt-get install` list in `services/ripper/Dockerfile` (the code already prefers `7zz`, which is the binary Debian's `7zip` package ships), or move 89a5cf53 down into this PR.

**Verification.** Static (grep of the Dockerfile at head vs tip). Runtime: untested-needs-hardware — build the ripper image from this branch and run `bash devtools/iso-smoke.sh` against an ISO that `makemkvcon info iso:` lists no titles for; expect the job to fail with "MakeMKV found no titles in this ISO, even after unpacking it" and the ripper log line "iso extract: 7-Zip (7z / 7zz) is not installed".

**Issue.** https://github.com/uprightbass360/arm-v3/issues/102

### D-101  S3  open  backend  origin #101

**Title.** An ISO (or disc folder) whose name contains `:` cannot be ripped: the bind spec docker-py builds is `host:container:mode`, so the extra colon makes the spawn fail with 500 and the drive is retired.

**Where.** `services/backend/arm_backend/ripper_manager.py:175` (`volumes[iso_host_path(drive.source_path, library_host=library_host)] = {"bind": source, "mode": "ro"}`) with `source = drive.device_path = f"/source/{target.name}"` set in `services/backend/arm_backend/iso_rips.py:353`, at `d2de3dde` (introduced by ff9890cf).

**What.** The physical-drive spec only ever binds operator-configured directories; the virtual spec binds a user-named file, on both sides of the colon. docker-py's `convert_volume_binds` renders a dict volume as `f'{k}:{bind}:{mode}'` (`.venv/.../docker/utils/utils.py:168-170`) and the daemon's Linux bind parser rejects a spec with more than three colon-separated fields ("invalid volume specification"). Names like `Star Wars: Episode IV.iso` are ordinary on Linux file systems. `ensure_running` raises `RipperManagerError`, `create_iso_rip` retires the just-created drive and answers 500 "could not start the ISO ripper: ...". Workaround: rename the file.

**Repro / evidence.** `touch "$ARM_HOST_ISO_LIBRARY_PATH/A: B.iso"`, then `POST /api/iso/rips {"path": "A: B.iso"}` -> 500 (truncation check passes since the file is empty/unknown layout). Or, zero-infra: `RipperManager(settings, FakeDocker).container_spec(drive)` yields `volumes={"/lib/A: B.iso": {"bind": "/source/A: B.iso", "mode": "ro"}}` which docker-py serialises as `/lib/A: B.iso:/source/A: B.iso:ro`.

**Tip check.** Still present at `71129cd9`: `services/backend/arm_backend/ripper_manager.py:175` (identical line; no tip commit touches the bind construction).

**Suggested fix location.** feat/iso-source-rip — bind at a fixed, name-free container path (e.g. `/source/image.iso` / `/source/disc`) and pass the display name separately, or switch the virtual spec to `mounts=[docker.types.Mount(target, source, type="bind", read_only=True)]`, which carries source/target as separate fields and accepts colons.

**Verification.** untested-needs-hardware (needs a docker daemon): run the `touch`+POST above against a dev stack; expect HTTP 500 and the backend log `could not start the ISO ripper: APIError: ... invalid volume specification`. Static reasoning from docker-py's bind formatter is quoted above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/103

### D-102  S4  open  backend  origin #101

**Title.** New uncovered backend statement: `_virtual_source_drive`'s `drive_id is None` guard is unreachable from `rip_start` and has no test or pragma.

**Where.** `services/backend/arm_backend/routers/ripper.py:107-108` at `d2de3dde` (introduced by 00790a2f "Rip from folder").

**What.** `rip_start` reaches `_virtual_source_drive` only after `require_drive_owner_by_job`, which already 403s a job with `drive_id=None` ("job has no owning drive"), so `return None` on line 108 can never execute and the Backend's 100%-statement policy is broken for a file the PR touched (coverage report: `routers/ripper.py ... 99%  108, 548, ...`; 548/1008 pre-exist at BASE).

**Repro / evidence.**

```
uv run coverage run -m pytest -q && uv run coverage report --include='services/backend/arm_backend/*' -m
# services/backend/arm_backend/routers/ripper.py   520   3  ...  99%   108, 548, ...
```

**Tip check.** Still present at `71129cd9`: `routers/ripper.py:109-110` (same guard). The only tip test with `drive_id=None` (`services/backend/tests/test_ripper_router.py:2634`, `test_owner_check_rejects_job_whose_drive_was_deleted`) asserts the 403 from the owner check, so the branch stays unreached there too; ccd66608's coverage top-up covers the dump-fallback branches, not this one.

**Suggested fix location.** feat/iso-source-rip — drop the guard (make `drive_id: str` the precondition, as the owner dependency guarantees) or add a direct unit test of `_virtual_source_drive` with a drive-less job.

**Verification.** coverage run above at head.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/104

### D-103  S4  open  ripper  origin #101

**Title.** `ARM_SOURCE_KIND` is set by the backend, declared by the ripper and documented as "selects the MakeMKV source scheme", but nothing in the ripper reads it.

**Where.** `services/ripper/arm_ripper/config.py:47-51` (comment + `ARM_SOURCE_KIND: str = "iso"`), `services/backend/arm_backend/ripper_manager.py:167` (`env["ARM_SOURCE_KIND"] = ...`), `docs/developers/architecture/10-iso-source-ripping.md:143-144`, at `d2de3dde` (introduced by 9248d772 / ff9890cf).

**What.** `rg ARM_SOURCE_KIND services/ripper/arm_ripper` matches only the Settings declaration. The MakeMKV scheme (`iso:`/`file:`/`dev:`) is chosen by inspecting the path (`source.py:makemkv_source_url`, `is_folder_source`), so the env var is dead configuration and the config comment/architecture doc describe a mechanism that does not exist. Also the comment still says "`folder` is a later addition" although the same PR ships it.

**Repro / evidence.** `grep -rn ARM_SOURCE_KIND services/ripper/arm_ripper/` -> only `config.py:51`.

**Tip check.** Still present at `71129cd9`: `services/ripper/arm_ripper/config.py:51` (declared, never read), `ripper_manager.py:168` (still set).

**Suggested fix location.** feat/iso-source-rip — either read it (`source.py` could trust the kind instead of re-sniffing) or remove the env var from both sides and fix the comment/doc.

**Verification.** grep above at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/105

### D-104  S4  open  docs  origin #101

**Title.** Status-Roadmap lists "Extracted disc folders as a rip source" as "Next up" while this PR ships Rip from folder.

**Where.** `docs/user/Status-Roadmap.md:50-52` at `d2de3dde` (text from 56b69631; feature added by 00790a2f in the same PR).

**What.** The roadmap says a `BDMV`/`VIDEO_TS` folder source is not built yet, but `GET /api/iso/folders`, `DriveSourceKind.FOLDER`, `disc_folders.py` and the gear menu's "Rip from folder" are all in this diff. Docs out of date against code in the same PR.

**Repro / evidence.** `grep -n "Extracted disc folders" docs/user/Status-Roadmap.md` vs `grep -n '"/folders"' services/backend/arm_backend/routers/iso.py` (line 124).

**Tip check.** Still present at `71129cd9`: `docs/user/Status-Roadmap.md:49-51` (same paragraph).

**Suggested fix location.** feat/iso-source-rip — move the bullet into the "in place" list next to the ISO bullet.

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/106

### D-105  S4  open  docs  origin #101

**Title.** Configuring-ARM recommends a relative `ARM_HOST_ISO_LIBRARY_PATH` ("e.g. `./iso-library`") that the backend deliberately treats as "not configured".

**Where.** `docs/user/Configuring-ARM.md:37` vs `services/backend/arm_backend/iso_library.py:200-205` (`library_configured()` requires `Path(host).is_absolute()`), at `d2de3dde` (both from 56b69631 / b3940e54).

**What.** An operator who follows the doc and sets `ARM_HOST_ISO_LIBRARY_PATH=./iso-library` gets the compose mount (it is interpolated into the `volumes:` entry) but `GET /api/iso/library` answers 503 "the ISO library is not configured" and the picker shows the setup card. The code's reason (a relative bind source would be read by docker as a named volume for the spawned ripper) is correct; the doc is wrong.

**Repro / evidence.** `.env`: `ARM_HOST_ISO_LIBRARY_PATH=./iso-library` -> `library_configured()` False -> 503.

**Tip check.** Still present at `71129cd9`: `docs/user/Configuring-ARM.md:37` (same cell) and `iso_library.py:15-18` (same rule).

**Suggested fix location.** feat/iso-source-rip — say "an absolute host path, e.g. `/srv/arm/iso-library` or a NAS mount; relative values are ignored".

**Verification.** read of both files at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/107

### D-106  S4  open  ui-neu  origin #101

**Title.** IsoPicker re-implements byte formatting inline instead of using the shared `formatBytes` helper.

**Where.** `services/ui-neu/frontend/src/lib/components/IsoPicker.svelte:97-103` (`function formatSize`) vs `services/ui-neu/frontend/src/lib/utils/format.ts:16` (`export function formatBytes`), at `d2de3dde` (introduced by e429377c).

**What.** `feedback_standard_ui_patterns.md`: recurring UI logic is a shared helper, never a one-off. `formatSize` duplicates `formatBytes` with slightly different output (`'--'` for null, `1` decimal above bytes), so ISO sizes in the picker format differently from sizes elsewhere in the UI.

**Repro / evidence.** `grep -rn "function formatSize\|export function formatBytes" services/ui-neu/frontend/src/lib`.

**Tip check.** Still present at `71129cd9`: `IsoPicker.svelte:97` (`function formatSize`).

**Suggested fix location.** feat/iso-source-rip — `import { formatBytes } from '$lib/utils/format'` and keep only the null fallback.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/108

### D-107  S4  open  ui-neu  origin #101

**Title.** The picker's "not configured" card tells every operator to redeploy with `bash devtools/setup-dev.sh up`, a dev-only script.

**Where.** `services/ui-neu/frontend/src/lib/components/IsoPicker.svelte:346` at `d2de3dde` (introduced by e429377c).

**What.** `feedback_ui_port_8081.md`: the installer is canonical for deployment values. Production installs (install.sh-generated compose) have no `devtools/` directory; the instruction is wrong for them (they need `docker compose up -d` after editing `.env`). The same card is the only in-product guidance for enabling the feature.

**Repro / evidence.** `grep -n "setup-dev.sh up" services/ui-neu/frontend/src/lib/components/IsoPicker.svelte`.

**Tip check.** Still present at `71129cd9`: `IsoPicker.svelte:346` (same line).

**Suggested fix location.** feat/iso-source-rip — "restart the stack (`docker compose up -d`)", or link to Configuring-ARM.

**Verification.** grep at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/109

### D-108  S4  open  ripper  origin #101

**Title.** `_scan_extracted` removes a multi-GB extraction with a synchronous `shutil.rmtree` on the event loop.

**Where.** `services/ripper/arm_ripper/scan/dispatcher.py:31` (`iso_extract.discard_all()` inside `async def _scan_extracted`) at `d2de3dde` (introduced by b84c4470).

**What.** `discard_all` is plain `shutil.rmtree`. When the unpacked folder (up to a full Blu-ray, under `/raw/.iso-extract/<drive_id>/`) yields no titles, the deletion runs inline in the scan coroutine and blocks the ripper's heartbeat loop, WS client and the `prepare` keepalive for the duration of the rmtree. `main.run_source_mode` does the same cleanup correctly via `asyncio.to_thread(iso_extract.discard_all)`, and `iso_extract.extract` offloads its own rmtree calls; this call site is the odd one out.

**Repro / evidence.** diff hunk: `logger.warning("extracted image %s has no titles either; dropping the extraction", device_path)` followed by bare `iso_extract.discard_all()`.

**Tip check.** Still present at `71129cd9`: `services/ripper/arm_ripper/scan/dispatcher.py:31` (same call).

**Suggested fix location.** feat/iso-source-rip — `await asyncio.to_thread(iso_extract.discard_all)`.

**Verification.** code read; blocking duration depends on extraction size (untested-needs-hardware for timing).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/110

### D-109  S3  open  ui-neu  origin #102

**Title.** MakeMKV step records done/attention from a config snapshot taken before the key was entered or verified.

**Where.** `services/ui-neu/frontend/src/lib/components/setup/steps/MakemkvStep.svelte:14` and `services/ui-neu/frontend/src/lib/components/setup/SetupConfigFields.svelte:19-28,36-38` at `a725180d` (introduced in 9056efd7).

**What.** `MakemkvStep.commit()` saves the form, then decides the recorded state with `fields.current()?.makemkv_key_valid === false ? 'attention' : 'done'`. `SetupConfigFields.current()` returns the `ConfigView` fetched once in `onMount` (`config = s.config`); neither `save()` nor the `MakemkvKeyField` 5s poll (which keeps its own `cfg`) refreshes it. On a fresh install `makemkv_key_valid` is `null` at mount, so a purchased key the ripper has since rejected (the widget's own status strip says "Key not accepted") is recorded `done`; conversely an install whose earlier key was invalid at mount but was replaced with a working one (or switched to the beta key) is recorded `attention`. The stepper, Finish summary and dashboard checklist then show a state that contradicts the live status on the same page.

**Repro / evidence.**

```
# SetupConfigFields.svelte: config is only ever assigned here
onMount(async () => { const s = await fetchSettings(); group = ...; config = s.config; });
export async function save() { return form ? form.save() : false; }   // does not touch `config`
export function current() { return config; }
# MakemkvStep.svelte:14
return fields.current()?.makemkv_key_valid === false ? 'attention' : 'done';
```
Manual: Settings-free fresh install, enter a bogus purchased key, wait for the enrolled drive's ripper to report `invalid` (status strip turns "Key not accepted"), press Continue -> stepper shows "Done".

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:services/ui-neu/frontend/src/lib/components/setup/steps/MakemkvStep.svelte` line 14 is the identical `fields.current()?.makemkv_key_valid === false` expression; `SetupConfigFields.svelte` identical.

**Suggested fix location.** feat/first-run-setup - re-fetch `/api/config` (or take the `MakemkvKeyField`'s polled `cfg`) after `save()` before deciding, or make the decision in the backend when the step is PUT.

**Verification.** Code trace at head (vitest has no test for the makemkv commit path: `steps-behaviour.test.ts` covers Account/System/Drives only). Live confirmation needs an enrolled drive: untested-needs-hardware (run the walkthrough on a dev stack with one optical drive).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/111

### D-110  S4  open  docs  origin #102

**Title.** Docs and Finish summary written in this PR describe a guest-access choice on step 1 that the same PR removed.

**Where.** `docs/user/Setup-Walkthrough.md:21-22`, `docs/user/Getting-Started.md:170-172`, `services/ui-neu/frontend/src/lib/components/setup/steps/FinishStep.svelte:54` at `a725180d`; the removal is commit a30b9de4 (`AccountStep.svelte` lost `GuestAccessField`).

**What.** Setup-Walkthrough.md ("You can also let people on your network view ARM without signing in (read-only)") and Getting-Started.md step 1 ("choose whether guests on your network can look around") tell the operator to expect a guest-access control on the account step; `AccountStep.svelte` renders only the password form (the test `steps-behaviour.test.ts` even asserts "guest access is not part of the step"). FinishStep's account summary still reads "Password changed. Guest access on/off." for a setting the walkthrough never offered. The PR body repeats the claim.

**Repro / evidence.**

```
$ grep -n GuestAccessField services/ui-neu/frontend/src/lib/components/setup -r   # no hits
$ grep -n "network view" docs/user/Setup-Walkthrough.md   # 21: ... let people on your network view ARM without signing in
```

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:docs/user/Setup-Walkthrough.md` lines 21-22 identical; `Getting-Started.md`, `FinishStep.svelte` identical.

**Suggested fix location.** feat/first-run-setup - drop the two doc sentences and the FinishStep guest clause (or restore the field; the owner's reuse memory allows either).

**Verification.** grep + read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/112

### D-111  S4  open  backend  origin #102

**Title.** Public `/api/setup/status` exposes the ARM version unauthenticated although the UI never reads it and `/api/system/version` is JWT-gated.

**Where.** `services/backend/arm_backend/routers/setup.py:116` and `packages/arm_common/arm_common/schemas/setup.py:14` at `a725180d` (introduced in 3bf6cad3 / 9f1c8512).

**What.** `SetupStatusPublic.arm_version` is returned to anonymous callers with no guest-access check, while the existing `GET /api/system/version` requires `require_jwt` (the login page uses that gating as its "guest enabled" probe). Nothing in `services/ui-neu/frontend/src` consumes `arm_version` (only a test fixture mentions it), so the field is both a dead wire field and a small information disclosure (exact version -> CVE lookup) on an endpoint that is reachable before sign-in by design.

**Repro / evidence.**

```
$ grep -rn arm_version services/ui-neu/frontend/src --include=*.svelte --include=*.ts | grep -v api.gen
services/ui-neu/frontend/src/routes/login/__tests__/login-page.test.ts:105: ... arm_version: '3.1.0' ...
$ curl -sk https://localhost:8081/api/setup/status   # {"first_run":true,"arm_version":"3.x"} with no Authorization header
```

**Tip check.** Still present at `71129cd9`: `routers/setup.py:116` `return SetupStatusPublic(first_run=first_run, arm_version=_app_version())` unchanged.

**Suggested fix location.** feat/first-run-setup - drop the field (regen OpenAPI snapshot + TS types) or move the version to the authenticated `SetupView`.

**Verification.** Code read; `test_status_is_public_and_first_run_when_not_completed` asserts the field is a str but no UI consumer exists.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/113

### D-112  S4  open  backend  origin #102

**Title.** After "Run setup again", resuming from `/setup` lands on the Finish step, not the first step.

**Where.** `services/backend/arm_backend/routers/setup.py:183` (`restart_setup` pops only `finish`) with `_current_step` at `:73-77`, and `services/ui-neu/frontend/src/lib/components/setup/SetupChecklistCard.svelte:43` (`goto('/setup')`) at `a725180d` (introduced in 3bf6cad3).

**What.** A completed walkthrough has every step recorded. `/restart` removes only `finish`, so `_current_step(progress)` returns `finish` and `GET /api/setup` reports `current_step: "finish"`. Settings' button side-steps this with `goto('/setup/system')`, but the dashboard checklist (visible again because `completed_at` is null) says "Resume setup" and navigates to `/setup`, whose loader redirects to `/setup/<current_step>` = the Finish page; so does any later return to `/setup`. The docs promise "walks through the steps again". Workaround: use the stepper.

**Repro / evidence.**

```
$ uv run python -c "from arm_backend.routers.setup import _current_step; from arm_common.enums import SETUP_STEP_ORDER
p={s.value:{'state':'done','at':None} for s in SETUP_STEP_ORDER}; p.pop('finish'); print(_current_step(p))"
finish
```

**Tip check.** Still present at `71129cd9`: `routers/setup.py:183` `progress.pop(SetupStep.FINISH.value, None)` and `_current_step` unchanged; `SetupChecklistCard.svelte:43` unchanged.

**Suggested fix location.** feat/first-run-setup - have `/restart` return/record a `current_step` of `system` (e.g. a `setup_resume_step` or clearing non-attention states), or have the checklist resume at `/setup/system` like Settings does.

**Verification.** Python one-liner above against the head router; UI path by code read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/114

### D-113  S4  open  ui-neu  origin #102

**Title.** nginx comment for the `/docs-data/` 404 rule now sits above the new `/arm-ca.crt` block.

**Where.** `services/ui-neu/nginx.conf:60-64` at `a725180d` (introduced in 9056efd7).

**What.** The CA-certificate `location = /arm-ca.crt` block was inserted between the pre-existing comment "In-app help bundle (built by the Dockerfile's docs stage). A missing file must be a real 404, not the SPA's index.html." and the `location /docs-data/` it describes, so the comment now reads as describing the CA block. Functionally the exact-match location does not disturb `/docs-data/` prefix matching (the ordering concern raised on #88 does not bite), and the CA file is mounted into `arm-ui` in both the installer (`install.sh:1415`) and the dev template (`docker-compose.yml.example:264`), so the route itself is fine.

**Repro / evidence.**

```
60:    # In-app help bundle (built by the Dockerfile's docs stage). A missing
61:    # file must be a real 404, not the SPA's index.html.
62:    # Public CA certificate for the setup walkthrough's "Download certificate"
65:    location = /arm-ca.crt {
74:    location /docs-data/ {
```

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:services/ui-neu/nginx.conf` lines 60/65/74 identical.

**Suggested fix location.** feat/first-run-setup - move the CA block (and its comment) above the help-bundle comment.

**Verification.** File read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/115

### D-114  S4  open  ripper  origin #102

**Title.** `backend_client.py` reads `ARM_DRIVE_ID` straight from `os.environ` instead of the ripper's `settings.ARM_DRIVE_ID` every other module uses.

**Where.** `services/ripper/arm_ripper/backend_client.py:192` and `:207` at `a725180d` (introduced in 820135d5 and 1ba9103d).

**What.** `arm_ripper/config.py` declares `ARM_DRIVE_ID: str` as a required pydantic setting and `main.py:62,81` / `iso_extract.py:72` read `settings.ARM_DRIVE_ID`. The two new call sites bypass it with `os.environ.get("ARM_DRIVE_ID")` (optional), so a misconfigured container would send no `drive_id` / `None` here while the rest of the ripper would already have failed on settings validation; the tests pin the env-var access (`monkeypatch.setenv/delenv`) rather than the settings object. Naming/pattern inconsistency only; behaviour is identical in the spawned container (`ripper_manager.py:119` sets the env).

**Repro / evidence.** `grep -rn "ARM_DRIVE_ID" services/ripper/arm_ripper/*.py` shows `settings.ARM_DRIVE_ID` in main.py/iso_extract.py and `os.environ.get` only in backend_client.py.

**Tip check.** Still present at `71129cd9`: `git show origin/integration/all-prs-3:services/ripper/arm_ripper/backend_client.py` lines 192 and 207 identical.

**Suggested fix location.** feat/first-run-setup.

**Verification.** Code read; `uv run pytest -k backend_client_drive` passes at head.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/116

### D-115  S4  open  common  origin #82

**Title.** `DiscFingerprintInput` docstring still calls matrix256 "ARM-native" (and omits `thediscdb`) although the PR body claims the schema comment was updated.

**Where.** `packages/arm_common/arm_common/schemas/ripper.py:74` at `132c5d23`.

**What.** The PR updates the model-side comment in `models/disc_fingerprint.py` to "matrix256v1 structural hash" and the PR body says "Model/schema comments updated"; the wire schema's canonical-algo list was not touched, so the two comments now disagree about the same algo, and the list still misses `thediscdb` which this PR's code emits alongside it. Docstring-only; no runtime effect (and no OpenAPI impact since the field description is not exported).

**Repro / evidence.** `git diff origin/main...origin/feat/matrix256-fingerprint -- packages/arm_common/arm_common/schemas/ripper.py` is empty; line 74 reads `` `musicbrainz` (CD disc id), `matrix256` (ARM-native). ``

**Tip check.** Still present at `71129cd9`: `packages/arm_common/arm_common/schemas/ripper.py:79` — same text.

**Suggested fix location.** feat/matrix256-fingerprint (#82) — same PR that made the claim.

**Verification.** Read the diff and the file at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/117

### D-116  S4  open  docs  origin #103

**Title.** `docs/ops/makemkv.md` "What the install scripts do" still says the script "Scrapes the current MakeMKV version" after this PR makes a pinned version the default.

**Where.** `docs/ops/makemkv.md:52` at `6980e18b`.

**What.** The PR edits two bullets of this file to describe the pin (lines 33-34) but leaves the install-script summary bullet at line 52 describing the pre-PR behaviour ("Scrapes the current MakeMKV version, fetches the GPG-signed sha256sums.txt..."). After this PR the script only scrapes when `MAKEMKV_VERSION` is empty; by default it builds the pinned release and also tries `download/old/`. Same-PR doc drift.

**Repro / evidence.** `git diff origin/main...origin/fix/pin-makemkv-1.18.4 -- docs/ops/makemkv.md` touches lines 33-34 only; line 52 unchanged: `... Scrapes the current MakeMKV version, fetches the GPG-signed \`sha256sums.txt\`, downloads ...`

**Tip check.** Still present at `71129cd9`: the file moved to `docs/user/MakeMKV-Ripper.md` (docs-site PR #88) and line 52 there carries the identical stale sentence; straggler `1dd9c932` ported only the two edited bullets.

**Suggested fix location.** fix/pin-makemkv-1.18.4 (#103) — same file, same PR; the port into `docs/user/MakeMKV-Ripper.md` on the tip needs the same one-line fix.

**Verification.** Read at head and tip.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/118

### D-117  S3  open  ci  origin: stack-level

**Title.** The integration tip carries 30 commits that are in no open PR; merging the 27 PRs does not reproduce the tested tip.

**Where.** `origin/integration/all-prs-3` at `71129cd9`; list in `docs/plans/DEFECT_REGISTER.md` § Tip-only commits (computed with `git patch-id` against every PR branch).

**What.** The tip was presented as the union of the stack plus two stragglers. After discounting 12 rebased copies of PR commits, it holds 30 non-merge commits whose content is in none of the 28 PR branches, including behavioural fixes the register's tip checks ran into: UDF-only Blu-ray reading via 7-Zip and the `7zip` package in the ripper image (`89a5cf53`, `2837d671` — D-rows for #98 and #101 depend on them), MakeMKV pin build args (`0fe90250`, `98e1fafc`), the log tailer moved off the event loop (`3137c881`), live transfer stats / rip progress (`7bfdc6b3`), backend coverage top-ups (`0048ca44`, `ccd66608`), the ws pre-auth disconnect log fix (`f627024d`), job-page navigation fixes, Playwright snapshot refreshes, five memory/docs commits, and most of PR #104's TV-episode UI (`74dceb16`, `a79a6f2d`, `9e604159`, `065d96d4`, `2568c406`, `53768751`, `6135379f`, `cea3e01e`, `71129cd9`). CI green on the tip therefore does not prove the stack green, and every defect the register marks "fixed only on the tip" reopens when the PRs merge.

**Repro / evidence.**

```
$ cd arm-v3 && for b in <all 28 PR branches>; do git rev-list --no-merges origin/main..origin/$b; done | sort -u | while read c; do git show $c | git patch-id --stable | cut -d' ' -f1; done | sort -u > pr-patchids.txt
$ git rev-list --no-merges origin/integration/all-prs-3 ^origin/<each PR branch> | while read c; do pid=$(git show $c | git patch-id --stable | cut -d' ' -f1); grep -q "^$pid$" pr-patchids.txt || echo $c; done   # 37, of which 12 are rebased copies (same subject + diffstat in a PR branch)
```

**Tip check.** Still present at `71129cd9` by construction. PR #104 (`feat/tv-episode-match-ui`, outside the review scope) is the natural home for the TV-episode group but its head is not an ancestor of the tip and it was not reviewed.

**Suggested fix location.** Open PRs for the tip-only commits grouped by theme: UDF/7-Zip (`89a5cf53`, `2837d671`) onto `feat/iso-source-rip`; MakeMKV build args onto `fix/pin-makemkv-1.18.4`; coverage top-ups onto `feat/phase3-session-routing`/`feat/iso-source-rip`; the TV-episode group via #104; the rest onto `feat/first-run-setup`. Or rebuild the integration branch strictly from the PR heads and re-run CI.

**Verification.** Verified with git patch-id as above (zero-infra).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/119

### D-118  S4  open  ci  origin: stack-level

**Title.** `wolfy/v3-improvments` (upstream only) carries 89 commits of v2-era UI/model work that exist nowhere in the stack; keep-or-kill decision needed.

**Where.** `shitwolfymakes/automatic-ripping-machine` branch `wolfy/v3-improvments` at `5895696d` (not present on `uprightbass360/arm-v3`); merge-base with `main` is `892a5f12` (2025-03-28, pre-cutover v2).

**What.** Not reviewed, by instruction. Inventory for the human decision: 254 commits beyond `main`, of which 89 are not patch-equivalent to anything in the tip (the other 165 landed in some form). Authors: Microtechno9000 (79), 1337-server (3), Mtech (2), github-actions version bumps (5); dated 2023-07-24 .. 2026-04-18. The 89 unique commits touch only pre-cutover v2 paths that no longer exist in the tree: `arm/ui` (378 file-changes), `arm/models` (71), `arm/ripper` (22), `arm/ui_config.py` (21), `docker-compose.yml` (16), `scripts/docker` (11), `arm_wiki/Status-Roadmap.md` (9), `Dockerfile-UI` (8), `requirements.txt`, `arm/config`, `test_ui/conftest.py`, `VERSION`, `devtools/armdevtools.py`, `arm/migrations`, `arm/common`. Subject-line mix: 48 feat, 33 fix, 20 test, 16 docs, 9 chore, 5 automated version bumps. The memory entry `project_backend_coverage_push.md` says the backend coverage push happened on this branch; that part is in the tip. Nothing on it applies to the v3 tree without a port.

**Repro / evidence.**

```
$ git fetch upstream wolfy/v3-improvments
$ git cherry origin/integration/all-prs-3 upstream/wolfy/v3-improvments | grep -c '^+'   # 89
$ git log --oneline --no-merges origin/main..upstream/wolfy/v3-improvments | wc -l         # 254
```

**Tip check.** Not applicable (branch is not part of the stack). Recorded so a human can decide keep-or-kill; recommendation: delete or archive as a tag — the unique commits are v2 code paths.

**Suggested fix location.** n/a — decision row.

**Verification.** Inventory only; no code review performed (by instruction).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/120

## Tip-only commits (in no open PR)

Computed at `71129cd9` by `git patch-id` against all 28 PR branches, then de-duplicated by subject + diffstat against rebased copies (12 tip commits turned out to be rebased copies of commits that ARE in #100/#101/#102/#103 — e.g. `5bd2fe9f`→#102, `62d5aa32`/`cd57ff36`/`222bf512`/`ac5a5ff4`/`13344e6d`→#101, `67f81e06`→#100, `0c92aecc`/`e7945cd4`/`f4375669`/`05ee8667`→#102, `1dd9c932`→#103). The 30 commits below have no counterpart in any open PR:

```
71129cd9 | chore(ui-neu): regenerate API types
53768751 | refactor(identify): use arm_common.disc_shape
6135379f | docs: Match Episodes tab, Movie/TV switch, tmdb_kind
2568c406 | fix(ui-neu): episode matching ends on job.identity_updated, not the first job event
74dceb16 | feat(ui-neu): Match Episodes tab and Movie/TV switch on the job page
a79a6f2d | feat(jobs): JobView.looks_episodic and has_series
9e604159 | feat(identify): the chosen TMDb hit carries its IMDb and TVDB ids
065d96d4 | fix(identify): a disc of same-length episodes searches TV first
2837d671 | fix(ripper): the UDF image reader runs 7zz when 7z is not installed
98c0f74c | docs(memory): never restart hifi-server's backend while a passthrough is filing
ccd66608 | test(backend): cover the ISO dump fallback's error branches; drop a dead try/except
3137c881 | fix(backend): the log tailer does its filesystem work off the event loop
7bfdc6b3 | feat: live transfer stats for full-disc copies, and live rip progress on the job page
c28a3938 | style(ui-neu): prettier-format the header theme button
f627024d | fix(ws): a client that disconnects before auth is a debug line, not a traceback
89a5cf53 | feat(ripper): read UDF-only images through 7-Zip for the BD title and matrix256
98e1fafc | build(ripper): resolve a pinned MakeMKV release from makemkv.com/download/old/
0fe90250 | build(ripper): MAKEMKV_VERSION build arg pins the MakeMKV release
5417c349 | fix(ui-neu): back-navigation affordances are real buttons
6da93d4c | style(backend): ruff format after the rip-start test merge
47899a84 | test(ui-neu): refresh setup and settings-metadata visual snapshots after the walkthrough polish
7e06b31f | docs(memory): dev-host validation tips from the 1 October run
fb7e7b48 | test(ui-neu): reset the mocked page id after the job-id navigation test
fe1b372e | fix(ui-neu): job page reloads when client-side navigation changes the job id
c6fa33b7 | fix(ui-neu): label the header theme toggle for screen readers and hover
b7afa298 | fix(devtools): seed-test-data writes per-job logs as the service user
3c9c5320 | test(ui-neu): refresh the Playwright visual suite for the current UI and add setup/settings specs
0048ca44 | test(backend): cover the remaining 45 uncovered statements
616fc059 | docs(memory): setup reuse rule, gap register, PEP 758, offload architecture, Vue removal
cea3e01e | fix(metadata): bound the TMDb external_ids lookup by the provider timeout
```

---

# Sweep 2 — fresh review of `main`

Date: 2026-10-13. Scope: a fresh as-built review of `main` at `2625b3e7` (all 27 stack PRs plus #104-#122 and the fix sweeps #259-#264 have merged), split into ten service slices reviewed by independent readers against the same rules as sweep 1. No tip check applies (main is the tip). Rows that re-find a CLOSED sweep-1 defect still present on main carry `Regression of D-xxx`. Defects already open upstream (D-118, D-122, D-124, D-126, D-128, D-130, D-131, D-135, D-136, D-137) are not re-recorded; re-confirmations are listed below.

Totals: 91 rows — severity S1 1, S2 4, S3 41, S4 45; status open 75, untested-needs-hardware 16; regressions of closed rows: 4.

Baseline on `main` @ `2625b3e7`: `uv run pytest` 3854 passed / 6 skipped; `ruff check` clean; `svelte-check` 0 errors; `vitest` 1996 passed; OpenAPI snapshot regen + TS codegen leave no diff.


## Slices

| Slice | Scope | Rows |
|---|---|---|
| B1 | backend job/session pipeline: routers/jobs, auto_session, transcode_apply, path_template, sessions, session_routes, naming, seeders | 9 |
| B2 | backend drives/ripper-facing routes, ripper_manager, drive_scanner, ISO rips/library/folders, setup, main/lifespan, config | 4 |
| B3 | backend transcode: dispatcher, passthrough executor, GPU probe runner, transcoder/transcodes/gpus/presets routers, encoders | 4 |
| B4 | backend identity + metadata: identity/*, metadata/*, routers/identity, metadata, images | 6 |
| B5 | backend auth/users/config/system/logs, notifications (apprise + bash hooks), WS hub | 9 |
| R1 | ripper service + transcode service + shared entrypoint | 9 |
| C1 | arm_common schemas/models/enums + Alembic chain 0001..0044 + OpenAPI snapshot and TS codegen | 12 |
| U1 | ui-neu routes (every page) + lib/api client layer | 16 |
| U2 | ui-neu lib/components, stores, utils, styles | 9 |
| D1 | installer rewrite (deploy/**, install.sh), compose templates, devtools, Dockerfiles, nginx, CI workflows, docs claims | 13 |

## Already-open rows re-confirmed on main

- D-122 (upstream #245) — seen by slice D1
- D-122 (upstream #245) — seen by slice B3
- D-124 (upstream #247) — seen by slice U1
- D-126 (upstream #249) — seen by slice D1
- D-128 (upstream #251) — seen by slice B3
- D-128 (upstream #251) — seen by slice R1
- D-130 (upstream #253) — seen by slice U2
- D-130 (upstream #253) — seen by slice B3
- D-130 (upstream #253) — seen by slice U1
- D-131 (upstream #254) — seen by slice R1
- D-135 (upstream #260) — seen by slice R1
- D-135 (upstream #260) — seen by slice B4
- D-136 (upstream #265) — seen by slice U1
- D-136 (upstream #265) — seen by slice U2
- D-137 (upstream #266) — seen by slice U1

## Summary

| ID | Issue | Sev | Status | Area | Slice | Regression of | Title |
|---|---|---|---|---|---|---|---|
| D-138 | [#136](https://github.com/uprightbass360/arm-v3/issues/136) | S1 | open | backend | B5 | — | `GET /api/config` returns the legacy `notification_apprise_urls` list verbatim (credentials embedded) to every JWT holder and to the anonymous guest, while the channel view redacts the very same URLs. |
| D-139 | [#137](https://github.com/uprightbass360/arm-v3/issues/137) | S2 | open | backend | B1 | — | Output-path templates are never contained to MEDIA_ROOT: `validate_template` accepts a leading `/` and `..`, `expand_template` strips a leading `/` only when an optional token drops, and every consumer joins `media_root / output_path` so an absolute template writes, previews and deletes outside the media root. |
| D-140 | [#138](https://github.com/uprightbass360/arm-v3/issues/138) | S3 | open | backend | B1 | — | The Blu-ray-backup (FOLDER) session guard only exists on the direct apply path; a FOLDER session parked pre-rip (apply on `awaiting_review`/`identified`, resolve fan-out, or redrain) fans out at rip-complete and files a title `.mkv` as an extension-less `Title (Year)` file. |
| D-141 | [#139](https://github.com/uprightbass360/arm-v3/issues/139) | S3 | open | backend | B1 | — | Pre-rip manual apply is not idempotent: two clicks park two `waiting_identify` rows for the same session, the second stays parked with `collisions` forever after rip-complete, nothing can cancel it, and the duplicate also breaks the auto-apply idempotency lookup (`scalar_one_or_none` -> `MultipleResultsFound`). |
| D-142 | [#140](https://github.com/uprightbass360/arm-v3/issues/140) | S3 | open | backend | B1 | D-081 | Residual D-081: an unidentified `ripped_partial` job with a parked application still rolls up as `state=transcoding tasks_total=0`, and the UI folds `ripped_partial` + transcoding into "Transcoding 0/0" with live polling while the job actually needs identification. |
| D-143 | [#141](https://github.com/uprightbass360/arm-v3/issues/141) | S3 | untested-needs-hardware | backend | B1 | — | `DELETE /api/jobs/{id}` and `DELETE /api/jobs` accept a `ripped` job whose transcode tasks are `in_progress`: the cascade deletes the task under the running transcoder, its `/complete`/`/fail` 404s, the GPU row stays BUSY with a NULL claim until the next backend restart, and `delete_raw=true` rmtrees the encoder's input mid-run. |
| D-144 | [#142](https://github.com/uprightbass360/arm-v3/issues/142) | S3 | open | backend | B1 | — | `DELETE /api/sessions/{id}` 500s for any session that has ever been applied to a job: `session_applications.session_id` is `ON DELETE RESTRICT` and the handler has no `IntegrityError` mapping. |
| D-145 | [#143](https://github.com/uprightbass360/arm-v3/issues/143) | S3 | open | backend | B1 | — | The lenient episode-token render expands the template segment by segment, so a segment made only of an optional token (`{year?}`) raises "output path is empty once optional tokens ... are dropped" for a bonus/extra title when the year is unknown, failing an apply that validates and that renders fine for the episode titles. |
| D-146 | [#144](https://github.com/uprightbass360/arm-v3/issues/144) | S4 | open | backend | B1 | — | Renaming a built-in session/preset is allowed and tested at the API, but the seeder re-syncs `name` on every boot, so the rename silently reverts at the next backend restart; two tests enshrine the contradiction. |
| D-147 | [#145](https://github.com/uprightbass360/arm-v3/issues/145) | S4 | open | backend | B1 | — | Four 4xx detail strings call `.value` on a status that `_StrEnumString` may have loaded as a raw `str`, turning the intended 409 into a 500; sibling handlers already use `enum_value_str` for this. |
| D-148 | [#146](https://github.com/uprightbass360/arm-v3/issues/146) | S3 | open | backend | B2 | — | `POST /api/ripper/jobs/{id}/recovery-abandon` never commits: the abandon is rolled back when the request session closes, so the ripper's reboot recovery announces `rip.abandoned` for a job that stays `awaiting_review`. |
| D-149 | [#147](https://github.com/uprightbass360/arm-v3/issues/147) | S4 | open | backend | B2 | — | System diagnostics' `drives` check and `/api/system/stats.drives_online` count every `status == online` row, and scanner-created DETECTED rows (plus virtual ISO rows) are `online` by server default, so "no online drives registered" never fires once a drive is merely plugged in. |
| D-150 | [#148](https://github.com/uprightbass360/arm-v3/issues/148) | S4 | open | backend | B2 | — | `/api/iso` resolves the ripper manager without the `host_paths_set()` gate `/api/drives` applies, so on a docker-but-no-`ARM_HOST_*_PATH` stack `POST /api/iso/rips` commits a virtual drive, fails inside docker, retires it and answers 500 instead of the 503 "ripper manager disabled" the drives router gives. |
| D-151 | [#149](https://github.com/uprightbass360/arm-v3/issues/149) | S4 | open | common | B2 | — | `DriveStatus.RIPPING` is a dead enum value: nothing in the backend or ripper ever writes it, and the drive diagnostic has no branch for it. |
| D-152 | [#150](https://github.com/uprightbass360/arm-v3/issues/150) | S3 | untested-needs-hardware | backend | B3 | — | Remote docker-over-SSH: an idle transport death is swallowed by the spawn-gating probe ("docker host unreachable") before `_spawn_container` runs, so the transport-rebuild path never fires and encode spawns stay held until the backend restarts. |
| D-153 | [#151](https://github.com/uprightbass360/arm-v3/issues/151) | S3 | untested-needs-hardware | backend | B3 | — | Stale-claim sweep assumes the transcoder is dead: a backend outage longer than `ARM_TRANSCODE_STALE_THRESHOLD_SECONDS` (90 s) re-queues a task whose container is still encoding, releases its GPU mid-encode, and the re-spawn collides on the fixed container name until the task is terminally FAILED two ticks later. |
| D-154 | [#152](https://github.com/uprightbass360/arm-v3/issues/152) | S3 | open | backend | B3 | — | `PATCH /api/transcode-presets/{id}` with an explicit `"tool": null` or `"container": null` (both nullable in the OpenAPI schema) returns 500 instead of 422. |
| D-155 | [#153](https://github.com/uprightbass360/arm-v3/issues/153) | S3 | open | backend | B3 | — | `POST /api/transcodes/{id}/retry` re-queues the task but leaves its session application terminal (FAILED/DONE_PARTIAL, `completed_at` set), so the job's transcode summary reads "done" (0/1) while the retried encode is queued or running. |
| D-156 | [#154](https://github.com/uprightbass360/arm-v3/issues/154) | S3 | open | backend | B4 | — | A 200 response with a non-JSON body from OMDb, 1337server or MusicBrainz escapes the dispatcher as `JSONDecodeError`, so identify returns 500 and the ripper retries it forever instead of falling through to the next provider / `block_on_miss`. |
| D-157 | [#155](https://github.com/uprightbass360/arm-v3/issues/155) | S3 | open | backend | B4 | — | `_normalize_volume_label` takes the first 4-digit run anywhere in the label as the release year, so titles that contain a year (`BLADE_RUNNER_2049`, `WONDER_WOMAN_1984`, `2001_A_SPACE_ODYSSEY`, `1917`) are searched with a wrong year filter and never retried without it; the fallback then lands on TMDb's TV search. |
| D-158 | [#156](https://github.com/uprightbass360/arm-v3/issues/156) | S3 | open | backend | B4 | — | The `metadata_provider` setting ("Look up titles with — the service ARM searches when it identifies a disc") is never read by the identify pipeline: with both keys set and OMDb selected, every disc is still identified by TMDb first. |
| D-159 | [#157](https://github.com/uprightbass360/arm-v3/issues/157) | S3 | open | backend | B4 | — | Two overlapping TheDiscDB refreshes (the daily loop and `POST /api/system/thediscdb/refresh`, or two clicks) share the same `index.sqlite.new` path, so one build fails with `disk I/O error` and, depending on timing, a partial index can be moved live. |
| D-160 | [#158](https://github.com/uprightbass360/arm-v3/issues/158) | S3 | open | backend | B4 | — | The unauthenticated image proxy's negative cache is an unbounded module-level dict that is never pruned, so any anonymous client can grow backend memory one entry per distinct allowlisted-host URL. |
| D-161 | [#159](https://github.com/uprightbass360/arm-v3/issues/159) | S4 | open | backend | B4 | D-094 | Operator-supplied external ids are still interpolated unescaped into provider URL paths at every site except the two D-094 anchored. |
| D-162 | [#160](https://github.com/uprightbass360/arm-v3/issues/160) | S2 | open | backend | B5 | — | The WS Origin gate is skipped whenever the client merely *requests* the `arm-service-token` subprotocol, which any browser page can do, so a cross-origin page bypasses the only cross-site protection the WS endpoint has. |
| D-163 | [#161](https://github.com/uprightbass360/arm-v3/issues/161) | S3 | open | backend | B5 | — | WS handshake verifies only the JWT signature: a disabled user, a deleted user, or an admin still under `password_must_change` can open `/ws` and subscribe to every UI topic. |
| D-164 | [#162](https://github.com/uprightbass360/arm-v3/issues/162) | S3 | open | backend | B5 | — | `PATCH /api/config` with `null` for any NOT NULL boolean setting still ends in an unhandled IntegrityError (HTTP 500); the D-096 fix covered the int fields only. |
| D-165 | [#163](https://github.com/uprightbass360/arm-v3/issues/163) | S3 | untested-needs-hardware | backend | B5 | — | `GET /api/logs/{job_id}.zip` is an `async def` that reads up to 5 MB per log file with blocking file I/O on the event loop; on the network-share `/logs` the project itself plans for, one download stalls every REST/WS consumer in the backend. |
| D-166 | [#164](https://github.com/uprightbass360/arm-v3/issues/164) | S4 | open | backend | B5 | — | `GET /api/logs/{job_id}?limit=0` is accepted (`ge=0`) but returns one line, because the cap is checked only after a line has been yielded. |
| D-167 | [#165](https://github.com/uprightbass360/arm-v3/issues/165) | S4 | open | backend | B5 | — | After auth, a non-JSON (or binary) WS frame escapes `_serve_loop` as an unhandled `JSONDecodeError`/`KeyError`, so the connection dies with a server traceback and 1011 instead of the `{"op":"error",...}` frame the pre-auth path sends for the same input. |
| D-168 | [#166](https://github.com/uprightbass360/arm-v3/issues/166) | S4 | open | backend | B5 | — | The notification dispatcher, `/api/system/stats` and the inbox endpoints load whole tables into Python and filter there, explicitly to suit the in-memory `FakeSession`; the dispatcher does it every 5 s against an events table nothing ever prunes. |
| D-169 | [#167](https://github.com/uprightbass360/arm-v3/issues/167) | S4 | open | docs | B5 | — | `05-cross-cutting.md` describes an authentication model the code does not implement: argon2 parameters, "random generated password", a config-redacting logging helper, and claim-checked transcoder subscriptions. |
| D-170 | [#168](https://github.com/uprightbass360/arm-v3/issues/168) | S2 | untested-needs-hardware | ripper | R1 | — | `pickup` / `resume_inflight_job` / `recover_held_job` claim the caller's long-lived task as `_active_task`: a re-acquired rip runs inside the heartbeat loop (no heartbeats for hours) and `job.abandoned` cancels the heartbeat loop (or `amain`/`poll_loop`) for good. |
| D-171 | [#169](https://github.com/uprightbass360/arm-v3/issues/169) | S2 | untested-needs-hardware | ripper | R1 | — | `_tNN.mkv` files are paired with eligible titles by list position, so one title that produces no file shifts every later title onto the wrong file (track A credited with title B's mkv, B marked FAILED). |
| D-172 | [#170](https://github.com/uprightbass360/arm-v3/issues/170) | S3 | open | ripper | R1 | — | `_run_makemkvcon` cancels the streamer in `finally` before the "drain" await, so robot lines still in the pipe at exit are dropped: MSG:5003 per-title fail reasons and MSG:1002/5037 diagnostics go missing from the error text. |
| D-173 | [#171](https://github.com/uprightbass360/arm-v3/issues/171) | S3 | untested-needs-hardware | transcode | R1 | — | WS `task.cancel` never stops the encoder: `CancelRequested` raised from the progress callback is swallowed by the engines' `except Exception`, so every cancel falls through to the backend's 10 s grace + docker-stop and the "cancelled by user" `/fail` is never sent. |
| D-174 | [#172](https://github.com/uprightbass360/arm-v3/issues/172) | S3 | untested-needs-hardware | ripper | R1 | — | `rip_cd` kills only the `abcde` shell script on abandon/timeout; its `cdparanoia`/`flac` children keep reading the drive and writing into the (already rmtree'd) raw dir. |
| D-175 | [#173](https://github.com/uprightbass360/arm-v3/issues/173) | S4 | untested-needs-hardware | ripper | R1 | — | Multi-GB raw-dir `shutil.rmtree` runs synchronously on the event loop in the WS abandon handler, the boot probe and the backup rip (same class as closed D-108, which fixed only `_scan_extracted`). |
| D-176 | [#174](https://github.com/uprightbass360/arm-v3/issues/174) | S4 | open | docs | R1 | — | Protocol doc says there is no ripper heartbeat and no timeout-based liveness, while the ripper posts `/api/ripper/heartbeat` every 30 s and the backend derives ONLINE/OFFLINE and "stale" notes from it. |
| D-177 | [#175](https://github.com/uprightbass360/arm-v3/issues/175) | S4 | open | ripper | R1 | — | makemkvcon and dd failure excerpts keep the first 400 chars of stderr, not the tail, unlike every other engine (and the transcoder's own `_clip_error` rationale). |
| D-178 | [#176](https://github.com/uprightbass360/arm-v3/issues/176) | S4 | open | transcode | R1 | — | `ffmpeg_audio.py` comment points at a module that does not exist (`ffmpeg_video.py`). |
| D-179 | [#177](https://github.com/uprightbass360/arm-v3/issues/177) | S3 | untested-needs-hardware | common | C1 | — | `atomic_output` never fsyncs the output and fsyncs the directory *before* the rename, so the documented "write, fsync, rename" durability does not exist. |
| D-180 | [#178](https://github.com/uprightbass360/arm-v3/issues/178) | S3 | open | migrations | C1 | — | `jobs.metadata_json` and `drives.rip_params_json` are JSONB in the database but `JSON` in the models; 0031's comment states the opposite of what 0001 created. |
| D-181 | [#179](https://github.com/uprightbass360/arm-v3/issues/179) | S3 | untested-needs-hardware | common | C1 | — | `IdentificationMode` is written by the rip-preset API and seeders but read by nothing; the UI offers "Deferred placeholder" (and Required/Skip) as a rip-preset setting that has no effect. |
| D-182 | [#180](https://github.com/uprightbass360/arm-v3/issues/180) | S3 | open | common | C1 | — | `move_tree` (DISC_BACKUP passthrough) copies straight into the final folder with no staging: a copy error or a backend crash mid-copy leaves a partial `/media/<Title>` tree, and the helper's own `dst.exists()` guard then refuses every retry. |
| D-183 | [#181](https://github.com/uprightbass360/arm-v3/issues/181) | S4 | open | common | C1 | — | The OpenAPI wire contract declares no `securitySchemes` and no `security` on any operation, so the snapshot/TS types describe every endpoint (including `/api/ripper/*`, `/api/transcoder/*`, config, users) as unauthenticated. |
| D-184 | [#182](https://github.com/uprightbass360/arm-v3/issues/182) | S4 | open | common | C1 | — | `CONFIG_FIELD_META` hard-codes the member lists of `PreviouslyRippedAction` and the `metadata_provider` set with no guard that they track the enums. |
| D-185 | [#183](https://github.com/uprightbass360/arm-v3/issues/183) | S4 | untested-needs-hardware | migrations | C1 | — | `disc_fingerprints.created_at` is nullable with no default in the schema, NOT NULL `now()` in the model, so every fingerprint row on Postgres has `created_at = NULL`. |
| D-186 | [#184](https://github.com/uprightbass360/arm-v3/issues/184) | S4 | open | migrations | C1 | — | Index inventory drifts between the live schema and the models: three DB-only indexes, one model-only index, and the `uq_transcode_tasks_output_path_live` partial unique index exists only in 0001, so the e2e harness never enforces it. |
| D-187 | [#185](https://github.com/uprightbass360/arm-v3/issues/185) | S4 | open | common | C1 | — | "Enums are validated at write time in the SQLModel/Pydantic layer" is claimed in three places but nothing validates: `_StrEnumString.process_bind_param` stringifies any value and SQLModel table models skip validation. |
| D-188 | [#186](https://github.com/uprightbass360/arm-v3/issues/186) | S4 | open | common | C1 | — | `_StrEnumString` sets `cache_ok = True` without exposing `enum_cls` to the cache key, so every enum column type shares one SQL-compilation cache key. |
| D-189 | [#187](https://github.com/uprightbass360/arm-v3/issues/187) | S4 | open | migrations | C1 | — | Offline rendering (`alembic upgrade --sql`, the mode `env.py` and the migration tests use) crashes in 0032/0033 with `TypeError: 'NoneType' object is not iterable`; the chain test's comment says only 0011 blocks a full-range render. |
| D-190 | [#188](https://github.com/uprightbass360/arm-v3/issues/188) | S4 | open | backend | C1 | — | Backend statement coverage is 99% (32 missed statements in 9 files) against the documented 100%-statement policy; PR #110 brought it to 100% and the later fix sweeps regressed it. |
| D-191 | [#189](https://github.com/uprightbass360/arm-v3/issues/189) | S3 | open | ui-neu | U1 | — | A wrong "current password" on /change-password (and Settings > Users, setup step 1) logs the operator out and bounces to /login; the API client treats every 401 as session expiry and discards the backend detail. |
| D-192 | [#190](https://github.com/uprightbass360/arm-v3/issues/190) | S3 | open | ui-neu | U1 | — | Job detail "redirect to dashboard on 404" never fires: it string-matches `'404'` in a message the API client has replaced with the backend `detail` ("unknown job_id: ..."); both tests pass only because they throw their own `new Error('404 Not Found')`. |
| D-193 | [#191](https://github.com/uprightbass360/arm-v3/issues/191) | S3 | open | ui-neu | U1 | — | Notifications "Show dismissed" shows nothing after a reload: dismiss sets `cleared=true`, the inbox list omits cleared rows by default and the UI never asks for them. |
| D-194 | [#192](https://github.com/uprightbass360/arm-v3/issues/192) | S3 | untested-needs-hardware | ui-neu | U1 | — | Transcoder page task list goes stale when the last in-progress task finishes: the jobs poll is stopped by the stats tick without a final reload, and WS events only reload the GPU rows. |
| D-195 | [#193](https://github.com/uprightbass360/arm-v3/issues/193) | S3 | open | ui-neu | U1 | — | Transcoder Retry/Delete swallow failures: no try/catch, and the `actionFeedback` banner state is declared but never set. |
| D-196 | [#194](https://github.com/uprightbass360/arm-v3/issues/194) | S3 | open | ui-neu | U1 | — | Per-drive prescan/enumeration settings are dead: Settings feeds DriveCard hard-coded "global defaults" (1 / 300 / 3 / 60) from `arm_config.PRESCAN_*` keys that never exist in the v3 ConfigView, and no ripper or backend code reads `prescan_cache_mb` / `prescan_timeout` / `prescan_retries` / `disc_enum_timeout`. |
| D-197 | [#195](https://github.com/uprightbass360/arm-v3/issues/195) | S3 | open | ui-neu | U1 | — | `dashboard-page.test.ts` "Dashboard job grouping logic" tests a private re-implementation of the grouping, not the page, and that copy disagrees with the page (`identified` is a review card on the page, "finishing" in the test). |
| D-198 | [#196](https://github.com/uprightbass360/arm-v3/issues/196) | S4 | open | ui-neu | U1 | — | Three destructive actions still use the native `confirm()` dialog where the shared `ConfirmDialog` exists (same pattern as closed D-026, different sites). |
| D-199 | [#197](https://github.com/uprightbass360/arm-v3/issues/197) | S4 | open | ui-neu | U1 | — | One-off markup where shared components exist: `&times;` close buttons instead of `CloseButton`, and inline SVGs whose paths are byte-identical to `Glyph` entries (chevron-right, lock, refresh, gear, sun, moon). |
| D-200 | [#198](https://github.com/uprightbass360/arm-v3/issues/198) | S4 | open | ui-neu | U1 | — | Settings > Themes renders `themeFeedback` twice (once at the top of the section, again inside the User Themes panel) whenever a user theme exists. |
| D-201 | [#199](https://github.com/uprightbass360/arm-v3/issues/199) | S4 | open | ui-neu | U1 | — | Settings starts a 10 s `/api/drives` poller for every tab (not just Drives) on top of the layout's 5 s dashboard fan-out that already fetches `/api/drives`, and POSTs `/api/drives/rescan` on every visit. |
| D-202 | [#200](https://github.com/uprightbass360/arm-v3/issues/200) | S4 | open | ui-neu | U1 | — | Transcoder card "Took Xh Ym" is `updated_at - created_at`, so queue wait counts as encode time (sibling of open D-130 on another surface); the task view carries no claimed/started timestamp to compute it correctly. |
| D-203 | [#201](https://github.com/uprightbass360/arm-v3/issues/201) | S4 | open | ui-neu | U1 | — | Job detail track Title cell is a clickable `<td onclick>` with no role, tabindex or key handler: the inline title editor is mouse-only and invisible to assistive tech. |
| D-204 | [#202](https://github.com/uprightbass360/arm-v3/issues/202) | S4 | open | ui-neu | U1 | — | Two write actions surface no error: excluding a track (`toggleExcluded`) re-throws into the void and "Run setup again" has no catch. |
| D-205 | [#203](https://github.com/uprightbass360/arm-v3/issues/203) | S4 | open | ui-neu | U1 | — | `fetchDashboard` throws away `TranscodeStatsView`, so the header's "N queued" badge and the `worker_running` branch of the Transcode health dot are dead code. |
| D-206 | [#204](https://github.com/uprightbass360/arm-v3/issues/204) | S4 | open | ui-neu | U1 | — | Em-dash and unicode-symbol glyphs in UI copy via HTML entities (`&mdash;`, `&middot;`, `&rarr;`, `&rsaquo;`, `&times;`), which the `[^\x00-\x7F]` pre-commit grep cannot see. |
| D-207 | [#205](https://github.com/uprightbass360/arm-v3/issues/205) | S3 | open | ui-neu | U2 | — | ApplySessionDialog's session filter disagrees with the backend compatibility rule: it offers TV sessions to CD and data jobs (backend 422s) and hides ISO/data sessions the backend accepts for video jobs; the test pins the wrong filter. |
| D-208 | [#206](https://github.com/uprightbass360/arm-v3/issues/206) | S3 | untested-needs-hardware | ui-neu | U2 | — | DriveCard "Start rip" is enabled in every drive state: while the drive is already ripping (backend 409), while the tray is reported empty/open (backend 400) and on a detached drive (backend 202, nothing ever starts, no feedback). |
| D-209 | [#207](https://github.com/uprightbass360/arm-v3/issues/207) | S4 | open | ui-neu | U2 | — | JobActions still uses the native `confirm()` for Abandon and Delete where the shared `ConfirmDialog` exists (same class as closed D-026 / U1 C10, different sites); its test stubs `confirm` globally. |
| D-210 | [#208](https://github.com/uprightbass360/arm-v3/issues/208) | S4 | open | ui-neu | U2 | — | Banned copy characters (em-dash, `·`, `…`, `▾`, `›`, `○`, gear/triangle numeric entities, `&middot;`, `&rarr;`, `&times;`) rendered from components, stores and utils; the pre-commit config has no non-ASCII/entity check so the memory rule is unenforced. |
| D-211 | [#209](https://github.com/uprightbass360/arm-v3/issues/209) | S4 | open | ui-neu | U2 | — | Shared-component violations inside components: 15 inline SVGs byte-identical to `Glyph` paths, three notifications components importing lucide `ChevronRight` where `Glyph chevron-right` exists, a pause icon implemented twice (inline SVG and lucide), and a `&times;` close button where `CloseButton` exists. |
| D-212 | [#210](https://github.com/uprightbass360/arm-v3/issues/210) | S4 | open | ui-neu | U2 | — | MakemkvKeyField runs its own 5 s poller of `/api/config` and `/api/drives` for as long as Settings > Metadata or the setup MakeMKV step is mounted, duplicating the layout's dashboard poll of the same two endpoints (sibling of open D-136 / U1 C13). |
| D-213 | [#211](https://github.com/uprightbass360/arm-v3/issues/211) | S4 | open | ui-neu | U2 | — | ARIA attributes on role-less elements and mouse-only interactive cells (sibling of closed D-049 and U1 C15, different sites). |
| D-214 | [#212](https://github.com/uprightbass360/arm-v3/issues/212) | S4 | open | ui-neu | U2 | — | Review card offers "Start rip" ("Save the metadata and start ripping this disc") on a `ripped_awaiting_identify` placeholder whose disc is already ripped; the action only resolves identity (promotes to `ripped`), no rip starts, and the status bar reads "Awaiting Review". |
| D-215 | [#213](https://github.com/uprightbass360/arm-v3/issues/213) | S4 | open | ui-neu | U2 | — | `colorScheme.ts` built-in schemes still carry the removed legacy alias tokens (`--color-primary-dark`, `--color-primary-light-bg`, `--color-primary-border`, and the `-dark` twins) and `applyTokens` writes them onto `<html>` "for components that still use `dark:bg-surface-dark`"; no component or stylesheet reads them any more (sibling of closed D-047). |
| D-216 | [#214](https://github.com/uprightbass360/arm-v3/issues/214) | S3 | untested-needs-hardware | devtools | D1 | — | Leaf TLS keys are group-owned by the installer's gid, not `.env`'s `PGID`; the documented "edit PUID/PGID to match your media server" leaves the backend unable to read `tls.key`. |
| D-217 | [#215](https://github.com/uprightbass360/arm-v3/issues/215) | S3 | untested-needs-hardware | devtools | D1 | — | The UI leaf certificate has no LAN-IP SAN, so trusting `arm-ca.crt` does not silence the warning for the `https://<host-ip>:8081` access path the docs advertise. |
| D-218 | [#216](https://github.com/uprightbass360/arm-v3/issues/216) | S3 | open | docs | D1 | — | `MAKEMKV_KEY` in `~/arm/.armctl/.env` is documented as a working key source in three places, but no container ever receives it. |
| D-219 | [#217](https://github.com/uprightbass360/arm-v3/issues/217) | S3 | open | ci | D1 | — | `publish-wiki.yml` syncs `docs/user` to the live GitHub wiki on every `pull_request_review`, i.e. from the PR's unmerged merge commit; its one action is pinned with `# main`, and the `gollum` trigger is dead. |
| D-220 | [#218](https://github.com/uprightbass360/arm-v3/issues/218) | S3 | open | devtools | D1 | — | `setup-dev.sh` creates `arm/iso-library/` and the template mounts it at `/ingress`, but `.env` never gets `ARM_HOST_ISO_LIBRARY_PATH`, so a dev stack reports "Rip from ISO" as not configured (dev sibling of D-119). |
| D-221 | [#219](https://github.com/uprightbass360/arm-v3/issues/219) | S3 | open | ci | D1 | — | `weekly-rebuild.yml` refreshes `arm-transcode:<tag>` but not the `:<tag>-nvidia` alias `release.yml` published; the two tags documented as "the same image" diverge after the first weekly run. |
| D-222 | [#220](https://github.com/uprightbass360/arm-v3/issues/220) | S4 | open | docs | D1 | — | Hardware-Transcoding says NVIDIA needs "driver >= 418.81" while the installer skips NVENC entirely below driver 530. |
| D-223 | [#221](https://github.com/uprightbass360/arm-v3/issues/221) | S4 | open | docs | D1 | — | Three user pages link to `README.md#local-development`, a heading the README does not have. |
| D-224 | [#222](https://github.com/uprightbass360/arm-v3/issues/222) | S4 | open | devtools | D1 | — | Stale descriptions of removed behaviour: devtools/README.md says iso-smoke "borrows an enrolled drive"; the compose template says "install.sh adds that volume automatically"; `.env.example` says armctl writes `./ssh`. |
| D-225 | [#223](https://github.com/uprightbass360/arm-v3/issues/223) | S4 | open | ci | D1 | — | `stale.yml` runs with no `permissions:` block, and CI builds/tests the UI on Node 24 while `.nvmrc`, the ui-neu Dockerfile and `setup-dev.sh` require Node 26. |
| D-226 | [#224](https://github.com/uprightbass360/arm-v3/issues/224) | S4 | open | docs | D1 | D-019 | User docs still describe the per-drive `armv3-ripper-srN` compose model: container names, "devices passed in / paired by the scanner", a per-drive `ID_PATH` udev rule, and `docker compose exec ripper`. |
| D-227 | [#225](https://github.com/uprightbass360/arm-v3/issues/225) | S4 | open | docs | D1 | D-056 | Bare `docker compose up -d` is still the instruction in eight developer-facing places, contrary to CLAUDE.md / CONTRIBUTING.md ("never a bare docker compose"). |
| D-228 | [#226](https://github.com/uprightbass360/arm-v3/issues/226) | S4 | open | docs | D1 | — | Deployment docs describe the optical-access and first-boot mechanisms the code does not use: `group_add`, `CDROM_GID` via `stat -c %g /dev/sr0`, compose `devices:`, and a "random" first-boot admin password. |

## Detail

### D-138  S1  open  backend  slice B5

**Title.** `GET /api/config` returns the legacy `notification_apprise_urls` list verbatim (credentials embedded) to every JWT holder and to the anonymous guest, while the channel view redacts the very same URLs.

**Where.** `services/backend/arm_backend/routers/config.py:110` at `2625b3e7` (`notification_apprise_urls=list(cfg.notification_apprise_urls or [])`), `:64` (`_SECRET_KEYS` is derived from registry secret-tier keys, and the field is deliberately unregistered, `arm_common/config_metadata.py:315-317`), `:126-134` (`get_config` is `require_jwt`, so guests read it). Compare `services/backend/arm_backend/notifications/field_map.py:683-688` ("url-only config (e.g. migration-imported): the url IS the secret" -> redacted). Migration `services/backend/migrations/versions/0015_notification_channels.py:95-115` copies the list into channels and never clears the column.

**What.** Apprise URLs carry the destination's credential (Discord webhook token, SMTP password, Pushover key). Any deployment that saved URLs before migration 0015 still has them in `config.notification_apprise_urls`; 0015 copied them into `notification_channels` (where reads are redacted) but left the originals, and `_to_view` ships them in clear on `GET /api/config`, which is `require_jwt` and therefore readable by the anonymous guest when guest access is on. `ConfigUpdateRequest` no longer accepts the field, so an operator cannot even blank it through the API. The reviewer rated this S2 because only installs predating 0015 are populated; the coordinator raised it to S1 because it is a plain credential disclosure on a guest-readable route (the brief's S1 definition names secret leakage), independent of how many installs carry data. The router docstring (`config.py:3-4`) only promises the URLs never appear in logs.

**Repro / evidence.** Code hunk `config.py:110` + `:120-122` (masking loop covers `tmdb_api_key, omdb_api_key, tvdb_api_key, makemkv_key` only; `notification_apprise_urls` is not in `_SECRET_KEYS` because `config_metadata.py` has no entry for it). `services/backend/tests/test_config_apprise_validation.py:1-9` documents the field as "readable on GET" by design.

**Suggested fix location.** `services/backend/arm_backend/routers/config.py::_to_view` — return `[redact_apprise_url(u) for u in ...]` (helper already exists in `notifications/url_composer.py`) or drop the field from `ConfigView` (OpenAPI regen); optionally a migration that empties the column now that 0015's import is long applied.

**Verification.** code read; masking set confirmed by `uv run python -c "from arm_backend.routers.config import _SECRET_KEYS; print(_SECRET_KEYS)"` -> `{tmdb_api_key, omdb_api_key, tvdb_api_key, makemkv_key}`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/136

### D-139  S2  open  backend  slice B1

**Title.** Output-path templates are never contained to MEDIA_ROOT: `validate_template` accepts a leading `/` and `..`, `expand_template` strips a leading `/` only when an optional token drops, and every consumer joins `media_root / output_path` so an absolute template writes, previews and deletes outside the media root.

**Where.** `services/backend/arm_backend/path_template.py:161-185` (no `/` or `..` check), `:126-130` (collapse only when `dropped`), `services/backend/arm_backend/transcode_apply.py:243,302`, `services/backend/arm_backend/routers/jobs.py:474,715,810` (`path.unlink()` with no `is_within`; only the folder branch at :789 checks), `services/transcode/arm_transcode/main.py:221,247`, `services/backend/arm_backend/passthrough_executor.py:222` at `2625b3e7`.

**What.** `POST /api/sessions` with `output_path_template="/{title} ({year?})/{title}.{ext}"` is accepted (synthetic expansion `/Iron Man (2008)/Iron Man.mkv` is non-empty) and `/api/sessions/preview` shows it as fine. At apply time `Path(media_root) / "/Iron Man (2008)/..."` is the absolute path, so the transcoder writes outside `/media` and then `final_output.relative_to(media_root)` (main.py:247) raises `ValueError` after the file is written, outside the try, so the task is neither completed nor failed and sits until the stale-claim sweep. The same job with no year yields `Iron Man/Iron Man.mkv` (relative, inside the root) because the optional-token collapse drops the empty leading segment, so one template roots its output in two different places depending on disc data. `_delete_job_files` later `unlink`s whatever absolute `output_path` a DONE task recorded without a containment check (folders are checked, files are not). Templates are admin-authored, hence S2 rather than S1; but the validator, preview and `/api/naming/validate` all accept it and `fileops.safe_join` exists for exactly this.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B1/tpl.py
validate '/{title}.{ext}' -> '/Iron Man.mkv'
validate '../{title}.{ext}' -> '../Iron Man.mkv'
validate '/etc/{title}.{ext}' -> '/etc/Iron Man.mkv'
validate '{title}/../../{title}.{ext}' -> 'Iron Man/../../Iron Man.mkv'
year present: '/Iron Man (2008)/Iron Man.mkv'      joined (present): /Iron Man (2008)/Iron Man.mkv
year empty:   'Iron Man/Iron Man.mkv'              joined (empty):   /media/Iron Man/Iron Man.mkv
```

**Suggested fix location.** `path_template.validate_template` (reject a template whose synthetic expansion starts with `/` or has a `..` segment, and normalise `expand_template` so the collapse is not data-dependent) plus `safe_join(media_root, output_path)` at the three join sites (`compute_outputs`/`find_collisions`, `_delete_job_files`, transcoder/passthrough).

**Verification.** Scratch script above (real `path_template`/`compute_outputs` code); transcoder join read at main.py:221,247; not run against the stack (would need `devtools/iso-smoke.sh` with a `/`-prefixed clone template).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/137

### D-140  S3  open  backend  slice B1

**Title.** The Blu-ray-backup (FOLDER) session guard only exists on the direct apply path; a FOLDER session parked pre-rip (apply on `awaiting_review`/`identified`, resolve fan-out, or redrain) fans out at rip-complete and files a title `.mkv` as an extension-less `Title (Year)` file.

**Where.** `services/backend/arm_backend/auto_session.py:352-374` (guard in `_apply_session_internal` only) vs `:687-852` (`fan_out_waiting_identify_applications` -> `_fan_out_tasks_for_application` at `:429-659`, no FOLDER/backup-track check) at `2625b3e7`.

**What.** Pre-rip, `_apply_session_internal` skips the guard ("Only once ripped") and parks the application as `no_tracks`. The rip then runs with the ROUTED preset (title-based for a DVD or a non-backup Blu-ray route), and `drain_parked_applications_after_rip` promotes the parked row through `_fan_out_tasks_for_application`, which has no backup-track check: `compute_outputs` matches `VIDEO_TITLE` tracks for the ISO-typed session and renders `{title} ({year?})` as the task's `output_path`. One title -> a passthrough task that `transcode_none`s `title_t01.mkv` to `media/Iron Man (2008)` (a file, no extension, exactly what the guard's comment says it prevents). Two or more titles -> `duplicate_in_request` collision, parked forever. The manual post-rip apply of the same session on the same job correctly 422s.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B1/folder_drain.py   # FakeSession, RIPPED DVD job, one VIDEO_TITLE track
manual post-rip apply -> media_mismatch | the Blu-ray decrypted backup session files a disc backup; this job has no backup track
drain -> queued skipped_reason= None tasks= [('trk_1', 'Iron Man (2008)')]
```

**Suggested fix location.** `auto_session._fan_out_tasks_for_application` (move the FOLDER/no-backup-track check there, next to the media-mismatch gate, so apply, resolve fan-out and redrain share it) - the check needs `rip_preset`, so load it in `fan_out_waiting_identify_applications` like `transcode_preset`.

**Verification.** Scratch FakeSession script above against the real `auto_session` code.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/138

### D-141  S3  open  backend  slice B1

**Title.** Pre-rip manual apply is not idempotent: two clicks park two `waiting_identify` rows for the same session, the second stays parked with `collisions` forever after rip-complete, nothing can cancel it, and the duplicate also breaks the auto-apply idempotency lookup (`scalar_one_or_none` -> `MultipleResultsFound`).

**Where.** `services/backend/arm_backend/auto_session.py:312-329` and `:510-527` (new `SessionApplication` per call, no existing-row check for `source="manual"`), `:229-235` (`scalar_one_or_none()` on `(session_id, job_id)`), `services/backend/arm_backend/routers/jobs.py:196-201` (`parked_session_ids`) at `2625b3e7`; no router exposes a cancel/delete for a `SessionApplication` (grep `session_applications?/\{` in `routers/` -> none).

**What.** Post-rip, a second apply of the same session gets 409 `collisions` (visible, correct). Pre-rip (`identified`, `awaiting_review`, `awaiting_user_id`, `ripped_awaiting_identify`) every click returns 200 and inserts another parked row. At rip-complete the drain promotes the first and parks the second with `collisions` (same job's own task). `_parked_apps_are_settled` hides it from the progress rollup, but `parked_session_ids` keeps listing the session as "waiting" on a job that is transcoding/complete, with no way to clear it short of deleting the job. If the drive default or `pending_session_id` names the same session and the drain's outcomes are all skips, `maybe_auto_apply_session`'s `scalar_one_or_none()` raises `MultipleResultsFound`, swallowed by the blanket `except Exception` as "auto-apply unexpected error". The API is documented as "non-idempotent on purpose" for the post-rip case, where the collision flow makes it safe; nothing makes the pre-rip case safe.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B1/double_apply.py   # FakeSession, IDENTIFIED job, apply twice, then after_rip
pre-rip apply #1 -> status=waiting_identify skipped=no_tracks idempotent=False
pre-rip apply #2 -> status=waiting_identify skipped=no_tracks idempotent=False
parked rows after two clicks: 2
after_rip -> sap_...GCMMN queued skipped= None
after_rip -> sap_...DFK91 waiting_identify skipped= collisions detail= output path collisions: 1 path(s) already claimed
rollup: state='transcoding' tasks_total=1 ...   parked_session_ids: ['ses_x']
```

**Suggested fix location.** `auto_session._apply_session_internal` - return the existing `WAITING_IDENTIFY` row for the same `(session_id, job_id)` as `idempotent=True` on the park paths (and use `.scalars().first()` in the auto lookup); optionally a `DELETE /api/jobs/{id}/transcode/{application_id}` for parked rows.

**Verification.** Scratch FakeSession script above against the real `auto_session`/`routers.jobs` code.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/139

### D-142  S3  open  backend  slice B1  regression of D-081

**Title.** Residual D-081: an unidentified `ripped_partial` job with a parked application still rolls up as `state=transcoding tasks_total=0`, and the UI folds `ripped_partial` + transcoding into "Transcoding 0/0" with live polling while the job actually needs identification.

**Where.** `services/backend/arm_backend/routers/jobs.py:213-214` (`_parked_apps_are_settled` -> False for RIPPED_PARTIAL+unidentified), `:240-249` (the row then counts as in flight), `services/ui-neu/frontend/src/lib/utils/job-status.ts:5,17-20` (`POST_RIP` includes `ripped_partial`; `transcoding` wins) at `2625b3e7`.

**What.** The #259 fix filters parked rows only once the drain has settled, and deliberately leaves the RIPPED_PARTIAL+`flags.unidentified` case unsettled because resolve will drain it. But a parked row with zero tasks is then fed to `_session_app_is_terminal`, which treats WAITING_IDENTIFY as non-terminal, so `transcode_progress` is `transcoding / 0 of 0 / 100%`. For `ripped_awaiting_identify` the UI does not fold (not in `POST_RIP`) so the status stays honest; for `ripped_partial` it does, so the dashboard/detail show "Transcoding 0/0", the lifecycle stepper sits on the transcode stage and the page polls, when the operator action is "identify this disc". The parked-session line says "waiting" on the same page.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B1/partial_rollup.py
settled: False
summary: state='transcoding' tasks_total=0 tasks_done=0 tasks_failed=0 percent=100.0
```
Flow: identify with `block_on_miss=false` (sets `flags.unidentified`), apply a session pre-rip (parks), rip-complete with one failed track -> RIPPED_PARTIAL, `after_rip` skipped (ripper.py:1380-1387), `GET /api/jobs/{id}` -> `transcode_progress.state == "transcoding"`.

**Suggested fix location.** `routers/jobs._summarize_transcode_progress` - exclude zero-task WAITING_IDENTIFY rows from the rollup whenever the job is post-rip (they are never "in flight"; `parked_session_ids` already carries them), or have `_parked_apps_are_settled` return True and let the UI's parked line say "waiting for identify".

**Verification.** Scratch call of the real summary function above; UI fold read at job-status.ts:14-33.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/140

### D-143  S3  untested-needs-hardware  backend  slice B1

**Title.** `DELETE /api/jobs/{id}` and `DELETE /api/jobs` accept a `ripped` job whose transcode tasks are `in_progress`: the cascade deletes the task under the running transcoder, its `/complete`/`/fail` 404s, the GPU row stays BUSY with a NULL claim until the next backend restart, and `delete_raw=true` rmtrees the encoder's input mid-run.

**Where.** `services/backend/arm_backend/routers/jobs.py:863-867,879` and `:935-948` (terminal check only; `TERMINAL_JOB_STATUSES` includes RIPPED/RIPPED_PARTIAL), `packages/arm_common/arm_common/schemas/jobs.py:198` (`can_delete=status in TERMINAL_JOB_STATUSES`, which the UI's Delete button follows: `JobActions.svelte:18,111`) at `2625b3e7`. Contrast `routers/transcodes.py:226-236` (an IN_PROGRESS task delete goes through `cancel_running`).

**What.** A transcode runs only on a terminal job, so Delete is offered exactly while the transcoder is working. On delete, `session_applications`/`transcode_tasks` cascade (FK), `gpus.claimed_by_task_id` is SET NULL but `status` stays BUSY; `sweep_stale_claims` only scans IN_PROGRESS tasks (gone) and `_release_orphaned_gpu_claims` (main.py:95-116) runs at boot only, so a single-GPU host stops dispatching GPU encodes until the backend restarts. The container keeps encoding into `/media` (output lands untracked, `.arm-inprogress` swept later) and its final PATCH 404s (`routers/transcoder.py:62-64`, `api_client.py:99/108 raise_for_status`). With `delete_raw=true`, `/raw/<job>/` is removed while HandBrake reads it. Workaround: cancel the job's tasks via `/api/transcodes/{id}` first.

**Repro / evidence.** Code trace: `delete_job` has no task-status check; `TERMINAL_JOB_STATUSES` (`enums.py:118-126`); `release_gpu_for_task` callers (`transcode_dispatcher.py:152-162`; transcoder.py:244,305; dispatcher :395,1440; transcodes.py:248) - none reachable from a job delete.

**Suggested fix location.** `routers/jobs.delete_job` / `delete_all_jobs` (409 while any of the job's tasks is IN_PROGRESS, or route them through `cancel_running` and `release_gpu_for_task` first) and `job_actions_for` so `can_delete` reflects it.

**Verification.** Code trace only; untested-needs-hardware for the GPU hold (`devtools/iso-smoke.sh` with a GPU preset, then `DELETE /api/jobs/{id}` mid-encode and `GET /api/gpus`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/141

### D-144  S3  open  backend  slice B1

**Title.** `DELETE /api/sessions/{id}` 500s for any session that has ever been applied to a job: `session_applications.session_id` is `ON DELETE RESTRICT` and the handler has no `IntegrityError` mapping.

**Where.** `services/backend/arm_backend/routers/sessions.py:198-209` (only built-in and drive-default checks, then `db.delete` + `commit`), `packages/arm_common/arm_common/models/session_application.py:21-23` and `services/backend/migrations/versions/0001_initial.py:264` (`ondelete="RESTRICT"`) at `2625b3e7`.

**What.** The UI enables Delete on every non-builtin session (`SessionCard.svelte:105`), but once a session has an application row (every applied or auto-applied rip) Postgres refuses the delete and the unhandled `IntegrityError` becomes a 500 with no explanation; `session_routes.py:84-109` handles the same class for routes. The fake-session tier cannot see FK violations (`test_delete_non_builtin_204` passes with a job history absent). Workaround: delete the jobs that used the session first (their applications cascade).

**Repro / evidence.** Needs a real Postgres (`tests/e2e` harness): create a session, apply it to a ripped job, `DELETE /api/sessions/{id}` -> 500 `IntegrityError ... session_applications_session_id_fkey`. `test_fk_ondelete.py` does not list `session_applications.session_id`, so the RESTRICT is also unaudited.

**Suggested fix location.** `routers/sessions.delete_session` - pre-check `SessionApplication` rows and 409 with the job count (mirrors the drive-default check), or catch `IntegrityError` -> 409; add the FK to `test_fk_ondelete._EXPECTED`.

**Verification.** Code trace (model + migration + handler); not executed (no Postgres in the sandbox).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/142

### D-145  S3  open  backend  slice B1

**Title.** The lenient episode-token render expands the template segment by segment, so a segment made only of an optional token (`{year?}`) raises "output path is empty once optional tokens ... are dropped" for a bonus/extra title when the year is unknown, failing an apply that validates and that renders fine for the episode titles.

**Where.** `services/backend/arm_backend/transcode_apply.py:173-184` (`_render_with_empty_episode`: `expand_template(seg_template, ctx)` per `/`-segment) vs `path_template.py:126-130` (whole-template collapse drops empty segments) at `2625b3e7`.

**What.** `compute_outputs` takes the per-segment branch only when an episode token is allowed empty (an `extra`/`trailer`/`other` track on a TV disc). `expand_template` on the lone segment `{year?}` collapses to the empty string and raises, whereas the whole-template path for an episode track collapses the same segment away. Result: a TV disc with one extra and no year -> manual apply 422 "output path is empty once optional tokens with no value are dropped" (misleading: the path is not empty), drain/redrain park the application with reason `template`. Workaround: exclude the extra or move `{year?}` into a bracketed segment.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B1/episode.py   # tpl "{show}/{year?}/Season {season}/{show} - S{season}E{episode} - {episode_title?}.{ext}", job.year=None
validate: Battlestar Galactica/2004/Season 01/Battlestar Galactica - S01E01 - Pilot.mkv
episode only : [ResolvedTask(track_id='trk_1', output_path='Show/Season 01/Show - S01E01 - Pilot.mkv')]
episode+extra RAISED: TemplateValidationError output path is empty once optional tokens with no value are dropped
```

**Suggested fix location.** `transcode_apply._render_with_empty_episode` - expand the whole template once, then tidy only the segments that referenced an empty episode token (split after expansion), or let `expand_template` take an `allow_empty` flag for the per-segment calls.

**Verification.** Scratch script above against the real `compute_outputs`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/143

### D-146  S4  open  backend  slice B1

**Title.** Renaming a built-in session/preset is allowed and tested at the API, but the seeder re-syncs `name` on every boot, so the rename silently reverts at the next backend restart; two tests enshrine the contradiction.

**Where.** `services/backend/arm_backend/routers/sessions.py:3-5,135` ("can be renamed (so users can disambiguate ...)"), `routers/rip_presets.py:108-111`, `routers/transcode_presets.py:102-105` vs `services/backend/arm_backend/seeders.py:493-516` (`sync_fields=("name", ...)` overwrites a differing name) at `2625b3e7`; `tests/test_sessions_router.py:218` (`test_patch_builtin_only_name_allowed`, 200 "Renamed") vs `tests/test_seeders_full.py:131` (`test_run_seeders_corrects_builtin_names`).

**What.** `PATCH /api/sessions/ses_builtin_movie_plex_1080p {"name": "Plex 1080p (legacy)"}` returns 200 and persists; `run_seeders` on the next start sets it back to "Movie to Plex 1080p H.265". The UI only offers View for built-ins (`SessionCard.svelte:103`), so this is API/docstring-level, but the docstring promise and the test are false.

**Repro / evidence.** `grep -n 'sync_fields' seeders.py` -> `("name",)` default, Sessions `("name", "output_path_template")`; the two tests above.

**Suggested fix location.** Either drop `name` from `sync_fields` (keep the one-off cleanup as a migration) or make the routers refuse `name` on built-ins and fix the three docstrings.

**Verification.** Code read + both tests present in the 383-test subset run.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/144

### D-147  S4  open  backend  slice B1

**Title.** Four 4xx detail strings call `.value` on a status that `_StrEnumString` may have loaded as a raw `str`, turning the intended 409 into a 500; sibling handlers already use `enum_value_str` for this.

**Where.** `services/backend/arm_backend/routers/jobs.py:513` (abandon), `:866` (delete), `:1140` (resolve), `services/backend/arm_backend/auto_session.py:336` (apply) at `2625b3e7`; cf. `:546,607,671` using `enum_value_str`, and `packages/arm_common/arm_common/models/_columns.py:60-71` documenting the hazard.

**What.** A job row written by a newer build with an unknown status loads as `str` (forward-compat, `_columns.py:43-57`); it is not in any status set, so these branches run and `str.value` raises `AttributeError` -> 500 where a 409 was intended.

**Repro / evidence.** `grep -n 'status.value' services/backend/arm_backend/routers/jobs.py services/backend/arm_backend/auto_session.py`.

**Suggested fix location.** The four lines - use `enum_value_str(job.status)`.

**Verification.** Code read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/145

### D-148  S3  open  backend  slice B2

**Title.** `POST /api/ripper/jobs/{id}/recovery-abandon` never commits: the abandon is rolled back when the request session closes, so the ripper's reboot recovery announces `rip.abandoned` for a job that stays `awaiting_review`.

**Where.** `services/backend/arm_backend/routers/ripper.py:1204-1215` at `2625b3e7` (`job.status = ABANDONED; session.add(job); await cancel_parked_applications(...); await session.flush(); await hub.emit(..., session=session); return job`), with `WSHub.emit` only `session.add(Event)` + `flush()` (`arm_backend/ws/hub.py:88-100`) and `db.get_session` closing the session without a commit (`arm_backend/db.py:44-46`).

**What.** Every other mutating route in this file commits (`heartbeat :363`, `register :534`, `identify :823`, `update_track :1264`, `rip_complete :1339`); this one stops at `flush()`. On Postgres the UPDATE and the `rip.abandoned` Event INSERT are rolled back at session close, while the WS broadcast has already gone out and the 200 body says `abandoned`. The ripper's boot probe (`services/ripper/arm_ripper/recovery.py:124-129`) treats the 200 as "disc re-enters review fresh", lets the InsertDetector re-fire, and the next `identify` finds the same still-`awaiting_review` job through `find_reusable_job_for_disc` (PRE_RIP -> `reuse`, `disc_dedupe.py:88`) with its original `wait_start_time`, so the held disc keeps a countdown anchor from before the restart instead of the fresh one the design promises; the dashboard that saw `rip.abandoned` contradicts `GET /api/jobs` until the next poll. The tier-1 tests (`test_ripper_router.py:1309-1347`) pass because `FakeSession` keeps in-memory mutations without a commit (a test passing for the wrong reason); no e2e test covers the route.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B2/recovery_abandon_commit.py
handler returned status: abandoned
persisted status after the request session closed: awaiting_review
```

**Suggested fix location.** `services/backend/arm_backend/routers/ripper.py` `recovery_abandon` — `await session.commit()` after the emit (then `refresh(job)` is unnecessary since `JobView` carries no `updated_at`), and add a real-DB e2e test for the route.

**Verification.** Reproduced zero-infra with a real SQLite `AsyncSession` (script above); code read of `get_session`/`WSHub.emit`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/146

### D-149  S4  open  backend  slice B2

**Title.** System diagnostics' `drives` check and `/api/system/stats.drives_online` count every `status == online` row, and scanner-created DETECTED rows (plus virtual ISO rows) are `online` by server default, so "no online drives registered" never fires once a drive is merely plugged in.

**Where.** `services/backend/arm_backend/routers/system.py:142-149` and `:278-280` at `2625b3e7`; the rows come from `services/backend/arm_backend/drive_scanner.py:218-224` (`Drive(id=..., hostname=..., device_path=..., lifecycle=DETECTED, present=True)` sets no `status`, and `models/drive.py` gives the column `server_default='online'`) and `iso_rips.py:358` (`status=DriveStatus.ONLINE` for virtual drives).

**What.** The check is meant to tell a fresh install "no ripper serves a drive yet" (docstring at `system.py:5-9`: "no rippers registered yet"). After the first scanner tick on a host with an optical drive there is a DETECTED row with `status=online`, so the check reads `ok` although nothing is enrolled; an ignored drive keeps it `ok` forever, and a running ISO rip flips a drive-less host to `ok`. `stats.drives_online` has the same shape. The sibling counters were already fixed to filter on lifecycle/kind (`drives.py:255-265`, D-010), these two were not.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B2/drive_status_default.py
in-memory status before insert: None
status after insert (server default): online | lifecycle: detected
rows matched by status==ONLINE (system diagnostics 'drives' check): ['drv_scan1']
```

**Suggested fix location.** `services/backend/arm_backend/routers/system.py` — filter `Drive.kind == OPTICAL` and `Drive.lifecycle == ENROLLED` (or count `present` enrolled rows) in both places; or have the scanner set `status=OFFLINE` on rows it creates.

**Verification.** Scratch script above (real SQLite session); code read of both counters.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/147

### D-150  S4  open  backend  slice B2

**Title.** `/api/iso` resolves the ripper manager without the `host_paths_set()` gate `/api/drives` applies, so on a docker-but-no-`ARM_HOST_*_PATH` stack `POST /api/iso/rips` commits a virtual drive, fails inside docker, retires it and answers 500 instead of the 503 "ripper manager disabled" the drives router gives.

**Where.** `services/backend/arm_backend/routers/iso.py:51-58` (`_manager`: `is None` check only) vs `services/backend/arm_backend/routers/drives.py:377-389` (`_manager`: `is None` -> 503, `not host_paths_set()` -> 503) at `2625b3e7`; `main.py:333-340` keeps a disabled manager on `app.state` on purpose.

**What.** `main.py` deliberately stores the manager even when `ARM_HOST_RAW_PATH`/`ARM_HOST_LOGS_PATH`/certs are unset (diagnostics distinguishes the two cases). `create_iso_rip` then reaches `ensure_running` with `volumes={"": {...}}` (`ripper_manager.py:141-146`), docker rejects it, `retire_virtual_drive` runs and the client gets `500 could not start the ISO ripper: APIError ...` plus a RETIRED drive row for a rip that could never start. Realistic only when `ARM_HOST_ISO_LIBRARY_PATH` is set while the other host paths are not (`library_configured()` gates on it alone), so it is an inconsistency more than a hazard.

**Repro / evidence.**

```
# routers/iso.py:51-58 has no `manager.host_paths_set()` branch; routers/drives.py:384-388 does.
```

**Suggested fix location.** `services/backend/arm_backend/routers/iso.py` `_manager` — reuse `routers.drives._manager` (or add the same 503 branch).

**Verification.** Code read; no runtime test (needs a docker socket).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/148

### D-151  S4  open  common  slice B2

**Title.** `DriveStatus.RIPPING` is a dead enum value: nothing in the backend or ripper ever writes it, and the drive diagnostic has no branch for it.

**Where.** `packages/arm_common/arm_common/enums.py:15` at `2625b3e7`; heartbeat/register/diagnostic handle only ONLINE/OFFLINE/ERROR (`routers/ripper.py:354-361`, `routers/drives.py:153-156`).

**What.** `grep -rn "DriveStatus.RIPPING" services/ packages/ --include=*.py | grep -v tests` returns nothing. The wire type (`DriveView.status`) therefore advertises a state the UI can never receive; a drive's rip state is derived from `current_job` instead. Dead code in the shared contract.

**Repro / evidence.**

```
$ grep -rn "DriveStatus.RIPPING" services/ packages/ --include=*.py | grep -v tests   # (no output)
```

**Suggested fix location.** `packages/arm_common/arm_common/enums.py` — drop the member (regen OpenAPI snapshot + TS types), or document it as reserved.

**Verification.** grep at `2625b3e7`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/149

### D-152  S3  untested-needs-hardware  backend  slice B3

**Title.** Remote docker-over-SSH: an idle transport death is swallowed by the spawn-gating probe ("docker host unreachable") before `_spawn_container` runs, so the transport-rebuild path never fires and encode spawns stay held until the backend restarts.

**Where.** `services/backend/arm_backend/transcode_dispatcher.py:711-717` (probe gate `continue`s before any spawn), `:1119-1129` (`_probe_pulling_base_image`), `:1234-1236` (the only call to `_is_transport_death` / `_docker_factory`), `docker_probe.py:119-131` (`probe_docker` catches every exception as "unreachable") at `2625b3e7`.

**What.** The rebuild machinery (`_TRANSPORT_DEAD_ERRORS`, `_docker_factory`) exists for "an idle paramiko connection reset by the remote end" (`:92-99`). But a dead paramiko transport fails every docker-py call, `client.ping()` included, and `spawn_pending` consults `probe()` first: `probe_docker` returns `(False, "docker host unreachable: EOF")`, the task is held (`held_encode += 1; continue`) and `_spawn_container` is never reached, so the client is never rebuilt. The TtlProbe re-pings the same dead client every 30 s forever; `/api/system/diagnostics` reports the GPU host as unreachable although it is up. The only recovery is a backend restart. Side effect: `_probe_pulling_base_image` misreads the dead transport as "base image missing" and spends a `_pull_image` attempt (`:1127`), recording a 600 s pull cooldown for the base image. The existing test `test_spawn_rebuilds_docker_client_on_dead_ssh_transport` (`services/backend/tests/test_transcode_dispatcher.py:534-563`) passes only because its "dead" MagicMock still answers `ping()` and `images.get()` successfully, a shape a dead transport never produces.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B3/repro_transport_death.py   # dead.ping/images.get raise EOFError, containers.run raises SSHException, factory returns a fresh client
WARNING arm_backend.transcode_dispatcher: could not pull base image arm-transcode:latest (EOF); encode tasks stay held, next pull attempt in 600 s
WARNING arm_backend.transcode_dispatcher: transcode spawns held: docker host unreachable: EOF
tick 0: spawned=0 factory_calls=0 docker_is_dead=True probe=(False, 'docker host unreachable: EOF')
tick 1: spawned=0 factory_calls=0 docker_is_dead=True probe=(False, 'docker host unreachable: EOF')
tick 2: spawned=0 factory_calls=0 docker_is_dead=True probe=(False, 'docker host unreachable: EOF')
containers.run called on dead client: 0
fresh client ever used: 0
```

**Suggested fix location.** `services/backend/arm_backend/transcode_dispatcher.py` — in `probe()`/`_probe_pulling_base_image` (or inside `TtlProbe`'s callable), when `probe_docker` fails with `_is_transport_death(exc)` and a factory exists, rebuild the client and re-probe once (the same logic `_spawn_container` has), and have `probe_docker` return the exception so the caller can classify it; fix the dead-client fixture in `test_transcode_dispatcher.py:542` to raise on `ping()` too. The GPU probe runner (`gpu_probe_runner.py:398`) and `cancel_running` (`:1416`) share the client and also never rebuild.

**Verification.** Scratch repro above (zero-infra). Live confirmation untested-needs-hardware: on a remote-offload install (`ARM_TRANSCODE_DOCKER_HOST=ssh://...`), let the backend idle until sshd drops the connection (or `ssh host 'sudo ss -K dport = :22'` from the GPU host), queue an encode, watch `transcode spawns held: docker host unreachable` repeat with no `rebuilding client` line.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/150

### D-153  S3  untested-needs-hardware  backend  slice B3

**Title.** Stale-claim sweep assumes the transcoder is dead: a backend outage longer than `ARM_TRANSCODE_STALE_THRESHOLD_SECONDS` (90 s) re-queues a task whose container is still encoding, releases its GPU mid-encode, and the re-spawn collides on the fixed container name until the task is terminally FAILED two ticks later.

**Where.** `services/backend/arm_backend/transcode_dispatcher.py:393-395,433-435` (release + reset with the comment "a stale claim cannot be holding a real container any more"), `:1218-1224` (`name=hostname` derived from the task id), `:840-857` (`_count_failed_spawn` counts the name conflict as an attempt; attempts was already 1 from the claim), `services/transcode/arm_transcode/heartbeat.py:80-81` (a 403/409 heartbeat is logged and the encode continues) at `2625b3e7`.

**What.** The transcoder heartbeats every 30 s and keeps encoding when a heartbeat fails. If the backend is unreachable to it for > 90 s (slow redeploy with image rebuild, DB outage, network blip to a remote GPU host, backend host reboot while the GPU host keeps running), the first tick after recovery resets the task to QUEUED with `claimed_by=None` and flips its GPU AVAILABLE while the device is still in use (another task can now claim it). The next tick re-spawns with the same `name=arm-transcode-<id[-12:]>`; docker refuses the duplicate name, `_count_failed_spawn` takes attempts 1->2->3 and `_fail_queued_task` marks the task FAILED ("transcode container could not start ... Conflict") about 10 s after the sweep. The original encode then finishes, renames its output into `/media`, and its `/complete` gets 403 (`claimed_by=None`), so the job shows a FAILED transcode while the file exists; a Retry re-encodes from scratch over it. The sweep should check for a live container by label (as `cancel_running` does at `:1416`) and either keep the claim or stop the survivor before re-queueing, and the transcoder should abort on a 403/409 heartbeat instead of carrying on.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B3/repro_stale_alive.py   # IN_PROGRESS task, heartbeat 95 s old, GPU BUSY; docker.run raises the 409 name-conflict APIError
WARNING ... transcode task reset to queued after stale claim task_id=txt_1 attempts=1
after sweep: touched=1 status=queued claimed_by=None attempts=1 gpu=available claim=None
ERROR ... transcode spawn failed task_id=txt_1: Conflict. The container name "/arm-transcode-txt_1" is already in use by container "abc"
tick 0: status=queued attempts=2 last_error=None
ERROR ... transcode task failed before spawn task_id=txt_1: transcode container could not start (attempts=3): APIError: Conflict. ...
tick 1: status=failed attempts=3 last_error='transcode container could not start (attempts=3): APIError: Conflict. The container name "/arm-transcode-txt_1" is already in use ...'
```

**Suggested fix location.** `services/backend/arm_backend/transcode_dispatcher.py` `sweep_stale_claims` — before resetting, `containers.list(filters={"label": f"{_DOCKER_LABEL_KEY}={task.id}"})`; if a container is running, refresh `claim_heartbeat_at` (or stop it first) instead of releasing the GPU and re-queueing; `services/transcode/arm_transcode/heartbeat.py` — treat a 403/409 heartbeat as "task lost" and cancel the encode.

**Verification.** Scratch repro above for the sweep + attempts arithmetic; live drill untested-needs-hardware: start a GPU encode, `docker pause arm-backend` for 100 s, `docker unpause`, then `SELECT status,attempts,last_error FROM transcode_tasks` and `SELECT status,claimed_by_task_id FROM gpus` within 15 s; watch the transcoder log for `heartbeat REST failed` then a 403 on `/complete`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/151

### D-154  S3  open  backend  slice B3

**Title.** `PATCH /api/transcode-presets/{id}` with an explicit `"tool": null` or `"container": null` (both nullable in the OpenAPI schema) returns 500 instead of 422.

**Where.** `services/backend/arm_backend/routers/transcode_presets.py:101` (only `encoder` is filtered out of the null-valued fields), `:117-118` (`setattr(row, key, None)` on NOT NULL columns), `packages/arm_common/arm_common/schemas/sessions.py:109,112` (`tool: TranscodeTool | None`, `container: ContainerFormat | None`) at `2625b3e7`.

**What.** The update schema advertises `tool` and `container` as nullable, so a client that round-trips the form state sends `null` for an untouched field. `fields = model_dump(exclude_unset=True)` keeps `{"tool": None}`, the route writes `None` onto a NOT NULL VARCHAR column and commits: against Postgres the commit raises IntegrityError (500, row unchanged); against the response model `TranscodePresetView.tool: TranscodeTool` it is a ResponseValidationError (500) even before the DB. `encoder` already gets the "explicit null means leave it" treatment one line above; `tool`/`container` need the same, or a 422. Noted as "found on the way" in `.claude/memory/project_encoder_first_presets.md` but never filed.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B3/repro_preset_null.py   # FastAPI TestClient over the router with FakeSession
{'tool': None} -> 500 Internal Server Error | stored tool= None container= mkv
{'container': None} -> 500 Internal Server Error | stored tool= None container= None
{'name': 'ok', 'container': None} -> 500 Internal Server Error | stored tool= None container= None
```

**Suggested fix location.** `services/backend/arm_backend/routers/transcode_presets.py:101` — drop `tool`/`container` from `fields` when `None` (same as `encoder`), or make `TranscodePresetUpdateRequest` reject null for the NOT NULL columns and regenerate the OpenAPI snapshot + TS types.

**Verification.** Scratch repro above; `test_transcode_presets_router.py::test_patch_null_encoder_leaves_it_unchanged` covers only `encoder`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/152

### D-155  S3  open  backend  slice B3

**Title.** `POST /api/transcodes/{id}/retry` re-queues the task but leaves its session application terminal (FAILED/DONE_PARTIAL, `completed_at` set), so the job's transcode summary reads "done" (0/1) while the retried encode is queued or running.

**Where.** `services/backend/arm_backend/routers/transcodes.py:146-153` (status/progress/claim reset only, no application update, no WS event), consumer at `services/backend/arm_backend/routers/jobs.py:190-193` (`_session_app_is_terminal` trusts the application status) and `:249-265` (all-terminal + no failed tasks -> `"done"`) at `2625b3e7`.

**What.** When the last task of an application fails, `aggregate_session_application` moves the application to FAILED with `completed_at`. Retry flips only the task row. `_summarize_transcode_progress` then sees a terminal application, `tasks_failed=0`, and reports `state="done", percent=0.0, tasks_done=0/1` for a job whose only transcode is QUEUED/IN_PROGRESS; the Transcoder page (polling `/api/transcodes`) shows it in progress at the same time. The application is only corrected when the retried task completes (aggregate FAILED->DONE); if the retry fails again the aggregate is a no-op (`application.status == target`) so no `session.failed` fires either. Retry should set the application back to RUNNING (and clear `completed_at`) in the same commit, and emit a `transcode.events` event so the UI refreshes.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B3/repro_retry_summary.py
app=FAILED task=queued -> summary state='done' percent=0.0 done=0/1
app=FAILED task=in_progress -> summary state='done' percent=0.0 done=0/1
```

**Suggested fix location.** `services/backend/arm_backend/routers/transcodes.py` `retry_transcode` — reload the `SessionApplication`, set `status=RUNNING`, `completed_at=None`, emit `session.started`/`task.queued`; `test_transcodes_router.py::test_retry_failed_requeues_and_resets` should assert the application transition.

**Verification.** Scratch call of `_summarize_transcode_progress` above; code trace of the retry route and aggregate idempotency (`transcode_apply.py:475-477`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/153

### D-156  S3  open  backend  slice B4

**Title.** A 200 response with a non-JSON body from OMDb, 1337server or MusicBrainz escapes the dispatcher as `JSONDecodeError`, so identify returns 500 and the ripper retries it forever instead of falling through to the next provider / `block_on_miss`.

**Where.** `services/backend/arm_backend/metadata/omdb.py:56`, `metadata/arm_server.py:62`, `metadata/musicbrainz.py:76` (`r.json()` with no guard) at `2625b3e7`; caught only for `LookupError`/timeout at `metadata/dispatcher.py:281-286`; the identify handler catches only `asyncio.TimeoutError` at `routers/ripper.py:755`.

**What.** `metadata/tmdb.py:57-60, 139-142, 175-178` wrap `r.json()` in a `ValueError -> LookupError` guard, with a comment saying a non-JSON 200 "must surface as the module LookupError ... not an uncaught ValueError -> 500". The three sibling clients never got the guard. A proxy/captive-portal HTML page, a Cloudflare challenge, or pythonanywhere's HTML "app down" page served with status 200 makes `_call` raise `json.JSONDecodeError`, which is a `ValueError`, not a `LookupError`; `dispatcher.identify` propagates it, the ripper gets HTTP 500 and `job_controller.py:531-545` treats 5xx as retriable with exponential backoff, holding the drive's active lock until upstream recovers. Expected: map to `LookupError` so the dispatcher logs a miss and continues (TMDb -> OMDb -> label candidates -> `block_on_miss`).

**Repro / evidence.** `uv run python .../sweep2/B4/nonjson.py` (MockTransport returning `200 text/html` for every URL):
```
omdb -> ESCAPED _call: JSONDecodeError Expecting value: line 1 column 1 (char 0)
arm_server -> ESCAPED _call: JSONDecodeError Expecting value: line 1 column 1 (char 0)
musicbrainz -> ESCAPED _call: JSONDecodeError Expecting value: line 1 column 1 (char 0)
identify -> ESCAPED: JSONDecodeError Expecting value: line 1 column 1 (char 0)   # DVD scan with a crc64 fingerprint
```
`tests/test_metadata_clients.py:687-694` covers the TMDb guard only; no test sends a non-JSON 200 to the other three clients.

**Suggested fix location.** `metadata/omdb.py:_get_json`, `metadata/arm_server.py:lookup_by_crc64`, `metadata/musicbrainz.py:_get` — add the same `try: r.json() except ValueError: raise LookupError(...)` guard TMDb has (or catch `ValueError` in `dispatcher._call`).

**Verification.** Reproduced with the script above against the installed package; ripper retry semantics read from `services/ripper/arm_ripper/job_controller.py:523-549`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/154

### D-157  S3  open  backend  slice B4

**Title.** `_normalize_volume_label` takes the first 4-digit run anywhere in the label as the release year, so titles that contain a year (`BLADE_RUNNER_2049`, `WONDER_WOMAN_1984`, `2001_A_SPACE_ODYSSEY`, `1917`) are searched with a wrong year filter and never retried without it; the fallback then lands on TMDb's TV search.

**Where.** `services/backend/arm_backend/metadata/dispatcher.py:69-74` (`re.search(r"(\d{4})", cleaned)` + `_YEAR_SUFFIX_RE.sub`) at `2625b3e7`; consumed at `:149-152` (label candidate `(label_title, label_year, False)`) and `:206-237` (`_search_title`: TMDb movie with `year`, then TMDb TV without, then OMDb with `y=year`; no year-less movie retry).

**What.** A Blu-ray/DVD volume label that is the film's title with a year in it is common (`BLADE_RUNNER_2049`, `WONDER_WOMAN_1984`, `2001_A_SPACE_ODYSSEY`, `1917`, `2012`). The label pass strips a trailing year and uses it as the TMDb `year` / OMDb `y` filter: `BLADE_RUNNER_2049` becomes `("BLADE RUNNER", 2049)` — no 2049 release exists, so the movie search misses, and the next step is `search_tv("BLADE RUNNER")`, which TMDb answers with the 2021 series "Blade Runner: Black Lotus" -> the job is identified as TV with the wrong title. `2001_A_SPACE_ODYSSEY` keeps the year in the title and filters on 2001 (the film is 1968) -> unidentified; `1917` / `2012` normalise to an empty title -> no candidates. The disc-hint path (`dispatcher.py:157-163`) explicitly caps the hint-year strip at 2029 with a comment naming `BLADE_RUNNER_2049`, but the label path has no cap and no year-less retry. Workaround: manual identify (or a 1337server / TheDiscDB hit first).

**Repro / evidence.** `uv run python .../sweep2/B4/label_year.py`:
```
BLADE_RUNNER_2049 -> ('BLADE RUNNER', 2049)
WONDER_WOMAN_1984 -> ('WONDER WOMAN', 1984)
2001_A_SPACE_ODYSSEY -> ('2001 A SPACE ODYSSEY', 2001)
1917 -> ('', 1917)
2012 -> ('', 2012)
```
`tests/test_dispatcher.py:24-70` only exercises labels whose year is a real trailing release year.

**Suggested fix location.** `metadata/dispatcher.py:_normalize_volume_label` / `_identify_video` — only treat a trailing token as the year when it is plausibly a release year (<= current year + 1, like `_HINT_YEAR_SUFFIX_RE`), keep an unstripped title candidate, and add a year-less movie retry before the TV fallback.

**Verification.** Label normalisation reproduced with the script; the provider outcome ("Blade Runner: Black Lotus" via `search_tv`) is inferred from TMDb's catalogue and the search order at `dispatcher.py:206-237`, not executed against live TMDb (no key in the review environment).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/155

### D-158  S3  open  backend  slice B4

**Title.** The `metadata_provider` setting ("Look up titles with — the service ARM searches when it identifies a disc") is never read by the identify pipeline: with both keys set and OMDb selected, every disc is still identified by TMDb first.

**Where.** `services/backend/arm_backend/metadata/dispatcher.py:190-237` (`_search_kind` / `_search_title`: order fixed to TMDb-if-keyed then OMDb-if-keyed; `cfg.metadata_provider` does not appear anywhere in `metadata/`) at `2625b3e7`; the setting's operator copy at `packages/arm_common/arm_common/config_metadata.py:38-43`; the only consumers are the interactive endpoints `routers/metadata.py:79` and `:122`.

**What.** An operator who sets "Look up titles with: OMDb" while keeping a TMDb key (e.g. for episode matching, where the help text for `tvdb_api_key`/`episode_sources` tells them keys are needed) expects identify to use OMDb; the dispatcher ignores the choice and searches TMDb movie/TV first, OMDb only as a fallback. The help text (`"The service ARM searches when it identifies a disc."`) is therefore false for automatic identification; only the manual title search honours it. Workaround: delete the TMDb key (which also disables the TMDb episode source). The setting is validated (`routers/config.py:167-171`) and shown in setup (`FinishStep.svelte:62` "Titles looked up with OMDb"), so the UI claims a behaviour the backend does not have.

**Repro / evidence.** `grep -rn metadata_provider services/backend/arm_backend/metadata/` -> no matches; `dispatcher._search_title` branches only on `cfg.tmdb_api_key` (`:209`) and `cfg.omdb_api_key` (`:226`).

**Suggested fix location.** `metadata/dispatcher.py:_search_title` / `_search_kind` — order the keyed providers by `cfg.metadata_provider` (selected first, the other as fallback), or change the help text in `config_metadata.py:42` to describe the manual search only. This is the concrete piece of #258 that is a defect today.

**Verification.** Static trace of every `metadata_provider` reader; `tests/test_dispatcher.py` has no test selecting OMDb with both keys present.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/156

### D-159  S3  open  backend  slice B4

**Title.** Two overlapping TheDiscDB refreshes (the daily loop and `POST /api/system/thediscdb/refresh`, or two clicks) share the same `index.sqlite.new` path, so one build fails with `disk I/O error` and, depending on timing, a partial index can be moved live.

**Where.** `services/backend/arm_backend/identity/sources/thediscdb_snapshot.py:106-109` (`new_path = dest.with_suffix(".sqlite.new")`; `new_path.unlink(missing_ok=True)`; `sqlite3.connect(new_path)`) and `:133` (`os.replace(new_path, dest_sqlite)`) at `2625b3e7`; callers `routers/system.py:385` and `main.py:181` with no shared lock or in-progress flag.

**What.** `build_index` is documented as atomic, but two concurrent builds both unlink and recreate the same `.sqlite.new` (and share its `-journal`). The second build deletes the first's open database/journal from under it, so the first dies with `sqlite3.OperationalError: disk I/O error` (a 502 "thediscdb refresh failed: disk I/O error" on the manual route, or a warning in the loop). If the first build has already committed when the second unlinks, its `os.replace` moves the second's half-written file over the live index. The realistic overlap is first boot: `_thediscdb_refresh_loop` starts a download immediately when `not store.exists()` (`main.py:179-181`), which is exactly when an operator sees "no snapshot" in Settings and presses Refresh now. Expected: a process-wide `asyncio.Lock` (or a unique temp name + an "in progress" short-circuit) so a second refresh waits or is reported as already running.

**Repro / evidence.** `uv run python .../sweep2/B4/discdb_race.py` (two threads, two 20k-disc tarballs, same dest; the second starts 150 ms later):
```
{'A': ('ERR', 'OperationalError: disk I/O error'), 'B': ('ok', 20000)}
live index exists: True count: 20000
lookup A000000: False lookup B000000: True
```

**Suggested fix location.** `identity/sources/thediscdb_snapshot.py:refresh` / `build_index` — write to a unique temp file (`tempfile.mkstemp(dir=dest.parent)`) and guard `refresh` with a module-level `asyncio.Lock`; `routers/system.py:thediscdb_refresh_now` should return 409 while a refresh is running.

**Verification.** Reproduced with the script above (real sqlite, temp dir, no network).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/157

### D-160  S3  open  backend  slice B4

**Title.** The unauthenticated image proxy's negative cache is an unbounded module-level dict that is never pruned, so any anonymous client can grow backend memory one entry per distinct allowlisted-host URL.

**Where.** `services/backend/arm_backend/routers/images.py:21` (`_NEGATIVE_CACHE: dict[str, float] = {}`), `:188`, `:191`, `:195` (entries added on too-large / transport error / 404), `:170` (expiry only checked on a repeat hit of the same URL), `:203` (removed only on a later successful fetch) at `2625b3e7`.

**What.** `GET /api/images/proxy` is deliberately unauthenticated (`images.py:145-147`); the allowlist bounds *where* it fetches, but every distinct URL on an allowlisted host that 404s (`https://image.tmdb.org/t/p/w500/<random>.jpg`) adds a `(url, expiry)` entry that no code path ever removes — expired entries are skipped on read but kept, and `_NEGATIVE_TTL_SECONDS` is a per-entry timestamp, not an eviction policy. The on-disk positive cache, by contrast, is bounded by `ARM_IMAGE_CACHE_MAX_ENTRIES` (`image_cache.py:60-62`). A script hitting the proxy with unique query strings keeps adding ~100-200 bytes per request for the backend's lifetime; a restart is the only workaround.

**Repro / evidence.** Code hunk: the only writes are `images.py:188,191,195` and the only removal is `images.py:203` (success path). `tests/test_images_router.py:127,148,418` assert insertion only; nothing asserts a bound or a sweep.

**Suggested fix location.** `routers/images.py` — cap the dict (evict oldest when `len > N`, like `SourceHttp._cache_put`) and drop expired entries on write; or key the negative cache off the sha256 filename and store it in `image_cache` with its LRU.

**Verification.** Static read; the growth is a direct consequence of the three unconditional writes.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/158

### D-161  S4  open  backend  slice B4  regression of D-094

**Title.** Operator-supplied external ids are still interpolated unescaped into provider URL paths at every site except the two D-094 anchored.

**Where.** `services/backend/arm_backend/identity/episodes/providers/tmdb.py:67` and `:83` (`/tv/{show_id}`, `/tv/{show_id}/season/{number}`), `providers/tvmaze.py:62` (`/shows/{show_id}/episodes`), `providers/tvdb.py:111` and `:148` (`/series/{show_id}/extended`, `/series/{show_id}/episodes/{order}`), `metadata/tmdb.py:163` (`/find/{imdb_id}`, reached from `GET /api/metadata/lookup?imdb_id=` at `routers/metadata.py:142` and from TheDiscDB `ExternalIds.Imdb`), `metadata/musicbrainz.py:129` (`/release/{release_id}` from `GET /api/metadata/music/{release_id}`) at `2625b3e7`.

**What.** `ExternalIds` (`packages/arm_common/arm_common/schemas/job_metadata.py:37-49`) still has no pattern, and `POST /api/jobs/{id}/resolve` copies `external_ids.tmdb/tvdb/imdb` verbatim (`routers/jobs.py:1178-1192`). D-094's fix quoted the `/find/{external_id}` and `/search/remoteid/{ids.imdb}` sites only; the show id those lookups return is then used — or, when the operator pasted a TMDb/TVDB id directly, the pasted string itself is used — unescaped in the season/episode paths. A pasted URL fragment, trailing whitespace, `?` or `#` yields a malformed request (a `?` injects query params ahead of the provider's own) that 404s/400s into `status="miss", detail="show not found"` or a `SourceError` with no hint the id was malformed. The same holds for `/api/metadata/lookup?imdb_id=` into `metadata/tmdb.py:163`.

**Repro / evidence.** `uv run python .../sweep2/B4/showid_quote.py` with `tmdb="123/season/1?x=1#f"` as a resolve-pasted id (MockTransport captures the URL):
```
URL: https://api.themoviedb.org/3/tv/123/season/1?x=1#f
URL: https://api.tvmaze.com/shows/123/season/1?specials=1#f/episodes
URL: https://api4.thetvdb.com/v4/series/123/season/1?short=true#f/extended
```
`grep -rn "quote(" services/backend/arm_backend/metadata/` -> no matches.

**Suggested fix location.** Either validate at the boundary (`ExternalIds` field patterns: `^tt\d+$` for imdb, `^\d+$` for tmdb/tvdb/tvmaze, UUID for musicbrainz_release) or `urllib.parse.quote(value, safe="")` at the listed sites; the boundary validator also makes the failure explicit (422) instead of a silent "show not found".

**Verification.** Reproduced with the script above; static read of `routers/jobs.py` resolve overlay.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/159

### D-162  S2  open  backend  slice B5

**Title.** The WS Origin gate is skipped whenever the client merely *requests* the `arm-service-token` subprotocol, which any browser page can do, so a cross-origin page bypasses the only cross-site protection the WS endpoint has.

**Where.** `services/backend/arm_backend/ws/router.py:69-70` at `2625b3e7` (`if SERVICE_TOKEN_SUBPROTOCOL in subprotocols: return True` runs before any token is seen) and `:114-115` (the server echoes that subprotocol in `accept`, so the browser completes the handshake). Test that pins the behaviour: `services/backend/tests/test_ws_origin.py:19-21`.

**What.** `new WebSocket("wss://arm-host:8081/ws", ["arm-service-token"])` from any origin passes `_origin_allowed`, is accepted, and can then send `{"op":"auth","token":""}`; with guest access enabled it is authenticated as the anonymous guest and subscribes to `ripper.events`, `logs.{job_id}`, etc. Because REST has no CORS middleware, a cross-origin page cannot read `/api/*`, so this WS gate is the only thing stopping a page in a LAN user's browser from reading guest-visible live data (exactly the scenario 05-cross-cutting.md:187 says the gate exists for). The skip should depend on the token actually validating as the service token (or on `Origin` being absent, as sibling containers send none), not on a client-chosen header.

**Repro / evidence.**

```
uv run python scratchpad/sweep2/B5/repro_ws.py
evil origin, no subprotocol -> closed 1008
evil origin + subprotocol, anon auth: {'op': 'ack', 'topic': ''}
evil origin subscribe: {'op': 'ack', 'topic': 'ripper.events'}
```

**Suggested fix location.** `services/backend/arm_backend/ws/router.py` `_origin_allowed` / `ws_endpoint` — drop the subprotocol short-circuit (origin-less connects already pass at `:71-72`), or defer the Origin decision until after `_do_auth` and only waive it for a `ServicePrincipal`. Update `tests/test_ws_origin.py::test_service_subprotocol_skips_origin_check` accordingly; ripper/transcoder clients send no `Origin`, so they are unaffected.

**Verification.** scratch script above; code read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/160

### D-163  S3  open  backend  slice B5

**Title.** WS handshake verifies only the JWT signature: a disabled user, a deleted user, or an admin still under `password_must_change` can open `/ws` and subscribe to every UI topic.

**Where.** `services/backend/arm_backend/ws/principal.py:76-85` at `2625b3e7` (JWT branch of `resolve_principal` returns a `UIPrincipal` from the payload with no user lookup); `services/backend/arm_backend/ws/router.py:186-194` (`_do_auth` only consults the DB for the empty-token guest path, `_check_guest_enabled`). Contrast `services/backend/arm_backend/auth.py:111-121` (REST `require_jwt` 401s on `user is None` / `user.disabled` and 403s on `password_must_change`).

**What.** REST enforces three post-signature checks on every UI request; the WS path enforces none of them. A guest whose password an admin set and later disabled keeps a working live feed (logs, progress, events) for the remaining token lifetime (up to 7 days); a fresh install still at `admin`/`admin` with the must-change gate up can stream `logs.{job_id}` and `ripper.events` before the password is changed, which the gate is documented to prevent ("403s every endpoint except /api/auth/password + /api/auth/logout", 05-cross-cutting.md:90). The accepted "validated at handshake only" trade-off (05-cross-cutting.md:194) covers expiry after connect, not skipping the account checks at the handshake itself.

**Repro / evidence.**

```
uv run python scratchpad/sweep2/B5/repro_ws.py
disabled-user auth: {'op': 'ack', 'topic': ''}
disabled-user subscribe: {'op': 'ack', 'topic': 'logs.job_x'}
must-change auth: {'op': 'ack', 'topic': ''}
must-change subscribe: {'op': 'ack', 'topic': 'ripper.events'}
deleted-user auth: {'op': 'ack', 'topic': ''}
```

**Suggested fix location.** `services/backend/arm_backend/ws/router.py` `_do_auth` — after `resolve_principal` returns a `UIPrincipal` with a real user id, load the `User` row through `SessionLocal()` the same way `_check_guest_enabled` does and raise `_AuthFailure(CLOSE_UNAUTHORIZED, ...)` on missing/disabled and `CLOSE_FORBIDDEN` on `password_must_change` (keeps `resolve_principal` DB-free as its docstring wants).

**Verification.** scratch script above against the real `/ws` router with `FakeSession`; code read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/161

### D-164  S3  open  backend  slice B5

**Title.** `PATCH /api/config` with `null` for any NOT NULL boolean setting still ends in an unhandled IntegrityError (HTTP 500); the D-096 fix covered the int fields only.

**Where.** `arm_common/schemas/auth.py:100-120` at `2625b3e7` (`auto_transcode_on_idle`, `auto_rip_on_insert`, `block_on_miss`, `community_keydb_enabled`, `makemkv_sdf_enabled`, `thediscdb_enabled`, `ripping_paused`, `hold_for_review`, `notifications_enabled` are `bool | None`); `services/backend/arm_backend/routers/config.py:172-196` (None checks exist for the seven ints, `on_previously_ripped`, `transcode_enabled`, `episode_auto_apply` only) and `:248-249` (`setattr(cfg, key, value)` writes the None); `arm_common/models/config.py:451-541` (all nine columns `nullable=False`).

**What.** An explicit JSON `null` for one of those nine keys passes Pydantic (`exclude_unset` keeps it), is written to a NOT NULL column and the commit raises -> 500 with a traceback instead of the 400 every other None-able field now gets. The UI toggles never emit `null` for a bool (SchemaConfigForm only nulls cleared secrets), so this is an API-contract gap rather than a UI-visible one; same class as D-096, not the same rows.

**Repro / evidence.**

```
uv run python scratchpad/sweep2/B5/repro_config_null_bool.py   # config router over real SQLite
{'auto_rip_on_insert': None} -> 500 Internal Server Error
{'notifications_enabled': None} -> 500 Internal Server Error
{'ripping_paused': None} -> 500 Internal Server Error
{'hold_for_review': None} -> 500 Internal Server Error
{'block_on_miss': None} -> 500 Internal Server Error
{'thediscdb_enabled': None} -> 500 Internal Server Error
{'drive_scan_interval_seconds': None} -> 400 drive_scan_interval_seconds must be a positive integer
{'manual_wait_seconds': None} -> 400 manual_wait_seconds must be 0 or a positive integer
```

**Suggested fix location.** `services/backend/arm_backend/routers/config.py::update_config` — one generic guard: for every key in `fields` whose `Config.__table__.columns[key].nullable is False`, reject `None` with 400 (replaces the growing per-field lists at `:174-196`).

**Verification.** scratch script above (real SQLite enforces NOT NULL); pydantic check `ConfigUpdateRequest.model_validate({"auto_rip_on_insert": None}).model_dump(exclude_unset=True)` -> `{'auto_rip_on_insert': None}`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/162

### D-165  S3  untested-needs-hardware  backend  slice B5

**Title.** `GET /api/logs/{job_id}.zip` is an `async def` that reads up to 5 MB per log file with blocking file I/O on the event loop; on the network-share `/logs` the project itself plans for, one download stalls every REST/WS consumer in the backend.

**Where.** `services/backend/arm_backend/routers/logs.py:74-110` at `2625b3e7` (coroutine calls `_read_capped_lines` directly, `:93` and `:98`), `:165-185` (`path.open()` + line loop, no `to_thread`); legacy fallback at `:97-100` walks every `*.log` in `/logs`. Compare `services/backend/arm_backend/log_tailer.py:309-311` ("/logs is usually on a network share: every filesystem call here runs in a worker thread so a slow share never stalls the event loop") and the NDJSON sibling at `:129-162`, which Starlette runs in a threadpool because `gen()` is a sync generator.

**What.** Per entry up to `ARM_LOG_ZIP_PER_ENTRY_BYTE_CAP` (5 MB) is read synchronously; for a pre-tailer job the fallback reads up to 5 MB from each service log. While that runs, ripper progress POSTs, WS fan-out and every other request are frozen (single event loop). The same code shape was treated as a defect for `shutil.rmtree` in D-108.

**Repro / evidence.** Code hunk `logs.py:91-100` inside `async def download_job_logs_zip`; `_read_capped_lines` has no `await`. Not timed on a share (needs NFS/SMB-backed `/logs`).

**Suggested fix location.** `services/backend/arm_backend/routers/logs.py::download_job_logs_zip` — build the zip in `await asyncio.to_thread(...)` (one sync helper), or make the route a plain `def` so FastAPI runs it in the threadpool.

**Verification.** code read | untested-needs-hardware: mount `/logs` on NFS, request `/api/logs/<legacy job>.zip` while watching `/api/health` latency.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/163

### D-166  S4  open  backend  slice B5

**Title.** `GET /api/logs/{job_id}?limit=0` is accepted (`ge=0`) but returns one line, because the cap is checked only after a line has been yielded.

**Where.** `services/backend/arm_backend/routers/logs.py:116` at `2625b3e7` (`limit: int | None = Query(default=None, ge=0)`), `:127` (`cap = max(0, min(...))`), `:138-143` and `:153-160` (yield, then `yielded += 1; if yielded >= cap`).

**What.** With `cap == 0` the first matching line is written before the comparison, so the response holds exactly one line for a request that asked for none. Either `ge=1` or check the cap before yielding.

**Repro / evidence.**

```
uv run python scratchpad/sweep2/B5/repro_logs_limit0.py
limit=0 -> 200, lines returned = 1
limit=1 -> 200, lines returned = 1
limit=2 -> 200, lines returned = 2
```

**Suggested fix location.** `services/backend/arm_backend/routers/logs.py::stream_job_logs` — `if cap == 0: return` at the top of `gen()`, or `ge=1` on the query param.

**Verification.** scratch script above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/164

### D-167  S4  open  backend  slice B5

**Title.** After auth, a non-JSON (or binary) WS frame escapes `_serve_loop` as an unhandled `JSONDecodeError`/`KeyError`, so the connection dies with a server traceback and 1011 instead of the `{"op":"error",...}` frame the pre-auth path sends for the same input.

**Where.** `services/backend/arm_backend/ws/router.py:206` at `2625b3e7` (`raw = await websocket.receive_json()` with no try/except; only `ValidationError` on the *parsed* object is handled at `:207-210`); `:135-140` (`ws_endpoint` catches only `WebSocketDisconnect`). Contrast `:159-166` (`_do_auth` maps the same failure to `CLOSE_BAD_MESSAGE, "auth message must be JSON"`).

**What.** Any client bug (or a stray text frame from a proxy) after the handshake produces an ERROR-level ASGI exception log per occurrence and a hard close, while the identical frame before auth gets a clean application error. Operators see tracebacks for what is a client protocol error.

**Repro / evidence.**

```
uv run python scratchpad/sweep2/B5/repro_ws.py
non-JSON frame after auth -> JSONDecodeError Expecting value: line 1 column 1 (char 0)
```

**Suggested fix location.** `services/backend/arm_backend/ws/router.py::_serve_loop` — wrap `receive_json()` in the same `except Exception` -> `_send_error(CLOSE_BAD_MESSAGE, ...)` + `continue` that `_do_auth` uses (keep `WebSocketDisconnect` propagating).

**Verification.** scratch script above (TestClient re-raises the server exception).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/165

### D-168  S4  open  backend  slice B5

**Title.** The notification dispatcher, `/api/system/stats` and the inbox endpoints load whole tables into Python and filter there, explicitly to suit the in-memory `FakeSession`; the dispatcher does it every 5 s against an events table nothing ever prunes.

**Where.** `services/backend/arm_backend/notification_dispatcher.py:185-196` at `2625b3e7` (`select(Event).where(event_type in NOTABLE)` with no `notified_at IS NULL`, then `unsent = [e for e in candidates if e.notified_at is None]`, every `ARM_NOTIFICATION_DISPATCH_INTERVAL_SECONDS=5`); `services/backend/arm_backend/routers/system.py:272-286` (`select(Job)` and `select(Event)` unfiltered, with the comment "Fetch all events and filter in Python — mirrors the notification_dispatcher pattern to stay compatible with the in-memory FakeSession (which cannot evaluate .is_(None) clauses)"); `services/backend/arm_backend/routers/notifications.py:651-655, 663-667, 677, 698` (`limit` applied after loading every inbox row).

**What.** Every rip/session completion adds notable events that are never deleted except by job CASCADE, so each dispatcher tick and each stats call grows linearly with history (JSONB payloads included). This is production query shape dictated by a test fake, the inverse of the "fake only the I/O boundary" rule in CLAUDE.md; the fix is to teach `tests/_fakes.py` `is_(None)` / `.limit()` rather than keep the scans.

**Repro / evidence.** Code hunks above; `grep -rn "delete(Event" services/backend/arm_backend` -> no results (no pruning path).

**Suggested fix location.** `services/backend/tests/_fakes.py` (`_matches`: support `IS NULL`, `limit`), then `notification_dispatcher.py::_tick` (`.where(col(Event.notified_at).is_(None))`), `routers/system.py::stats` (COUNT/GROUP BY), `routers/notifications.py` inbox queries (`.limit()` / `.where(cleared == False)`).

**Verification.** code read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/166

### D-169  S4  open  docs  slice B5

**Title.** `05-cross-cutting.md` describes an authentication model the code does not implement: argon2 parameters, "random generated password", a config-redacting logging helper, and claim-checked transcoder subscriptions.

**Where.** `docs/developers/architecture/05-cross-cutting.md:99` at `2625b3e7` ("OWASP-default parameters (memory=19 MiB, iterations=2, parallelism=1)") vs `services/backend/arm_backend/routers/auth.py:251` / `routers/users.py:335` / `seeders.py:55` (`PasswordHasher()` defaults: time_cost=3, memory_cost=64 MiB, parallelism=4 on argon2-cffi 25.1.0); `:101` ("closed by the random generated password") vs `:90` and `seeders.py:46,58` (default `admin`/`admin` + must-change); `:201` ("enforced by a structured-logging helper that knows which fields to drop") vs `packages/arm_common/arm_common/logging.py` (no redaction code; `grep -rn redact packages/arm_common` is empty); `:191` and `docs/developers/architecture/03-protocol.md:96` ("only the transcoder holding the claim may subscribe") vs `services/backend/arm_backend/ws/authz.py:43` (compares the topic id to the self-asserted `X-ARM-Task-Id` header only, no `TranscodeTask.claimed_by` check as `can_publish` does at `:65-72`).

**What.** Four statements in the authoritative architecture doc are false for the as-built code (`feedback_docs_describe_current_state.md`). The argon2 and password lines contradict each other inside the same section; the logging-helper line claims an enforcement mechanism that does not exist; the claim-check line promises an authz guarantee the code only makes for publish.

**Repro / evidence.** `uv run python -c "import argon2; h=argon2.PasswordHasher(); print(h.time_cost, h.memory_cost, h.parallelism)"` -> `3 65536 4`; grep results above; `authz.py:43` hunk: `return prefix == "transcoder.commands" and scope is not None and scope == principal.task_id`.

**Suggested fix location.** `docs/developers/architecture/05-cross-cutting.md` (and `03-protocol.md:96`) — state the real parameters and gates; or, for the transcoder line, add the `claimed_by == principal.hostname` lookup in `ws/authz.py::can_subscribe` to match the doc.

**Verification.** code read + interpreter output.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/167

### D-170  S2  untested-needs-hardware  ripper  slice R1

**Title.** `pickup` / `resume_inflight_job` / `recover_held_job` claim the caller's long-lived task as `_active_task`: a re-acquired rip runs inside the heartbeat loop (no heartbeats for hours) and `job.abandoned` cancels the heartbeat loop (or `amain`/`poll_loop`) for good.

**Where.** `services/ripper/arm_ripper/job_controller.py:219` (`pickup`), `:774` (`recover_held_job`), `:804` (`resume_inflight_job`) at `2625b3e7`; callers `main.py:124` (`maybe_reacquire_current_job`, awaited inline from `heartbeat_loop` at `main.py:158`), `main.py:287` and `main.py:496` (`boot_probe` awaited from `_on_reattached` inside `poll_loop`, and from `amain`), `recovery.py:88`. Cancel site `job_controller.py:284`.

**What.** `_active_task = asyncio.current_task()` is correct for `_run_pipeline` (its own task) but in `pickup`/`resume_inflight_job`/`recover_held_job` the current task is whoever awaited it: the heartbeat task, the poll-loop task or `amain` itself. Two consequences: (1) while a heartbeat-reacquired rip runs (IDENTIFIED job resolved after the 30-min park, the common post-review path), `heartbeat_loop` is blocked, so no `/api/ripper/heartbeat` is posted for the whole rip: `media_status_at`/`last_seen_at` age past the 90 s manual-trigger window (`routers/jobs.py:135`) and the 5-min diagnostic window (`routers/drives.py:36,150-152`, "media-status heartbeat is stale") and the online/stale badge counts the ripping drive as stale. (2) Abandoning that job from the UI emits `job.abandoned`; `_handle_abandon` cancels `_active_task`, i.e. the heartbeat task: `heartbeat_loop` has no `CancelledError` handling, so it dies silently (no log, cancelled tasks are not reported) and the drive never heartbeats or re-acquires again until the container restarts. For a boot-probe/reattach resume the cancelled task is `amain`/`poll_loop`: `boot_probe` and `_on_reattached` only catch `Exception`, so `asyncio.run` raises `CancelledError` and the ripper process exits non-zero (restart-policy churn on an operator abandon). Expected: the pipeline runs in its own task (as `_run_pipeline` does via `asyncio.create_task` in the poll loop) so abandon cancels only the rip and the heartbeat/poll loops keep running.

**Repro / evidence.**

```
ARM_DRIVE_ID=d1 ARM_BACKEND_URL=https://x ARM_SERVICE_TOKEN=t ARM_DRIVE_DEV=/dev/sr0 \
  uv run python .../sweep2/R1/repro_heartbeat_pickup.py
heartbeats during the re-acquired rip: 0 (expected ~20)
controller._active_task is the heartbeat task: True
heartbeat task after abandon: done=True cancelled=True
boot-probe resume: controller._active_task is the outer (amain/poll-loop) task: True
outer task after abandon: done=True cancelled=True
```
`tests/test_heartbeat_reprobe.py:22` fakes `pickup`, so no test runs the real claim path from the heartbeat loop.

**Suggested fix location.** `services/ripper/arm_ripper/job_controller.py` — have `pickup`/`resume_inflight_job`/`recover_held_job` spawn the rip with `asyncio.create_task` (and register that task as `_active_task`) or have `main.py` wrap the calls in a task; `heartbeat_loop` should at minimum shield itself.

**Verification.** scratch repro above against the real `heartbeat_loop`, `boot_probe`, `JobController._handle_abandon`; drive-level symptom (stale badge, dead heartbeat after abandon) untested-needs-hardware: `devtools/iso-smoke.sh` then hold a disc in review until the 30-min park expires, Start from the UI, then Abandon mid-rip and watch `drive.media_status_at` stop advancing.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/168

### D-171  S2  untested-needs-hardware  ripper  slice R1

**Title.** `_tNN.mkv` files are paired with eligible titles by list position, so one title that produces no file shifts every later title onto the wrong file (track A credited with title B's mkv, B marked FAILED).

**Where.** `services/ripper/arm_ripper/rip/makemkv_rip.py:676` (`zip(eligible, output_files)`) and `services/ripper/arm_ripper/rip/dispatcher.py:362-377` (`position = eligible_source_indexes.index(title_idx)`; `files[position]`) at `2625b3e7`.

**What.** MakeMKV's `_tNN` suffix is the title's number in its (minlength-filtered) list and does not renumber when a title fails to save (`MSG:5003`); the repo relies on exactly that in `_delete_skipped_outputs` (`dispatcher.py:502-512`, "Matched by their `_tNN` position suffix, not by list order, so a title that produced no file never shifts the others"). But both attribution paths index the sorted file list by position: with eligible `[0,1,2]` and files `_t00`, `_t02` (title 1 unreadable on a scratched disc), source title 1 is PATCHed DONE with `_t02.mkv` (wrong content, wrong duration carried from the scan, wrong naming downstream) and title 2 is FAILED "produced no .mkv". The live `_on_title_done` path has the same shift (and also fires while the next title's file already exists). Expected: match on the parsed `_tNN` number (`_OUTPUT_FILE_RE` already extracts it) exactly as `_delete_skipped_outputs` does.

**Repro / evidence.**

```
uv run python .../sweep2/R1/repro_positional_attr.py
source title 0: ok=True file=Disc_t00.mkv err=None
source title 1: ok=True file=Disc_t02.mkv err=None        <- wrong file
source title 2: ok=False file=None err=makemkvcon exited 0 but produced no .mkv for this title
```
No test covers a gap in the output numbering (`grep -n t02 services/ripper/tests/*.py` shows only contiguous fixtures).

**Suggested fix location.** `services/ripper/arm_ripper/rip/makemkv_rip.py` (`rip_disc` attribution) and `rip/dispatcher.py` (`_on_title_done`) — build `{int(_OUTPUT_FILE_RE): path}` and look up `eligible.index(title_idx)` in it.

**Verification.** scratch repro (stubbed makemkvcon, real `rip_disc`); that MakeMKV leaves the hole is untested-needs-hardware (a disc with one unreadable title; `MSG:5003` in the per-job log, then compare `title_tNN` numbers against `tracks.output_path`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/169

### D-172  S3  open  ripper  slice R1

**Title.** `_run_makemkvcon` cancels the streamer in `finally` before the "drain" await, so robot lines still in the pipe at exit are dropped: MSG:5003 per-title fail reasons and MSG:1002/5037 diagnostics go missing from the error text.

**Where.** `services/ripper/arm_ripper/rip/makemkv_rip.py:542-557` at `2625b3e7` (`finally: ... streamer.cancel()` at `:551`, then `await streamer` with the comment "Drain the streamer so every line after EOF is processed" at `:553-557`).

**What.** `proc.wait()` resolves when makemkvcon exits; the streamer task is then cancelled unconditionally, so whatever it has not yet consumed (the final `MSG:5003 Failed to save title N`, `MSG:1002 Error while reading input`, `MSG:5037 Copy complete ... failed`) is never parsed. The comment describes draining to EOF, which the code does not do. Effects: a failed title's `last_error` is the generic "makemkvcon exited 0 but produced no .mkv" instead of MakeMKV's reason, and a non-zero exit reports `makemkvcon failed: exit=1` with no diagnostics. Any awaiting progress callback (the WS publish in production) widens the window to near-certain loss.

**Repro / evidence.**

```
uv run python .../sweep2/R1/repro_streamer_race.py     # bare robot tail, exit 0
3/40 runs lost the MSG:5003 fail_reason (titles seen: [0, 1])
uv run python .../sweep2/R1/repro_streamer_drain.py    # on_disc_progress awaits 0.5 ms, exit 1
DIAGNOSTICS LOST -> makemkvcon failed: exit=1 | titles: {}
20/20 runs lost trailing diagnostics
```

**Suggested fix location.** `services/ripper/arm_ripper/rip/makemkv_rip.py` `_run_makemkvcon` — on a normal exit await the streamer to EOF (stdout closes when the process exits) and cancel it only on timeout/stop/cancel.

**Verification.** scratch repros above with real `sh` subprocesses and the real `_run_makemkvcon`/`_stream_output`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/170

### D-173  S3  untested-needs-hardware  transcode  slice R1

**Title.** WS `task.cancel` never stops the encoder: `CancelRequested` raised from the progress callback is swallowed by the engines' `except Exception`, so every cancel falls through to the backend's 10 s grace + docker-stop and the "cancelled by user" `/fail` is never sent.

**Where.** `services/transcode/arm_transcode/handbrake.py:188-191` and `services/transcode/arm_transcode/ffmpeg_progress.py:51-54` at `2625b3e7`; raiser `main.py:104-109` (`_on_progress`), handler `main.py:238-241`.

**What.** `main._on_progress` raises `CancelRequested` (a plain `Exception` subclass) when `cancel_event` is set; `_process_progress_line` and `consume_progress` wrap the callback in `except Exception: logger.debug(...)`, so the encode continues to completion. The backend (`transcode_dispatcher.py:1372-1430`) waits `_CANCEL_GRACE_SECONDS=10` for a graceful `/fail`, then `container.stop(timeout=5)` SIGTERMs python (no handler, dies at once), the `atomic_output` cleanup never runs and the `.arm-inprogress` partial stays in `/media` until the startup sweep. MASTER plan line 180 and `03-protocol.md:96` describe `task.cancel` as the graceful path; it is dead. Expected: `CancelRequested` propagates (re-raise it, or check `cancel_event` in the engine loop) and the engine kills its subprocess.

**Repro / evidence.**

```
uv run python .../sweep2/R1/repro_cancel_swallowed.py
handbrake: consume_progress returned normally; callback invoked for pcts [1, 2, 3] -> cancel swallowed
ffmpeg: consume_progress returned normally; callback invoked for pcts [10, 20] -> cancel swallowed
```
No transcode test exercises cancel (`grep CancelRequested services/transcode/tests` -> only `asyncio.Event()` placeholders in `test_main.py`).

**Suggested fix location.** `services/transcode/arm_transcode/handbrake.py` / `ffmpeg_progress.py` (re-raise `CancelRequested`; kill `proc` in a `finally`), or `main.py` (make `CancelRequested` a `BaseException`).

**Verification.** scratch repro above against the real `_consume_progress`/`consume_progress`; end-to-end untested-needs-hardware: start a transcode, Cancel in the UI, observe the backend log "force-stopping unresponsive transcoder" every time.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/171

### D-174  S3  untested-needs-hardware  ripper  slice R1

**Title.** `rip_cd` kills only the `abcde` shell script on abandon/timeout; its `cdparanoia`/`flac` children keep reading the drive and writing into the (already rmtree'd) raw dir.

**Where.** `services/ripper/arm_ripper/rip/abcde_rip.py:175-178` at `2625b3e7` (`proc.kill()` with no process group / `killpg`; spawn at `:126-131` has no `start_new_session`).

**What.** `abcde` is a bash script that forks `cdparanoia` per track (and `flac`/`move` steps). On `job.abandoned` the pipeline task is cancelled, `proc.kill()` SIGKILLs bash only; the running `cdparanoia` is orphaned to tini and continues ripping the current track, holding the device (the abandon-eject at `job_controller.py:304` then gets EBUSY through all four retries) and writing into unlinked files after `_handle_abandon` wiped `/raw/<job_id>`. Same class as closed D-040 (hooks), different site; the makemkvcon/dd paths are single processes and unaffected.

**Repro / evidence.** code hunk `abcde_rip.py:175-178`:
```python
if proc.returncode is None:
    proc.kill()
    with contextlib.suppress(BaseException):
        await proc.wait()
```

**Suggested fix location.** `services/ripper/arm_ripper/rip/abcde_rip.py` — spawn with `start_new_session=True` and `os.killpg(proc.pid, SIGKILL)` on kill.

**Verification.** untested-needs-hardware: insert an audio CD, Abandon mid-rip, `docker top <ripper>` shows `cdparanoia` still running and `eject` fails EBUSY.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/172

### D-175  S4  untested-needs-hardware  ripper  slice R1

**Title.** Multi-GB raw-dir `shutil.rmtree` runs synchronously on the event loop in the WS abandon handler, the boot probe and the backup rip (same class as closed D-108, which fixed only `_scan_extracted`).

**Where.** `services/ripper/arm_ripper/job_controller.py:288` (`_handle_abandon`, called synchronously from `on_ws_command`), `services/ripper/arm_ripper/recovery.py:34` (`wipe_raw_dir`), `services/ripper/arm_ripper/rip/makemkv_backup.py:38` at `2625b3e7`.

**What.** Deleting a 50-100 GB `/raw/<job_id>` (or a previous `backup/` tree) blocks the loop for the unlink duration (seconds on NFS/btrfs), stalling the WS receive loop (commands are dropped by the hub while unread), heartbeat and poll ticks. `iso_extract.discard_all` already does this via `asyncio.to_thread` (`iso_extract.py:209`).

**Repro / evidence.** `job_controller.py:288 shutil.rmtree(target)` inside a method documented as "Runs synchronously from the WS handler".

**Suggested fix location.** the three call sites — `await asyncio.to_thread(shutil.rmtree, ...)` (make `_handle_abandon` schedule the wipe as a task).

**Verification.** by inspection; latency untested-needs-hardware (abandon a 50 GB BD job on an NFS raw mount and time the WS gap).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/173

### D-176  S4  open  docs  slice R1

**Title.** Protocol doc says there is no ripper heartbeat and no timeout-based liveness, while the ripper posts `/api/ripper/heartbeat` every 30 s and the backend derives ONLINE/OFFLINE and "stale" notes from it.

**Where.** `docs/developers/architecture/03-protocol.md:42` and `:117` at `2625b3e7`; code `services/ripper/arm_ripper/main.py:35,127-167`, `services/backend/arm_backend/routers/ripper.py:328-363`, `routers/drives.py:36,150-154`.

**What.** The doc states "There is no ripper heartbeat endpoint ... No heartbeat at all. Crash detection is handled at container-restart time". The ripper's `heartbeat_loop` posts media status every `HEARTBEAT_INTERVAL_SECONDS=30`, the backend sets `present`/`OFFLINE` from DETACHED beats and flags 5-min-stale beats in the diagnostic. Per `feedback_docs_describe_current_state.md` the section should describe the current contract.

**Repro / evidence.** `grep -n -i heartbeat docs/developers/architecture/03-protocol.md` -> lines 42, 117 vs `main.py:127`.

**Suggested fix location.** `docs/developers/architecture/03-protocol.md` — rewrite the two paragraphs.

**Verification.** by inspection.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/174

### D-177  S4  open  ripper  slice R1

**Title.** makemkvcon and dd failure excerpts keep the first 400 chars of stderr, not the tail, unlike every other engine (and the transcoder's own `_clip_error` rationale).

**Where.** `services/ripper/arm_ripper/rip/makemkv_rip.py:575` and `services/ripper/arm_ripper/rip/data_rip.py:102` at `2625b3e7` (`stderr.decode(...).strip()[:400]`); compare `abcde_rip.py:197` (`[-400:]`), `handbrake.py:105`, `ffmpeg_audio.py:88`, `transcode/main.py:59-68`.

**What.** When makemkvcon/dd exit non-zero with more than 400 chars on stderr, the decisive last line is cut off `last_error`. Low impact for makemkvcon (robot mode puts diagnostics on stdout, see C3) but the convention is inconsistent and the transcoder docstring records why the head is the wrong end.

**Repro / evidence.** `makemkv_rip.py:575 msg = stderr.decode(errors="replace").strip()[:400] or f"exit={proc.returncode}"`.

**Suggested fix location.** the two lines — `[-400:]`.

**Verification.** by inspection.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/175

### D-178  S4  open  transcode  slice R1

**Title.** `ffmpeg_audio.py` comment points at a module that does not exist (`ffmpeg_video.py`).

**Where.** `services/transcode/arm_transcode/ffmpeg_audio.py:30` at `2625b3e7`.

**What.** "Same shape as ffmpeg_video.py" — the video engine is `engines/ffmpeg_vaapi.py`; `ls services/transcode/arm_transcode/ffmpeg_video.py` -> No such file.

**Repro / evidence.** `grep -rn ffmpeg_video services/` -> only this comment.

**Suggested fix location.** `services/transcode/arm_transcode/ffmpeg_audio.py:30`.

**Verification.** by inspection.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/176

### D-179  S3  untested-needs-hardware  common  slice C1

**Title.** `atomic_output` never fsyncs the output and fsyncs the directory *before* the rename, so the documented "write, fsync, rename" durability does not exist.

**Where.** `packages/arm_common/arm_common/fileops.py:80-86` at `2625b3e7`; claim at `fileops.py:3-4` and `docs/developers/architecture/02-job-lifecycle.md:351`.

**What.** The helper opens the parent directory, `fsync`s it, then `os.replace(tmp_path, final_path)`. A directory fsync before the rename makes nothing about the rename durable, and the data file itself is never fsynced by the helper or by any caller (`services/transcode/arm_transcode/main.py:124/142/158` just run HandBrake/abcde into `tmp`). On power loss right after the task is reported complete the directory may still hold `<final>.arm-inprogress` (or a truncated final), the DB says `done`, and the documented startup sweep deletes any `.arm-inprogress` whose task is not `in_progress`: the output is gone while the task reads done. Should be: fsync the file (or document that it is not), rename, then fsync the directory.

**Repro / evidence.**

```python
# fileops.py:80-86
# Best-effort fsync of the directory so the rename is durable on crash.
fd = os.open(str(final_path.parent), os.O_RDONLY)
try:
    os.fsync(fd)
finally:
    os.close(fd)
os.replace(tmp_path, final_path)
```
`02-job-lifecycle.md:351`: "The transcoder writes to `<final>.arm-inprogress` in the final directory, `fsync`s, then `rename(2)`".

**Suggested fix location.** `packages/arm_common/arm_common/fileops.py` `atomic_output` (and the copy fallback of `transcode_none`): fsync `tmp_path` before the rename, fsync the directory after it; or drop the durability claim from the docstring and 02-job-lifecycle.md.

**Verification.** code reading + docs; crash-window itself untested-needs-hardware (`devtools/crash-drill.sh` only covers the backend, not a power cut).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/177

### D-180  S3  open  migrations  slice C1

**Title.** `jobs.metadata_json` and `drives.rip_params_json` are JSONB in the database but `JSON` in the models; 0031's comment states the opposite of what 0001 created.

**Where.** `packages/arm_common/arm_common/models/job.py:70`, `models/drive.py:94` (`Column(JSON, ...)`) vs `services/backend/migrations/versions/0001_initial.py:99-103,126-131` (`_jsonb()`); wrong comment at `0031_job_identity_columns.py:63-64`.

**What.** The brief's model/migration-agreement invariant is violated for two columns: Alembic autogenerate reports a type change for both, `Job.metadata_json` cannot use JSONB operators in SQLAlchemy expressions although the column is JSONB, and the e2e harness's "swap JSONB->JSON for SQLite" step (memory `project_backend_test_harness`) does not see these columns at all, so tests exercise a declared type that prod never has. 0031 asserts "metadata_json is a JSON (not JSONB) column: `->>` works directly, but key deletion needs a jsonb round-trip" and casts `metadata_json::jsonb` everywhere; 0001 created it `JSONB NOT NULL DEFAULT '{}'::jsonb`. No runtime failure today (Postgres assignment-casts json->jsonb), but every reviewer and every future migration is being told the wrong type.

**Repro / evidence.**

```
$ uv run python sweep2/C1/compare_schema.py
drives.rip_params_json: type: migration='JSONB' model='JSON'
jobs.metadata_json: type: migration='JSONB' model='JSON'
```

**Suggested fix location.** `packages/arm_common/arm_common/models/job.py`, `models/drive.py` (declare `postgresql.JSONB` like `Event.payload_json`, `Config.setup_progress`) and fix the 0031 comment; the e2e harness swap then covers them automatically.

**Verification.** scratch comparison script above; `0001_initial.py:99-103,126-131` read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/178

### D-181  S3  untested-needs-hardware  common  slice C1

**Title.** `IdentificationMode` is written by the rip-preset API and seeders but read by nothing; the UI offers "Deferred placeholder" (and Required/Skip) as a rip-preset setting that has no effect.

**Where.** `packages/arm_common/arm_common/enums.py:188-191` at `2625b3e7`; the only non-seed writer is `services/backend/arm_backend/routers/rip_presets.py:85`; UI option at `services/ui-neu/frontend/src/lib/components/RipPresetForm.svelte:153`.

**What.** `rg identification_mode services/backend/arm_backend services/ripper/arm_ripper` finds only the create path and seeders; no identify/rip code branches on `RipPreset.identification_mode`, and `IdentificationMode.DEFERRED_PLACEHOLDER` has zero references anywhere (`enum_usage.py`). Identify behaviour is actually driven by `Config.block_on_miss` (and the placeholder path by `metadata_json.flags.unidentified`). An operator who sets a preset to "Skip" or "Deferred placeholder" gets exactly the "Required" behaviour, with no error and no hint. Should either be wired into identify (the ripper/backend choose block vs placeholder per preset) or removed from the schema/UI.

**Repro / evidence.**

```
$ rg -n "identification_mode" services/backend/arm_backend services/ripper/arm_ripper --glob '*.py' | grep -v seeders.py
services/backend/arm_backend/routers/rip_presets.py:85:        identification_mode=req.identification_mode,
$ uv run python sweep2/C1/enum_usage.py | grep Identification
IdentificationMode.DEFERRED_PLACEHOLDER         py=  0 literal=  5   (all 5 literals are UI option/test strings)
```

**Suggested fix location.** `services/backend/arm_backend/routers/ripper.py` identify (consume the routed rip preset's mode) or remove the field from `RipPresetCreateRequest`/`RipPresetForm.svelte`; cross-slice (backend B*, ui-neu) decision.

**Verification.** grep + enum audit; behaviour untested-needs-hardware (`devtools/iso-smoke.sh` with a preset set to `skip` would show identify still blocking on a miss).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/179

### D-182  S3  open  common  slice C1

**Title.** `move_tree` (DISC_BACKUP passthrough) copies straight into the final folder with no staging: a copy error or a backend crash mid-copy leaves a partial `/media/<Title>` tree, and the helper's own `dst.exists()` guard then refuses every retry.

**Where.** `packages/arm_common/arm_common/fileops.py:197-198,211-217` at `2625b3e7`.

**What.** Across mounts `shutil.move` runs `copytree(..., copy_function=copy)`; `copytree` collects per-file `OSError`s (ENOSPC, EIO, a permission error on one file) and raises `shutil.Error` after the walk, so a half-copied `/media/<Title>/BDMV/...` stays on disk while the source is kept; only `CopyCancelled` is caught and `rmtree`d. The same partial tree is left when the backend dies during the minutes-long copy: the task stays IN_PROGRESS with `claimed_by=backend-inprocess`, `sweep_stale_claims` re-queues it after 90 s, and the re-run hits `FileExistsError("destination already exists")` at `fileops.py:197-198` "whatever the session's overwrite flag" (`passthrough_executor.py:235-242` turns that into a FAILED task). So the folder backup is unrecoverable without a manual delete, and a library scanner indexes the truncated disc folder meanwhile. `transcode_none` stages at `<final>.arm-inprogress` and cleans up on `BaseException`; the folder path should mirror it (copy into `<dst>.arm-inprogress` and `os.replace`, or `rmtree(dst)` on any exception). Reported independently by the B3 and C1 reviewers; merged here.

**Repro / evidence.**

```
$ uv run python scratchpad/sweep2/B3/repro_retry_summary.py   # partial dst dir, then move_tree(src, dst)
re-run after crash -> FileExistsError destination already exists: /tmp/.../media/BACKUP
```
`fileops.py:211-217`: `try: shutil.move(src, dst, copy_function=copy) except CopyCancelled: shutil.rmtree(dst, ignore_errors=True); raise` — no other exception cleans up.

**Suggested fix location.** `packages/arm_common/arm_common/fileops.py` `move_tree`: `except BaseException: shutil.rmtree(dst, ignore_errors=True); raise` (the rename branch never raises after creating `dst`), or copy to `dst.with_name(dst.name + INPROGRESS_SUFFIX)` and `os.replace` into place.

**Verification.** B3 scratch repro of the retry path (zero-infra); the crash sequence itself is untested-needs-hardware: `bash devtools/iso-smoke.sh` with a backup-mode session on a cross-mount `/raw`->`/media`, `docker kill -s KILL arm-backend` during the copy, restart, wait 100 s, read `last_error`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/180

### D-183  S4  open  common  slice C1

**Title.** The OpenAPI wire contract declares no `securitySchemes` and no `security` on any operation, so the snapshot/TS types describe every endpoint (including `/api/ripper/*`, `/api/transcoder/*`, config, users) as unauthenticated.

**Where.** `services/ui-neu/openapi.snapshot.json` (`components` lacks `securitySchemes`; 158 operations without `security`); cause in `services/backend/arm_backend/auth.py:42-45` (`_extract_bearer(authorization: str | None)` from a plain header dependency, no `fastapi.security` scheme).

**What.** The snapshot is the artefact CI gates on and the UI generates from; it currently cannot tell a reader which routes need the JWT, the service token, or nothing (compare the unauthenticated `GET /api/setup/status` with `GET /api/config`). Any generated client or contract test that reads `security` concludes auth is optional everywhere. Should declare `HTTPBearer` (JWT) and an `APIKeyHeader`/bearer scheme for the service token and attach them via the auth dependencies so the contract carries the requirement.

**Repro / evidence.**

```
$ uv run python sweep2/C1/openapi_check.py | sed -n '/security schemes/,/operations without/p'
== security schemes / unauth routes
null
  158 operations without `security`:
```

**Suggested fix location.** `services/backend/arm_backend/auth.py` (use `fastapi.security.HTTPBearer(auto_error=False)` inside `require_jwt`/`require_service_token`) then `bash devtools/regen-openapi-snapshot.sh` + codegen; cross-slice with the backend auth owner.

**Verification.** scratch audit script over the committed snapshot.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/181

### D-184  S4  open  common  slice C1

**Title.** `CONFIG_FIELD_META` hard-codes the member lists of `PreviouslyRippedAction` and the `metadata_provider` set with no guard that they track the enums.

**Where.** `packages/arm_common/arm_common/config_metadata.py:190` (`enum_values=["hold", "reject", "rip"]`), `:45` (`["tmdb", "omdb"]`, duplicated at `services/backend/arm_backend/routers/config.py:167`); guard test `packages/arm_common/tests/test_config_metadata.py:68-80` only checks labels cover values.

**What.** `on_previously_ripped` is typed `PreviouslyRippedAction` on `ConfigUpdateRequest` (`schemas/auth.py:555`), so adding a member to the enum without touching this list leaves the Settings/setup UI unable to offer it, and nothing fails. The `episode_sources` list is already asserted by value (`test_config_metadata.py:88`); the two enum fields are not.

**Repro / evidence.** `rg -n "enum_values" packages/arm_common/tests/test_config_metadata.py` shows no comparison against `PreviouslyRippedAction`.

**Suggested fix location.** `config_metadata.py` (`enum_values=[m.value for m in PreviouslyRippedAction]`) or a one-line assertion in `packages/arm_common/tests/test_config_metadata.py`.

**Verification.** code reading + grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/182

### D-185  S4  untested-needs-hardware  migrations  slice C1

**Title.** `disc_fingerprints.created_at` is nullable with no default in the schema, NOT NULL `now()` in the model, so every fingerprint row on Postgres has `created_at = NULL`.

**Where.** `services/backend/migrations/versions/0006_disc_fingerprints.py:43` vs `packages/arm_common/arm_common/models/disc_fingerprint.py:53` (`created_at_column()`, `_columns.py:95-96`).

**What.** SQLModel omits an unset server-defaulted column from the INSERT and relies on the DB default; 0006 created the column `nullable=True` with no `server_default`, so Postgres stores NULL. `DiscFingerprintView.created_at` (`schemas/jobs.py:150`) therefore serialises as `null` for every real deployment, while the SQLite tier-2 harness (built from `SQLModel.metadata`) shows a timestamp: a test can pass on a value production never has. Model says the column is NOT NULL, which is false in the live schema.

**Repro / evidence.**

```
$ uv run python sweep2/C1/insert_probe.py
INSERT INTO disc_fingerprints (id, job_id, algo, value) VALUES (?, ?, ?, ?) RETURNING created_at
$ uv run python sweep2/C1/compare_schema.py
disc_fingerprints.created_at: nullable: migration=True model=False; default: migration=None model='now()'
```

**Suggested fix location.** New Alembic revision: `UPDATE disc_fingerprints SET created_at = now() WHERE created_at IS NULL`, then `ALTER ... SET DEFAULT now(), SET NOT NULL` (model already matches the intended shape).

**Verification.** scratch scripts above (zero-infra); live NULLs untested-needs-hardware (`psql -c "select count(*) from disc_fingerprints where created_at is null"`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/183

### D-186  S4  open  migrations  slice C1

**Title.** Index inventory drifts between the live schema and the models: three DB-only indexes, one model-only index, and the `uq_transcode_tasks_output_path_live` partial unique index exists only in 0001, so the e2e harness never enforces it.

**Where.** `services/backend/migrations/versions/0001_initial.py:314-332` (composite + partial unique indexes), `0015_notification_channels.py` (`ix_notification_dispatch_log_channel_id`, `ix_notification_dispatch_log_created_at`), `0016_notification_inbox.py` (`ix_notification_inbox_created_at`) vs `packages/arm_common/arm_common/models/transcode_task.py:28-35` (`index=True` on `status` -> `ix_transcode_tasks_status`, which the DB does not have), `models/notification_dispatch_log.py`, `models/notification_inbox.py` (no indexes).

**What.** Alembic autogenerate against head is not clean (it would drop three indexes and add one), and the "only one live task can own an output_path" guarantee is a DB-only fact: `SQLModel.metadata.create_all` in `tests/e2e` builds `transcode_tasks` without `uq_transcode_tasks_output_path_live`, so a regression in the collision logic that relies on that constraint cannot surface in the zero-infra tier.

**Repro / evidence.**

```
$ uv run python sweep2/C1/compare_schema.py
notification_dispatch_log INDEX ix_notification_dispatch_log_channel_id: migration=(('channel_id',), False) model=None
notification_dispatch_log INDEX ix_notification_dispatch_log_created_at: migration=(('created_at',), False) model=None
notification_inbox INDEX ix_notification_inbox_created_at: migration=(('created_at',), False) model=None
transcode_tasks INDEX ix_transcode_tasks_status: migration=None model=(('status',), False)
transcode_tasks INDEX ix_transcode_tasks_status_heartbeat: migration=(('status', 'claim_heartbeat_at'), False) model=None
transcode_tasks INDEX uq_transcode_tasks_output_path_live: migration=(('output_path',), True) model=None
```

**Suggested fix location.** `packages/arm_common/arm_common/models/transcode_task.py` (`__table_args__` with the composite `Index` and the partial unique `Index(..., unique=True, postgresql_where=...)`, drop `index=True` on `status`), `models/notification_dispatch_log.py`, `models/notification_inbox.py` (declare the three indexes).

**Verification.** scratch comparison script.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/184

### D-187  S4  open  common  slice C1

**Title.** "Enums are validated at write time in the SQLModel/Pydantic layer" is claimed in three places but nothing validates: `_StrEnumString.process_bind_param` stringifies any value and SQLModel table models skip validation.

**Where.** `packages/arm_common/arm_common/models/_columns.py:30-35` (`return str(value)`), claim at `services/backend/migrations/versions/0001_initial.py:3-5`, `docs/developers/architecture/04-data-model.md:13`, `.claude/memory/feedback_db_enums_as_varchar.md`.

**What.** The VARCHAR-enum convention explicitly trades DB enforcement for app-layer validation, but the app layer has none at the model boundary: a `Job`/`Drive`/`Track` instance accepts any string for an enum column and the bind processor writes it verbatim. Today every write path happens to go through a typed request schema or an enum member, so there is no observed bad row, but the stated guardrail does not exist and the one cheap place to add it (the bind processor) is the place that currently widens.

**Repro / evidence.**

```
$ uv run python sweep2/C1/validate_probe.py
Job constructed with bogus enums, no error: bogus nope xx
assignment accepted: also_bogus
bind param of bogus: garbage
```

**Suggested fix location.** `packages/arm_common/arm_common/models/_columns.py` `_StrEnumString.process_bind_param`: coerce through `self._enum_cls(value)` and raise on an unknown value (keep the tolerant *read* path), then the doc claims become true; or reword 04-data-model.md/0001/memory to "validated by the request schemas".

**Verification.** scratch probe above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/185

### D-188  S4  open  common  slice C1

**Title.** `_StrEnumString` sets `cache_ok = True` without exposing `enum_cls` to the cache key, so every enum column type shares one SQL-compilation cache key.

**Where.** `packages/arm_common/arm_common/models/_columns.py:24-28` at `2625b3e7`.

**What.** SQLAlchemy builds a `TypeDecorator`'s cache key from constructor-argument names found in `__dict__`; the class stores the argument as `_enum_cls`, so the key is `(_StrEnumString,)` for `JobStatus`, `DriveStatus`, `MediaType`, ... alike. Two statements that differ only in the enum type of a bound literal compile to the same cached form. ORM statements include the Column in the key so no symptom is observed today; it is a latent misuse of `cache_ok` (SQLAlchemy requires either same-named attributes or `cache_ok = False`).

**Repro / evidence.**

```
$ uv run python sweep2/C1/cache_probe.py
cache keys equal across enum classes: True (<class 'arm_common.models._columns._StrEnumString'>,)
stmt cache keys equal: True
```

**Suggested fix location.** `_columns.py`: store the argument as `self.enum_cls` (same name as the `__init__` parameter) or set `cache_ok = False`.

**Verification.** scratch probe above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/186

### D-189  S4  open  migrations  slice C1

**Title.** Offline rendering (`alembic upgrade --sql`, the mode `env.py` and the migration tests use) crashes in 0032/0033 with `TypeError: 'NoneType' object is not iterable`; the chain test's comment says only 0011 blocks a full-range render.

**Where.** `services/backend/migrations/versions/0032_job_metadata_sections.py:97-98` and `0033_drop_metadata_mirrors.py:59-60` (`rows = bind.execute(...)`; `for job_id, md in rows`); comment at `services/backend/tests/test_migration_chain.py:71-74`; offline entry point `services/backend/migrations/env.py:29-37`.

**What.** In offline mode `op.get_bind()` is a mock connection whose `dialect.name` is `postgresql` (so the early return is not taken) and whose `execute()` returns `None`. Both migrations guard the dialect but not the mode, so any `--sql` render spanning 0032 fails, and no migration after 0031 can be covered by the `_render_sql` parity tests over a range that includes them (the existing tests stop at adjacent pairs 0034->0035, 0037->0038, 0038->0039, 0041->0042). Should check `context.is_offline_mode()` and return (the data lift cannot be rendered as SQL anyway).

**Repro / evidence.**

```
$ uv run python sweep2/C1/render.py 0030_drive_lifecycle 0033_drop_metadata_mirrors
  File ".../versions/0032_job_metadata_sections.py", line 98, in upgrade
    for job_id, md in rows:
TypeError: 'NoneType' object is not iterable
```

**Suggested fix location.** `0032_job_metadata_sections.py` / `0033_drop_metadata_mirrors.py` `upgrade()`: `if context.is_offline_mode() or bind.dialect.name != "postgresql": return`; update the comment in `test_migration_chain.py:71-74`.

**Verification.** scratch render above (zero-infra, uses the suite's own `_render_sql`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/187

### D-190  S4  open  backend  slice C1

**Title.** Backend statement coverage is 99% (32 missed statements in 9 files) against the documented 100%-statement policy; PR #110 brought it to 100% and the later fix sweeps regressed it.

**Where.** `uv run coverage run -m pytest && uv run coverage report -m` on `main` @ `2625b3e7`: `passthrough_executor.py:251-252,345,348,359-364`, `routers/config.py:320-322,336,340-341,402-404`, `transcode_dispatcher.py:812-814,831-832,850`, `auto_session.py:912-913`, `drive_scanner.py:91-92`, `utils.py:33-34`, `main.py:187`, `notifications/bash_runner.py:64`, `notifications/script_meta.py:144`.

**What.** CLAUDE.md and `docs/developers/architecture/09-testing.md` state the Backend holds 100% statement coverage with explicit, justified pragmas for anything unreachable; `test/backend-coverage-100` (#110) delivered that on 2026-10-10. The fix sweeps #259/#261/#262/#264 added branches (passthrough cancel paths, config validation, dispatcher cancel/release paths, bash runner process-group kill) without tests or pragmas, so 32 statements are now unexercised; CI measures but does not gate, so nothing flagged it. The misses sit exactly in the code those sweeps changed to fix S2/S3 defects, so the fixes themselves are untested.

**Repro / evidence.**

```
$ cd <main> && uv run coverage run -m pytest -q && uv run coverage report -m | grep -v 100%
TOTAL  11006  32  3354  40  99%
```

**Suggested fix location.** The nine files above: add tests for each listed line (or a justified `# pragma: no cover` where truly unreachable), then enable the `fail_under` ratchet the testing doc says is ready.

**Verification.** Measured by the coordinator on the full suite (3854 passed) at 2625b3e7.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/188

### D-191  S3  open  ui-neu  slice U1

**Title.** A wrong "current password" on /change-password (and Settings > Users, setup step 1) logs the operator out and bounces to /login; the API client treats every 401 as session expiry and discards the backend detail.

**Where.** `services/ui-neu/frontend/src/lib/api/client.ts:59-67` at `2625b3e7`; callers `src/routes/change-password/+page.svelte:17`, `src/lib/components/settings/ChangePasswordForm.svelte:65-69`; backend `services/backend/arm_backend/routers/auth.py:73-81`.

**What.** `POST /api/auth/password` answers 401 `"current password incorrect"` for a typo in the current password (auth.py:80-81), and `POST /api/auth/login` answers 401 `"invalid credentials"`. `handle()` fires `on401()` (logoutLocal + `goto('/login')`) before throwing, and throws the fixed message `'API 401: Unauthorized'` instead of `detail`. On /change-password a typo therefore clears the token and redirects to the login page with no message; on /login a bad password shows "API 401: Unauthorized" (and re-runs the logout/redirect handler) instead of "invalid credentials". A 401 from a credential endpoint is not a stale session.

**Repro / evidence.**

```
client.ts:59-67   if (res.status === 401) { on401(); ... throw new ApiError(401, 'API 401: Unauthorized', body); }
auth.py:80-81     raise HTTPException(401, detail="current password incorrect")
ChangePasswordForm.svelte:65-69   await changePassword(...) -> catch: error = err.message   (never rendered: the page is gone)
```
Manual: sign in, open /change-password, enter a wrong current password, submit: you land on /login logged out.

**Suggested fix location.** `src/lib/api/client.ts` `handle()`: only call `on401()` when the request carried a bearer token AND the path is not `/api/auth/login` / `/api/auth/password` (or let `apiFetch` take an `allow401` option that `auth.ts` sets), and surface `detail` for 401 like every other status. `auth.ts` is the natural place to opt the two credential calls out.

**Verification.** Code reading of client.ts + auth.py + ChangePasswordForm; no existing test covers a 401 from `changePassword`/`login` through the real client (login-page.test.ts mocks `login`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/189

### D-192  S3  open  ui-neu  slice U1

**Title.** Job detail "redirect to dashboard on 404" never fires: it string-matches `'404'` in a message the API client has replaced with the backend `detail` ("unknown job_id: ..."); both tests pass only because they throw their own `new Error('404 Not Found')`.

**Where.** `services/ui-neu/frontend/src/routes/jobs/[id]/+page.svelte:185-188` at `2625b3e7`; tests `src/routes/jobs/__tests__/job-detail-page.test.ts:167` and `src/routes/jobs/[id]/page.test.ts:195`; message source `src/lib/api/client.ts:70-79`; backend `services/backend/arm_backend/routers/jobs.py:386-387`.

**What.** `GET /api/jobs/{id}` 404s with `detail="unknown job_id: <id>"`; `handle()` sets `ApiError.message = detail`, so `e.message.includes('404')` is false and a deleted/bogus job id shows the LoadState error box ("unknown job_id: ...") and keeps the 5 s poll alive instead of `goto('/')`. Same class as closed D-059 (string-matching a status in a message the client rewrites).

**Repro / evidence.**

```
+page.svelte:185   if (e instanceof Error && e.message.includes('404')) { goto('/'); return; }
client.ts:70-73    const detail = body.detail; if (typeof detail === 'string') message = detail;
jobs.py:387        detail=f"unknown job_id: {job_id}"
page.test.ts:195   mockFetchJob.mockRejectedValueOnce(new Error('404 Not Found'));   // not what the client produces
```

**Suggested fix location.** `routes/jobs/[id]/+page.svelte` loadJob: `e instanceof ApiError && e.status === 404` (ApiError is already imported at line 6); change both tests to reject with `new ApiError(404, 'unknown job_id: job_1', null)`.

**Verification.** Code reading; vitest subset passes today (61/61) which is the point: the tests encode the wrong message shape.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/190

### D-193  S3  open  ui-neu  slice U1

**Title.** Notifications "Show dismissed" shows nothing after a reload: dismiss sets `cleared=true`, the inbox list omits cleared rows by default and the UI never asks for them.

**Where.** `services/ui-neu/frontend/src/routes/notifications/+page.svelte:28` at `2625b3e7`; `src/lib/api/notifications.ts:11-13`; backend `services/backend/arm_backend/routers/notifications.py:644-655`; test `src/routes/notifications/__tests__/notifications-page.test.ts:249-258`.

**What.** `filtered = showCleared ? notifications : notifications.filter(!seen)` only toggles rows already in memory. `fetchNotifications()` calls `/api/notifications/inbox` without `include_cleared=true`, and `list_inbox` drops `cleared` rows (every dismissed row, since `dismissNotification` PATCHes `seen+cleared`). So the checkbox only reveals rows dismissed during the current page visit; after navigation/reload "Show dismissed" lists nothing while "Purge Cleared" (from the count endpoint) still says there are N cleared rows. The test passes by seeding a `seen: true, cleared: false` row the UI never produces.

**Repro / evidence.**

```
notifications.ts:12   get('/api/notifications/inbox')          // no include_cleared
notifications.py:646  include_cleared: bool = Query(default=False)
notifications.py:653  if not include_cleared: rows = [r for r in rows if not r.cleared]
```
Dismiss a row, reload /notifications, tick "Show dismissed": empty list; header still offers "Purge Cleared".

**Suggested fix location.** `src/lib/api/notifications.ts` `fetchNotifications(includeCleared)` passing `?include_cleared=true` when the checkbox is on (or always, filtering client-side), and the page's `load()`/`showCleared` effect; update the test fixture to use `cleared: true`.

**Verification.** Code reading of page + API + router.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/191

### D-194  S3  untested-needs-hardware  ui-neu  slice U1

**Title.** Transcoder page task list goes stale when the last in-progress task finishes: the jobs poll is stopped by the stats tick without a final reload, and WS events only reload the GPU rows.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:128-135` at `2625b3e7` (also 114-124 poll timer, 171-180 WS handler).

**What.** `loadJobs(false)` runs on a 5 s interval only while `tasks_by_status.in_progress|queued > 0` (from the separate 5 s stats poller). When a task completes between the last jobs poll and the next stats poll, the stats tick flips the counts to 0, the `$effect` calls `stopJobsPolling()` and nothing refetches the list, so the card keeps showing `in_progress` with a live progress bar until the operator switches tabs or reloads. The `transcode.events` subscription (line 171) only calls `loadGpus()`.

**Repro / evidence.**

```
128  $effect(() => { if (statusCount('in_progress') > 0 || statusCount('queued') > 0) startJobsPolling(); else stopJobsPolling(); });
171  wsClient.subscribe('transcode.events', () => { ... loadGpus(); });   // no loadJobs
```
Window: up to one poll interval per completion, every time the queue drains.

**Suggested fix location.** `routes/transcoder/+page.svelte`: call `loadJobs(false)` in the `else` branch (on the transition to idle) and/or in the `transcode.events` handler alongside `loadGpus()`.

**Verification.** Code reading; `untested-needs-hardware` for the live race (`bash devtools/iso-smoke.sh` with a transcode session, watch the Transcoder page as the single task finishes).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/192

### D-195  S3  open  ui-neu  slice U1

**Title.** Transcoder Retry/Delete swallow failures: no try/catch, and the `actionFeedback` banner state is declared but never set.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:100-112` at `2625b3e7` (`actionFeedback` at 105, rendered 375-380).

**What.** `handleRetry` and `handleDelete` `await` the API and then `loadJobs()`; a 409 from retry (`transcodes.py:142-146`, task no longer FAILED after a concurrent retry), a 503 from delete (`transcodes.py:226-231`, dispatcher unavailable) or a network error becomes an unhandled promise rejection: the button does nothing visible, the list is not refreshed, and the "Dismiss"-able feedback banner (lines 375-380) can never appear because nothing assigns `actionFeedback`.

**Repro / evidence.**

```
100  async function handleRetry(id) { await retryTranscoderJob(id); loadJobs(); }
107  async function handleDelete(id) { if (confirm(...)) { await deleteTranscoderJob(id); loadJobs(); } }
105  let actionFeedback = $state<...>(null);   // only ever reset to null at 378
```

**Suggested fix location.** `routes/transcoder/+page.svelte`: wrap both in try/catch setting `actionFeedback = {type:'error', message: e.message}` (ApiError.message already carries the backend detail) and refresh on success.

**Verification.** Code reading; `grep -n "actionFeedback =" src/routes/transcoder/+page.svelte` shows only the `null` reset.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/193

### D-196  S3  open  ui-neu  slice U1

**Title.** Per-drive prescan/enumeration settings are dead: Settings feeds DriveCard hard-coded "global defaults" (1 / 300 / 3 / 60) from `arm_config.PRESCAN_*` keys that never exist in the v3 ConfigView, and no ripper or backend code reads `prescan_cache_mb` / `prescan_timeout` / `prescan_retries` / `disc_enum_timeout`.

**Where.** `services/ui-neu/frontend/src/routes/settings/+page.svelte:672-677` at `2625b3e7`; `src/lib/api/settings.ts:71-73` (arm_config = stringified ConfigView keys, all snake_case); model `packages/arm_common/arm_common/models/drive.py:99-102`; consumer `src/lib/components/DriveCard.svelte:110-152, 162-164, 682`.

**What.** `Number(settings?.arm_config?.PRESCAN_CACHE_MB) || 1` is always the fallback because ConfigView has no such key (settings.ts:71 builds `arm_config` from the ConfigView's own lowercase fields). DriveCard shows those numbers as the "global default" placeholder and stores `null` when the operator types the same value (162-164). `grep -rn "prescan_\|disc_enum_timeout" services/ripper services/backend/arm_backend` (non-test) finds no reader, so whatever the operator saves changes nothing. The UI presents a tunable with a documented default that is fictional.

**Repro / evidence.**

```
settings/+page.svelte:673   prescan_cache_mb: Number(settings?.arm_config?.PRESCAN_CACHE_MB) || 1,
settings.ts:71-73           arm_config: Object.fromEntries(Object.entries(config).map(([k, v]) => [k, String(v)]))   // keys are ConfigView keys
grep -rn "prescan_timeout\|disc_enum_timeout" --include=*.py services/ripper services/backend/arm_backend | grep -v tests   -> (no output)
```

**Suggested fix location.** Either wire the four Drive columns into the ripper (`arm_ripper` scan/rip settings, with real defaults published on `ConfigView`), or remove the Advanced prescan fields from `DriveCard.svelte` and the `globalDefaults` prop from `routes/settings/+page.svelte` until they do something.

**Verification.** Code reading + grep; cross-slice (DriveCard, ripper) for the coordinator.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/194

### D-197  S3  open  ui-neu  slice U1

**Title.** `dashboard-page.test.ts` "Dashboard job grouping logic" tests a private re-implementation of the grouping, not the page, and that copy disagrees with the page (`identified` is a review card on the page, "finishing" in the test).

**Where.** `services/ui-neu/frontend/src/routes/__tests__/dashboard-page.test.ts:77-130` at `2625b3e7`; page logic `src/routes/+page.svelte:49-57, 69-85`.

**What.** The five tests call a `groupJobs()` defined inside the test file (lines 78-91) and never render the page or import its helpers, so they can never fail when the page's lanes change. They also assert `identified` -> finishing and ignore `awaiting_review`, while the page puts `identified`/`awaiting_review` in WAITING FOR REVIEW (lines 49-57) and `finishingJobs` excludes review cards (line 85). A test that passes for the wrong reason.

**Repro / evidence.**

```
test:78   function groupJobs(jobs) { const waiting = jobs.filter(s === 'awaiting_user_id' || s === 'ripped_awaiting_identify'); ... finishing = s === 'identified' || ... }
page:55   return s === 'awaiting_user_id' || s === 'ripped_awaiting_identify' || s === 'awaiting_review' || s === 'identified';
```

**Suggested fix location.** Delete the describe block or move the lane partition into `src/lib/utils/job-status*.ts` and test that function, plus one render test per lane with `fetchDashboard` fixtures.

**Verification.** Code reading; vitest subset passes (61/61).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/195

### D-198  S4  open  ui-neu  slice U1

**Title.** Three destructive actions still use the native `confirm()` dialog where the shared `ConfirmDialog` exists (same pattern as closed D-026, different sites).

**Where.** `services/ui-neu/frontend/src/routes/+page.svelte:173` (bulk delete/purge jobs), `src/routes/transcoder/+page.svelte:108` (delete transcode task), `src/routes/settings/+page.svelte:224` (delete user theme) at `2625b3e7`.

**What.** `ConfirmDialog` is the standard (used on the same Settings page for Clear Cache at 794-802, on Files for every delete, on Notifications for purge). These three sites block the UI thread with the browser prompt, cannot be themed, and are untestable with the component harness (files-page.test stubs `confirm` globally).

**Repro / evidence.** `grep -rn "confirm(" src/routes | grep -v test` -> the three lines.

**Suggested fix location.** The three files: a `ConfirmDialog` with `variant="danger"`, as Files/Settings already do.

**Verification.** grep + reading `feedback_standard_ui_patterns.md`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/196

### D-199  S4  open  ui-neu  slice U1

**Title.** One-off markup where shared components exist: `&times;` close buttons instead of `CloseButton`, and inline SVGs whose paths are byte-identical to `Glyph` entries (chevron-right, lock, refresh, gear, sun, moon).

**Where.** `services/ui-neu/frontend/src/routes/+page.svelte:455` and `src/routes/notifications/+page.svelte:107-112` (close glyph); `src/routes/jobs/[id]/+page.svelte:764-766` (= `GLYPH_PATHS['chevron-right']`); `src/routes/files/+page.svelte:518-526` (= `lock`), `:637-640` (= `refresh`); `src/routes/+layout.svelte:344-361` (= `gear`, split in two paths), `:437-444` (= `sun`), `:446-453` (= `moon`) at `2625b3e7`.

**What.** `feedback_standard_ui_patterns.md`: recurring icons/close buttons are the shared `Glyph`/`CloseButton`, never pasted SVG. The paths above match `src/lib/components/glyph-names.ts` exactly (`chevron-right: 'M9 5l7 7-7 7'`, `lock`, `refresh`, `gear`, `sun`, `moon`), so these are copies that will drift the moment the glyph set changes; the two `&times;` buttons also lack an aria-label.

**Repro / evidence.** Diff the `d=` attributes at the lines above against `glyph-names.ts:43-80`; `grep -rn "CloseButton" src/routes` -> no use in any route.

**Suggested fix location.** Replace with `<Glyph name=.../>` and `<CloseButton onclick=.../>` in the five files.

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/197

### D-200  S4  open  ui-neu  slice U1

**Title.** Settings > Themes renders `themeFeedback` twice (once at the top of the section, again inside the User Themes panel) whenever a user theme exists.

**Where.** `services/ui-neu/frontend/src/routes/settings/+page.svelte:509-513` and `:574-578` at `2625b3e7`.

**What.** Both blocks are `{#if themeFeedback}` on the same state, so after a theme delete the message "Theme X deleted" appears as an alert above the swatches and as a paragraph under the User Themes grid.

**Repro / evidence.** Lines 509 and 574 are both `{#if themeFeedback}`.

**Suggested fix location.** Drop one of the two blocks (574-578 is the orphan: the panel it sits in disappears when the last user theme is deleted, so the success message would vanish with it).

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/198

### D-201  S4  open  ui-neu  slice U1

**Title.** Settings starts a 10 s `/api/drives` poller for every tab (not just Drives) on top of the layout's 5 s dashboard fan-out that already fetches `/api/drives`, and POSTs `/api/drives/rescan` on every visit.

**Where.** `services/ui-neu/frontend/src/routes/settings/+page.svelte:141, 263-267` at `2625b3e7`.

**What.** `drives.start()` runs in `onMount` regardless of `activeTab`; the drive list is only read by the Drives tab (652-685) and the stats bar at the top is already fed by `dashboard` (`fetchDrives({includeRetired:true})` every 5 s, dashboard.ts:90). Sitting on Settings > Themes therefore issues `/api/drives` 18 times a minute from two pollers, plus a write (`rescan`) each time the page mounts. Sibling of open D-136 (different page/endpoint).

**Repro / evidence.**

```
141  const drives = createPollingStore(fetchDrives, [] as Drive[], 10000);
265  rescanDrives().catch(() => {}).then(() => drives.start());   // unconditional
```

**Suggested fix location.** `routes/settings/+page.svelte`: start/stop the drives store from `setTab`/`onHashChange` when `tab === 'drives'` (as `loadDriveSessions` already is), and move the rescan into the Drives tab entry.

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/199

### D-202  S4  open  ui-neu  slice U1

**Title.** Transcoder card "Took Xh Ym" is `updated_at - created_at`, so queue wait counts as encode time (sibling of open D-130 on another surface); the task view carries no claimed/started timestamp to compute it correctly.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:485-490` at `2625b3e7`; `TranscodeTaskView` fields `src/lib/types/api.gen.ts:5185-5225` (`created_at`, `updated_at`, `claim_heartbeat_at` only).

**What.** A task queued at 09:00 that waited for a GPU until 11:00 and encoded for 20 minutes shows "Took 2h 20m 0s" in green. D-130 fixes the ETA on `TranscodeCard`; this label has the same root cause and needs a `claimed_at`/`started_at` on `TranscodeTaskView`.

**Repro / evidence.** `486 {@const dur = formatDuration(job.created_at, job.updated_at)}` ... `Took {dur}`.

**Suggested fix location.** Backend `TranscodeTaskView` (+ OpenAPI regen) to expose the claim time, then this label; until then drop "Took" or label it "Queued to done".

**Verification.** Code reading of the generated type.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/200

### D-203  S4  open  ui-neu  slice U1

**Title.** Job detail track Title cell is a clickable `<td onclick>` with no role, tabindex or key handler: the inline title editor is mouse-only and invisible to assistive tech.

**Where.** `services/ui-neu/frontend/src/routes/jobs/[id]/+page.svelte:539-548` at `2625b3e7`.

**What.** For admins the cell toggles `editingTrackId` on click (`cursor: pointer` via `.job-detail-track-title-cell`) but there is no `<button>`, `role="button"`, `tabindex` or Enter/Space handling, so keyboard users cannot open `TrackTitleSearch` and screen readers get no affordance. The IMDb link inside needs `stopPropagation` (571) only because the whole cell is a click target.

**Repro / evidence.** Lines 539-548: `<td class="table-cell {...}" data-label="Title" onclick={$isAdmin ? () => {...} : undefined}>`.

**Suggested fix location.** Wrap the title in a `<button type="button" class="btn-link">` (or an edit icon `Glyph`) inside the cell; drop the `onclick` from the `<td>`.

**Verification.** Code reading; svelte a11y lint does not flag `onclick` on `<td>` without an explicit role.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/201

### D-204  S4  open  ui-neu  slice U1

**Title.** Two write actions surface no error: excluding a track (`toggleExcluded`) re-throws into the void and "Run setup again" has no catch.

**Where.** `services/ui-neu/frontend/src/routes/jobs/[id]/+page.svelte:146-154` and `src/routes/settings/+page.svelte:252-260` at `2625b3e7`.

**What.** `toggleExcluded` is `try { await updateTrack } finally { await loadJob() }`: a 409 (job not editable in this status) or 403 just snaps the checkbox back with no message and an unhandled rejection in the console. `runSetupAgain` is `try { await restartSetup(); goto(...) } finally { restartingSetup = false }`: a failure leaves the operator on Settings with no feedback.

**Repro / evidence.** Both functions have no `catch`; neither page has a feedback state wired to them.

**Suggested fix location.** The two functions: catch and show `flashNote(e.message)` (jobs page already has `flashNote`) / a `settings-page-feedback` alert.

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/202

### D-205  S4  open  ui-neu  slice U1

**Title.** `fetchDashboard` throws away `TranscodeStatsView`, so the header's "N queued" badge and the `worker_running` branch of the Transcode health dot are dead code.

**Where.** `services/ui-neu/frontend/src/lib/api/dashboard.ts:152` at `2625b3e7` (type 20-26); consumers `src/routes/+layout.svelte:267-274, 311-313`.

**What.** `transcoder_stats` is always `{}` on success, so `transcoder_stats?.pending` is `undefined` and `(Number(undefined) || 0) > 0` is never true: the "queued" badge never renders although `/api/transcodes/stats.tasks_by_status.queued` is in the response that was just fetched. `worker_running ?? true` likewise always takes the default. The code comment at 20-22 claims v3 has no pending count; `TranscodeStatsView.tasks_by_status` (transcoder.py:79) has it.

**Repro / evidence.**

```
dashboard.ts:152   transcoder_stats: transcoderStatsRes.status === 'fulfilled' ? {} : null,
+layout.svelte:311 {#if $dashboard.transcoder_online && (Number($dashboard.transcoder_stats?.pending) || 0) > 0}
```

**Suggested fix location.** `src/lib/api/dashboard.ts`: map `pending: stats.tasks_by_status.queued ?? 0` (and drop `worker_running` or derive it from `/api/transcodes/workers`), or delete the badge/branch in `+layout.svelte`.

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/203

### D-206  S4  open  ui-neu  slice U1

**Title.** Em-dash and unicode-symbol glyphs in UI copy via HTML entities (`&mdash;`, `&middot;`, `&rarr;`, `&rsaquo;`, `&times;`), which the `[^\x00-\x7F]` pre-commit grep cannot see.

**Where.** `services/ui-neu/frontend/src/routes/transcoder/+page.svelte:324` (`&mdash;`), `:299` and `:331` (`&middot;` separators), `:496` (`&rarr;`); `src/routes/jobs/[id]/+page.svelte:307` (`&rsaquo;` breadcrumb separator); `src/routes/+page.svelte:455` and `src/routes/notifications/+page.svelte:111` (`&times;` close glyphs) at `2625b3e7`.

**What.** `feedback_no_em_dashes_in_ui_copy.md` bans `—` and `· → › ×` as UI, naming `|` for separators and SVG glyphs for arrows/close. The transcoder worker card renders "Task #x — gpu-0", "GPUs: 1/1 available · Queue: 0 queued", "50% · 3m since heartbeat" and "→ movie.mkv"; the job breadcrumb uses `›`.

**Repro / evidence.** `grep -rnoE "&(mdash|ndash|middot|rarr|rsaquo|times);" src/routes | grep -v test` -> the 7 lines above.

**Suggested fix location.** The files above: `|` / `,` for separators, `-` or `:` for the em-dash, `Glyph name="arrow-right"` / `"chevron-right"` for the arrows, `CloseButton` for `&times;` (see C11). Add the entity names to the pre-commit non-ASCII check.

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/204

### D-207  S3  open  ui-neu  slice U2

**Title.** ApplySessionDialog's session filter disagrees with the backend compatibility rule: it offers TV sessions to CD and data jobs (backend 422s) and hides ISO/data sessions the backend accepts for video jobs; the test pins the wrong filter.

**Where.** `services/ui-neu/frontend/src/lib/components/ApplySessionDialog.svelte:47-52, 60-72` at `2625b3e7`; test `src/lib/components/__tests__/ApplySessionDialog.test.ts:117-135`; backend `services/backend/arm_backend/auto_session.py:97-116`, `routers/jobs.py:1380-1384`; unused mirror `src/lib/utils/sessions.ts:461-468`.

**What.** `filteredSessions` keeps a session when `s.media_type === mt || s.media_type === 'tv'` with `mt` derived from `disc_type` (dvd/bluray -> movie, cd -> music, data -> data). The backend's `_media_types_compatible` is: same type, or movie<->tv, or an iso/data session for a movie/tv/data job; music is only ever music. So for a CD job the dialog lists every TV session (Apply then fails with 422 "session media type is not compatible with job media type", shown only after the click), for a data disc it lists TV sessions (same 422) and hides `data` sessions' sibling `iso` ones, and for a movie/tv job it hides the iso-dump/data sessions the backend accepts (same defect class as closed D-034, which fixed SessionRoutesCard with `mediaTypesCompatible` from `utils/sessions.ts`; this dialog never adopted it). It also ignores `job.media_type`, so a DVD identified as `tv` is filtered as a movie. The test at :117-135 asserts "Data ISO" is hidden for a bluray job, locking in the divergence.

**Repro / evidence.**

```
ApplySessionDialog.svelte:62   const byMediaType = sessions.filter((s) => mt === null || s.media_type === mt || s.media_type === 'tv');
auto_session.py:113-115        if sess_mt in (ISO, DATA) and job_mt in video | {DATA}: return True   # music never matches tv
ApplySessionDialog.test.ts:134 expect(screen.queryByText(/Data ISO/)).not.toBeInTheDocument();   // backend would accept it
```
Manual: open the review card of a CD job, Apply session: TV sessions are listed; choosing one gives "session media type is not compatible with job media type".

**Suggested fix location.** `ApplySessionDialog.svelte` `filteredSessions`: `sessions.filter((s) => mt === null || mediaTypesCompatible(mt, s.media_type))` with `mt = job.media_type ?? discTypeToMediaType(job.disc_type)`; update the test fixture expectations (Data ISO visible for bluray, TV hidden for cd).

**Verification.** Code reading of component, test and backend rule; vitest subset passes (that is the problem).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/205

### D-208  S3  untested-needs-hardware  ui-neu  slice U2

**Title.** DriveCard "Start rip" is enabled in every drive state: while the drive is already ripping (backend 409), while the tray is reported empty/open (backend 400) and on a detached drive (backend 202, nothing ever starts, no feedback).

**Where.** `services/ui-neu/frontend/src/lib/components/DriveCard.svelte:574-582` (button, only `disabled={triggering}`), `:226-239` (`startManualRip`), `:221-224` (`isDetached`/`isRipping` already derived) at `2625b3e7`; backend `services/backend/arm_backend/routers/jobs.py:986-1010`.

**What.** `manual_trigger` refuses with 409 when the drive has a RIPPING job (`jobs.py:990-999`) and with 400 when a fresh heartbeat says `media_status` is not ready (`:1004-1010`). The card already knows both (`isRipping(drive)` at `:391`, `drive.media_status` at `:525-529`) and the detached state (`isDetached`), yet keeps the primary "Start rip" button active; the 409/400 text only appears after the click. For a detached drive the heartbeat is stale so the backend answers 202 and emits `ripper.commands.<id>` to a ripper that is gone: the button spins, clears the session select and the operator gets no indication that nothing happened. The Unenroll button beside it is correctly gated (`:598`), so this is an inconsistency on the same row.

**Repro / evidence.**

```
DriveCard.svelte:574-582   <button onclick={startManualRip} disabled={triggering} ...>Start rip</button>
jobs.py:996-999            detail=f"drive {req.drive_id} already has an in-flight RIPPING job"   (409)
jobs.py:1004-1010          if age < _MEDIA_STATUS_FRESHNESS and drive.media_status not in _MEDIA_STATUS_READY: 400
```
Manual: on a drive mid-rip click Start rip: red "already has an in-flight RIPPING job"; unplug a drive (status pill "detached"), click Start rip: no error, no job.

**Suggested fix location.** `DriveCard.svelte`: `disabled={triggering || isRipping(drive) || isDetached || (drive.media_status && drive.media_status !== 'loaded')}` with a title explaining why; the detached case could also be a backend 409 in `manual_trigger` when `drive.present === false`.

**Verification.** Code reading of component + router; `untested-needs-hardware` for the detached no-op (`devtools/iso-smoke.sh` then unplug / `armctl` stop the ripper and press Start rip).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/206

### D-209  S4  open  ui-neu  slice U2

**Title.** JobActions still uses the native `confirm()` for Abandon and Delete where the shared `ConfirmDialog` exists (same class as closed D-026 / U1 C10, different sites); its test stubs `confirm` globally.

**Where.** `services/ui-neu/frontend/src/lib/components/JobActions.svelte:32, 68` at `2625b3e7`; `src/lib/components/JobActions.test.ts:19-23, 162-169`.

**What.** `feedback_standard_ui_patterns.md` names `ConfirmDialog` the standard; DiscReviewWidget (`:515-523`), DriveCard, SessionsArea, GpusCard and NotificationsTab all use it for the same destructive actions. JobActions (jobs table + job detail) blocks the thread with the browser prompt, cannot be themed and is only testable by stubbing `window.confirm`.

**Repro / evidence.** `grep -rn "confirm(" src/lib/components --include=*.svelte | grep -v ConfirmDialog` -> the two lines.

**Suggested fix location.** `JobActions.svelte`: a `ConfirmDialog` with `variant="danger"` for Delete (and Abandon), as DiscReviewWidget does; drop the `vi.stubGlobal('confirm')` from the test.

**Verification.** grep + reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/207

### D-210  S4  open  ui-neu  slice U2

**Title.** Banned copy characters (em-dash, `·`, `…`, `▾`, `›`, `○`, gear/triangle numeric entities, `&middot;`, `&rarr;`, `&times;`) rendered from components, stores and utils; the pre-commit config has no non-ASCII/entity check so the memory rule is unenforced.

**Where.** at `2625b3e7`: `src/lib/utils/drives.ts:3` (`'○ detached: reconnect the drive'`, rendered by `DriveCard.svelte:452-458` and used as the `isDetached` sentinel at `:222`); `src/lib/stores/rips.svelte.ts:143` (`parts.join(' · ')`, rendered by `ActiveJobRow.svelte:215`); `src/lib/components/IsoPicker.svelte:560` (`{size} · {date}`); `DriveMaintenance.svelte:31-32` (`·` x4); `setup/SetupStepper.svelte:50, 68` (`·`); `episodes/EpisodeRows.svelte:44, 45, 47, 49, 85, 101, 135, 154, 159` (`·`, `—`, `Change…`); `episodes/EpisodeMatchPanel.svelte:249, 251, 341, 343, 361, 370, 388, 406, 416, 434` (`·`, `…`, `▾`, `›`); `episodes/RerunPanel.svelte:82` (`Previewing…`); `episodes/episodeModel.ts:49` (`—`); `BulkActionsMenu.svelte:67, 69` (`&#9881;` gear, `&#9662;` down-triangle as icons); `settings/SchemaConfigForm.svelte:214` (`&middot;`); `settings/SessionRoutesCard.svelte:214` (`&rarr;`); `DiscReviewWidget.svelte:411` (`&times;`). (`JobPagination.svelte:16` `&ndash;` in a numeric range is borderline and not counted.)

**What.** `feedback_no_em_dashes_in_ui_copy.md` and `feedback_glyph_icons_not_emoji.md` ban exactly these (`·` -> `|`, `…` -> `...`, `—` -> `-`, `▾`/`→`/`×`/`○` -> Glyph). `Glyph` already has `gear`, `chevron-down`, `arrow-right`, `x`; `CloseButton` exists for the `&times;`. Several of these are new since the sweep-1 fixes (episodes panel, setup stepper, ISO picker, rip transfer line), and nothing in `.pre-commit-config.yaml` would have caught them.

**Repro / evidence.** `grep -rnP "[^\x00-\x7F]" src/lib/components src/lib/stores src/lib/utils --include=*.svelte --include=*.ts | grep -v "test\|__tests__\|glyph-names" | grep -vP "^\S+:\d+:\s*(//|\*|/\*|<!--)"` -> the 29 lines above; `grep -rnoE "&(middot|rarr|times);|&#x?[0-9a-fA-F]+;" src/lib/components --include=*.svelte` -> 5 lines.

**Suggested fix location.** The files above (character correction only, per the memory rule); `utils/drives.ts` `DETACHED_LABEL` can lose the `○` without touching the sentinel compare. Add a pre-commit grep for `[^\x00-\x7F]` and the entity names over `src/**/*.svelte,*.ts` minus tests/comments.

**Verification.** grep; `DriveCard.test.ts` and `drives-labels.test.ts` compare against the exported constant, so they keep passing after the change.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/208

### D-211  S4  open  ui-neu  slice U2

**Title.** Shared-component violations inside components: 15 inline SVGs byte-identical to `Glyph` paths, three notifications components importing lucide `ChevronRight` where `Glyph chevron-right` exists, a pause icon implemented twice (inline SVG and lucide), and a `&times;` close button where `CloseButton` exists.

**Where.** at `2625b3e7`, `d=` equal to `glyph-names.ts` entries: `src/lib/components/MusicSearch.svelte:414, 493` (= `refresh`); `BreadcrumbNav.svelte:36`, `JobLogPanel.svelte:58`, `JsonTree.svelte:39` (= `chevron-right`); `TranscodeCard.svelte:89`, `ActiveJobRow.svelte:195`, `notifications/ServiceDropdown.svelte:49` (= `chevron-down`); `TrackTitleSearch.svelte:170`, `FileRow.svelte:100` (= `x`); `FileRow.svelte:95` (= `check`); `FileRow.svelte:151` (= `lock`); `ApplySessionDialog.svelte:311` (= `warning`, same class as closed D-024, different site). lucide instead of Glyph: `notifications/ChannelRow.svelte:3, 107`, `notifications/BashTestPanel.svelte:2, 107`, `notifications/sections/BashScriptFields.svelte:3, 152` (`ChevronRight`). Pause icon twice: `CountdownTimer.svelte:52, 57` (inline play/pause paths) vs `JobLifecycle.svelte:3, 36, 49` (lucide `Pause`), neither in `Glyph`. Close: `DiscReviewWidget.svelte:411` (`<button>&times;</button>`, no aria-label).

**What.** `feedback_standard_ui_patterns.md`: recurring icons are the shared `Glyph`/`CloseButton`, never pasted SVG; a pattern in two places is extracted. These copies drift the moment `glyph-names.ts` changes (the chevron set already differs in stroke width between `Glyph` and the lucide imports), and the error-dismiss button in the review card has no accessible name.

**Repro / evidence.** `grep -rnoE 'd="M[^"]+"' src/lib/components --include=*.svelte | grep -v Glyph.svelte` and diff each against `glyph-names.ts:35-89`; `grep -rn "from 'lucide-svelte'" src/lib/components`.

**Suggested fix location.** The files above: `<Glyph name=.../>`, `<CloseButton .../>`; add `pause`/`play` to `glyph-names.ts` and use them from both CountdownTimer and JobLifecycle.

**Verification.** Code reading; `Glyph.test.ts` covers the registry so new names are cheap to add.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/209

### D-212  S4  open  ui-neu  slice U2

**Title.** MakemkvKeyField runs its own 5 s poller of `/api/config` and `/api/drives` for as long as Settings > Metadata or the setup MakeMKV step is mounted, duplicating the layout's dashboard poll of the same two endpoints (sibling of open D-136 / U1 C13).

**Where.** `services/ui-neu/frontend/src/lib/components/settings/MakemkvKeyField.svelte:28-36` at `2625b3e7`; rendered for the `makemkv_key` widget by `settings/ConfigSchemaField.svelte:52-53` (Metadata > API keys) and `setup/steps/MakemkvStep.svelte:1502`.

**What.** `usePoll(async () => { [cfg, drives] = await Promise.all([fetchConfigView(), fetchDrives()]) }, 5000)` fires every 5 s while the field is on screen, only to compute the key-status strip. The layout's `dashboard` store (`stores/dashboard.ts:161`, via `api/dashboard.ts`) already fetches `/api/config` and `/api/drives` every 5 s and exposes `makemkv_key_valid`/`makemkv_key_checked_at`/`drive_names`. Sitting on Settings > Metadata therefore costs 4 extra requests per 5 s tick; Settings > Ripping/Transcoding tabs do not pay this. Workaround: none needed functionally; it is load.

**Repro / evidence.** `MakemkvKeyField.svelte:30-34` vs `stores/dashboard.ts:92-108` (fields `makemkv_key_valid`, `makemkv_key_checked_at`, `drive_names` already present).

**Suggested fix location.** `MakemkvKeyField.svelte`: read `$dashboard.makemkv_key_valid` / `drive_names` (the store is already running on every authenticated page), or poll at the key-check cadence (30 s+) and only `/api/config`.

**Verification.** Code reading.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/210

### D-213  S4  open  ui-neu  slice U2

**Title.** ARIA attributes on role-less elements and mouse-only interactive cells (sibling of closed D-049 and U1 C15, different sites).

**Where.** at `2625b3e7`: `src/lib/components/notifications/StatusDot.svelte:7` (`<span class="status-dot" aria-label={status}>`), `src/lib/components/IsoSourceChip.svelte:21` (`<span class="chip" aria-label="...">`), `src/lib/components/ReviewTracksTable.svelte:95-100` (`<td onclick>` toggling the title search, no role/tabindex/key handler), `src/lib/components/settings/UsersCard.svelte:114` (`<div role="presentation" onclick={closePanel}>` scrim).

**What.** `aria-label` is prohibited on a generic `span` (ARIA 1.2, axe `aria-prohibited-attr`); StatusDot's label is also just the raw status word. The review-tracks Title cell is the only way to open `TrackTitleSearch` on the review card and is unreachable by keyboard (the adjacent icon button only exists in the last column for video rows, so the cell click is redundant for mouse users and invisible to AT). UsersCard copies the slide-over pattern but with a click-only div scrim where ConfirmDialog/SessionsArea/ApplySessionDialog use a `<button aria-label="Close dialog">`.

**Repro / evidence.** `grep -rnE "<(div|span)[^>]*aria-(label|checked)" src/lib/components --include=*.svelte | grep -v role=` -> the two spans; `ReviewTracksTable.svelte:850-855` in the concatenated read = file lines 95-100.

**Suggested fix location.** StatusDot/IsoSourceChip: `role="img"` or drop the attribute (the chip already has visible text + `title`); ReviewTracksTable: remove the `<td onclick>` (the icon button exists) or make the title a `<button class="btn-link">`; UsersCard: a `<button>` scrim like ConfirmDialog.

**Verification.** Code reading; svelte-check does not flag any of these.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/211

### D-214  S4  open  ui-neu  slice U2

**Title.** Review card offers "Start rip" ("Save the metadata and start ripping this disc") on a `ripped_awaiting_identify` placeholder whose disc is already ripped; the action only resolves identity (promotes to `ripped`), no rip starts, and the status bar reads "Awaiting Review".

**Where.** `services/ui-neu/frontend/src/lib/components/DiscReviewWidget.svelte:83-87` (`canStart` includes `'ripped_awaiting_identify'`), `:202-229` (`handleStartRip`: `resolveJob`, then `startWaitingJob` only for `awaiting_review`), `:289-295` (status label), `:457-466` (button text/title) at `2625b3e7`; backend `packages/arm_common/arm_common/enums.py:105-111`, `RESOLVABLE_PROMOTE_JOB_STATUSES` `:133-135`.

**What.** `RIPPED_AWAITING_IDENTIFY` is "a placeholder disc ripped successfully but identification never landed"; resolve promotes it to RIPPED and the parked session drains. The card is right to offer the resolve, but labels it "Start rip" with a "start ripping this disc" tooltip and a green success button, and the header says "Awaiting Review" (the review-gate wording) instead of something like "Ripped: needs identity". The operator is told a rip will start; the backend will not start one and the disc may already be ejected. The `__tests__/DiscReviewWidget.test.ts:95-117` case for this status only checks Delete/Cancel, so the copy is untested.

**Repro / evidence.**

```
DiscReviewWidget.svelte:84   ['awaiting_user_id', 'awaiting_review', 'ripped_awaiting_identify', 'identified'].includes(...)
DiscReviewWidget.svelte:462  title={previousId ? 'Rip this disc again' : 'Save the metadata and start ripping this disc'}
enums.py:106-110             identification never landed ... resolve ... promotes this to RIPPED (not IDENTIFIED)
```

**Suggested fix location.** `DiscReviewWidget.svelte`: for `isPostRipStatus(status)` label the button "Save identity" (and the status bar "Ripped: needs identity"), reusing `isAwaitingIdentity`/`isPostRipStatus` from `utils/job-status-groups.ts`.

**Verification.** Code reading of component + enum docstring.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/212

### D-215  S4  open  ui-neu  slice U2

**Title.** `colorScheme.ts` built-in schemes still carry the removed legacy alias tokens (`--color-primary-dark`, `--color-primary-light-bg`, `--color-primary-border`, and the `-dark` twins) and `applyTokens` writes them onto `<html>` "for components that still use `dark:bg-surface-dark`"; no component or stylesheet reads them any more (sibling of closed D-047).

**Where.** `services/ui-neu/frontend/src/lib/stores/colorScheme.ts:36, 41` (and the same keys in every built-in scheme 28-772), `:812, 830-835` at `2625b3e7`; `styles/__tests__/tokens.test.ts:192-204` asserts `tokens.css` carries none of these aliases.

**What.** `grep -rnE "primary-dark|primary-light-bg|surface-dark|page-dark|primary-text-dark|primary-border" src static/themes` outside `colorScheme.ts` finds only comments. The `-dark` twins are legitimately used as data to pick the dark value for the base role (`:838-840`), but `--color-primary-dark`, `--color-primary-light-bg` and `--color-primary-border` have no reader at all, and writing every `-dark` name as a live custom property (`:830-835`) is dead output with a stale justification. Docs vs code drift per `feedback_docs_describe_current_state.md`.

**Repro / evidence.** the grep above; `colorScheme.ts:831-832` comment.

**Suggested fix location.** `stores/colorScheme.ts`: drop the three unread aliases from `COLOR_SCHEMES`, stop `setProperty` for `-dark` names (keep them as lookup data), fix the comment; align `THEME_TEMPLATE.md` if it still lists them.

**Verification.** grep + reading `applyTokens`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/213

### D-216  S3  untested-needs-hardware  devtools  slice D1

**Title.** Leaf TLS keys are group-owned by the installer's gid, not `.env`'s `PGID`; the documented "edit PUID/PGID to match your media server" leaves the backend unable to read `tls.key`.

**Where.** `deploy/lib/certs.sh:28-29,55` at `2625b3e7`; nothing in `deploy/` or `devtools/` ever sets `ARM_PGID` (`grep -rn ARM_PGID deploy devtools install.sh` → only the `${ARM_PGID:-$(id -g)}` readers and the comment). Consumers: `deploy/install/flow.sh:228-233` (`make_leaf` on every install run), `docker-compose.yml.example:116-117` (`arm-backend.key` mounted ro), `services/_common/docker-entrypoint.sh:336-348,416` (process runs as `PUID:PGID`), `services/backend/arm_backend/main.py:518-519` (`ssl_keyfile`).

**What.** `make_leaf` writes each leaf key `0440` and `chgrp "${ARM_PGID:-$(id -g)}"`; the comment says this is "so a stack whose PUID differs from the user who ran the installer can still read them", but `ARM_PGID` is never exported, so the group is always the installing user's primary gid. `docs/user/Configuring-ARM.md:28` and `docs/user/Troubleshooting.md:106-110` tell operators to set `PUID`/`PGID` to the media server's uid/gid (e.g. 999:999). The backend container then runs `arm` as 999:999 and `uvicorn` opens `/etc/ssl/arm/tls.key` (installer-uid:installer-gid, 0440) → `PermissionError`, crash loop under `restart: unless-stopped`. Re-running `armctl install` does not help: `write_env` keeps the existing `PUID`/`PGID` (config.sh:479-486) and `make_leaf` re-chgrps to `$(id -g)` again. `arm-ui` (nginx master as root) and `arm-db` (`install -o postgres` as root) are unaffected; only the backend breaks. Expected: chgrp the leaf keys to the `PGID` that `.env` carries (or mode 0444 like the certs, since the key is already behind the 0700 `certs/` dir), and/or document the chgrp.

**Repro / evidence.**

```
$ grep -n 'chgrp' deploy/lib/certs.sh
55:    chgrp "${ARM_PGID:-$(id -g)}" "$key" 2>/dev/null || true
$ grep -rn 'ARM_PGID=' deploy devtools install.sh        # no setter anywhere
(no output)
# sequence: armctl install (as uid 1000) -> edit .armctl/.env PUID=999 PGID=999 -> armctl up
#  -> armv3-backend: PermissionError: [Errno 13] Permission denied: '/etc/ssl/arm/tls.key'
```

**Suggested fix location.** `deploy/lib/certs.sh` (`make_leaf`): take the gid from `env_file_value PGID` when `ENV_FILE` exists (armctl) / the detected gid (setup-dev), and re-chgrp existing keys on re-run; `deploy/install/flow.sh` Certificates step runs after `.env` is known for the PGID value. Mention the requirement in `docs/user/Configuring-ARM.md` § File ownership.

**Verification.** Static trace of certs.sh + entrypoint + main.py; `grep` for setters. untested-needs-hardware for the crash itself: `armctl install --no-host-changes`, set `PUID`/`PGID` in `.armctl/.env` to an unrelated uid:gid, `armctl up`, `armctl compose logs arm-backend`.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/214

### D-217  S3  untested-needs-hardware  devtools  slice D1

**Title.** The UI leaf certificate has no LAN-IP SAN, so trusting `arm-ca.crt` does not silence the warning for the `https://<host-ip>:8081` access path the docs advertise.

**Where.** `deploy/install/flow.sh:233` and `devtools/setup-dev.sh:214` (`make_leaf arm-ui localhost "$(hostname -f ...)"`), `deploy/lib/certs.sh:36-50` (SAN list = `DNS:arm-ui`, `DNS:localhost`, `DNS:<hostname>` only) at `2625b3e7`. Claims: `docs/user/Getting-Started.md:162-163,194-205`, `docs/user/Troubleshooting.md:118-123`, `docs/developers/architecture/06-deployment.md:398`.

**What.** Getting-Started tells the user to open `https://<host-ip>:8081` from another device and that importing the CA "silence[s] it for good on every device on your LAN". With the CA trusted, a browser still fails the IP connection with `ERR_CERT_COMMON_NAME_INVALID` because the leaf carries no `IP:` SAN; `hostname -f` on a typical LAN host is not resolvable from other devices either, so the only warning-free path is `localhost` on the host itself. `make_leaf` already supports IP SANs (certs.sh:44-47) but the installer never passes any. Expected: add the host's non-loopback IPv4 addresses (and/or an `--ui-san` flag) to the UI leaf, or correct the docs.

**Repro / evidence.**

```
$ grep -n 'make_leaf arm-ui' deploy/install/flow.sh devtools/setup-dev.sh
deploy/install/flow.sh:233:    make_leaf arm-ui localhost "$(hostname -f 2>/dev/null || hostname || echo localhost)"
devtools/setup-dev.sh:214:    make_leaf arm-ui localhost "$(hostname -f 2>/dev/null || hostname || echo localhost)"
# after armctl install: openssl x509 -in arm/certs/arm-ui.crt -noout -ext subjectAltName
#   -> DNS:arm-ui, DNS:localhost, DNS:<hostname>   (no IP:)
```

**Suggested fix location.** `deploy/install/flow.sh` Certificates step (collect `hostname -I` addresses, pass as extra SANs, re-issue when the address set changes) with a matching line in `devtools/setup-dev.sh`; or rewrite the two doc sections to say "by hostname only".

**Verification.** Static: SAN construction in certs.sh + call sites. Browser behaviour is standard RFC 6125 matching; untested-needs-hardware for the end-to-end check (`armctl install`, open `https://<lan-ip>:8081` from a device that trusts `arm-ca.crt`).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/215

### D-218  S3  open  docs  slice D1

**Title.** `MAKEMKV_KEY` in `~/arm/.armctl/.env` is documented as a working key source in three places, but no container ever receives it.

**Where.** `docs/user/MakeMKV.md:19,37`, `docs/user/MakeMKV-Ripper.md:10`, `docs/user/Configuring-ARM.md:41` at `2625b3e7`. Code: `docker-compose.yml.example:40-104` (backend environment, no `MAKEMKV_KEY`), `services/backend/arm_backend/ripper_manager.py:122-139` (ripper env, no `MAKEMKV_KEY`), `services/backend/arm_backend/config.py` (no such setting).

**What.** The ripper's `update_key.sh` / `makemkv_key.py` do honour a `MAKEMKV_KEY` in the ripper container's environment, but rippers are spawned by the backend with the fixed env in `container_spec`, and the compose template forwards nothing named `MAKEMKV_KEY` to the backend. A user who follows the docs and puts the key in `.env` gets no error; the ripper silently falls back to the forum beta scrape (and "App key incorrect" when that fails). Expected: either forward `MAKEMKV_KEY` through the backend into `container_spec` (like the `ARM_RIPPER_*` tunables) or remove the env path from the three pages and keep only the UI/`Config.makemkv_key` path (`devtools/iso-smoke.sh:255-258` already states the ripper "no longer reads MAKEMKV_KEY from its own environment").

**Repro / evidence.**

```
$ grep -rn 'MAKEMKV_KEY\b' docker-compose.yml.example services/backend/arm_backend/*.py | grep -v KEYCHECK
(no output)
$ grep -n 'MAKEMKV_KEY=T' docs/user/MakeMKV.md docs/user/MakeMKV-Ripper.md
docs/user/MakeMKV.md:19:2. **You supply a key via env.** Set `MAKEMKV_KEY=T-…` in `~/arm/.armctl/.env`. Used when
docs/user/MakeMKV-Ripper.md:10:2. **Operator-supplied env key** — set `MAKEMKV_KEY=T-…` in the ripper service environment (typically `.env`). ...
```

**Suggested fix location.** `docs/user/MakeMKV.md`, `docs/user/MakeMKV-Ripper.md`, `docs/user/Configuring-ARM.md` (drop or mark the env path), or `docker-compose.yml.example` + `arm_backend/config.py` + `ripper_manager.py` if the env path is wanted.

**Verification.** grep above; read of `ripper_manager.container_spec` and the compose template.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/216

### D-219  S3  open  ci  slice D1

**Title.** `publish-wiki.yml` syncs `docs/user` to the live GitHub wiki on every `pull_request_review`, i.e. from the PR's unmerged merge commit; its one action is pinned with `# main`, and the `gollum` trigger is dead.

**Where.** `.github/workflows/publish-wiki.yml:3-7,17-18,24` at `2625b3e7`.

**What.** The workflow runs on `pull_request_review: submitted` with `contents: write` and the `ARM_WIKI_TOKEN` secret. For a same-repo PR, `actions/checkout` checks out `refs/pull/N/merge`, so a reviewer submitting any review (comment, request-changes) publishes that PR's `docs/user/**` to the public wiki before it is merged (and a later push to `main` reverts it). The `gollum:` trigger is listed but the only job has `if: github.event_name != 'gollum'`, so it fires a no-op run. `newrelic/wiki-sync-action@8fb7a9ef… # main` is a SHA but violates the `# vX.Y.Z` convention (`.claude/memory/feedback_pin_actions_to_sha.md`) and dependabot cannot track a branch comment. Expected: trigger only on `push: main` (+ `workflow_dispatch`), drop `gollum`, and pin to a release tag comment.

**Repro / evidence.**

```
$ sed -n 3,7p .github/workflows/publish-wiki.yml
on:
  push:
    branches: [main]
    paths:
      - docs/user/**
  pull_request_review:
    types: [submitted]
  gollum:
$ sed -n 24p .github/workflows/publish-wiki.yml
        uses: newrelic/wiki-sync-action@8fb7a9efe4e975bdb2977107fbed96fa0433db52 # main
```

**Suggested fix location.** `.github/workflows/publish-wiki.yml` — trigger list and the `uses:` comment.

**Verification.** Static read; GitHub's documented checkout ref for `pull_request_review` events. Not reproduced (no GitHub access in this review).

**Issue.** https://github.com/uprightbass360/arm-v3/issues/217

### D-220  S3  open  devtools  slice D1

**Title.** `setup-dev.sh` creates `arm/iso-library/` and the template mounts it at `/ingress`, but `.env` never gets `ARM_HOST_ISO_LIBRARY_PATH`, so a dev stack reports "Rip from ISO" as not configured (dev sibling of D-119).

**Where.** `devtools/setup-dev.sh:203,240-299` at `2625b3e7` (the dir is created; `.env` is written from `.env.example` where the key is commented out, line 74; only `ARM_GPUS`, `ARM_RENDER_GID`, `ARM_TRANSCODE_CAPABLE` are set afterwards). Consumers: `docker-compose.yml.example:69,111`, `services/backend/arm_backend/iso_library.py:15-24` (empty → not configured).

**What.** The dev template mounts `${ARM_HOST_ISO_LIBRARY_PATH:-./arm/iso-library}:/ingress:ro`, so the folder IS inside the backend, but the backend's `ARM_HOST_ISO_LIBRARY_PATH` env resolves to `""` and `iso_library` treats the feature as unconfigured (503 from the picker; `GET /api/iso/library`). `devtools/iso-smoke.sh:309-316` works around it by telling the developer to append the key by hand and re-run `setup-dev.sh up`. D-119 fixed the same gap in `armctl install` (`deploy/install/config.sh:493`) but not in the dev script that shares the library. Expected: `setup-dev.sh` writes `ARM_HOST_ISO_LIBRARY_PATH=${ARM_DIR}/iso-library` when the key is absent/empty, as it does for `ARM_RENDER_GID`.

**Repro / evidence.**

```
$ grep -n 'ARM_HOST_ISO_LIBRARY_PATH' devtools/setup-dev.sh
(no output)
$ grep -n 'ARM_HOST_ISO_LIBRARY_PATH' .env.example docker-compose.yml.example
.env.example:74:#ARM_HOST_ISO_LIBRARY_PATH=/mnt/nas/iso
docker-compose.yml.example:69:      ARM_HOST_ISO_LIBRARY_PATH: ${ARM_HOST_ISO_LIBRARY_PATH:-}
docker-compose.yml.example:111:      - ${ARM_HOST_ISO_LIBRARY_PATH:-./arm/iso-library}:/ingress:ro
```

**Suggested fix location.** `devtools/setup-dev.sh` (next to the `ARM_RENDER_GID` set-or-append block, ~line 267); pin it in `devtools/test-setup-dev.sh`.

**Verification.** Static trace; `iso_library.py:15-24` read. Zero-infra reproduction: run `setup-dev.sh` on a fresh checkout and `grep ARM_HOST_ISO_LIBRARY_PATH .env` → only the commented example line.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/218

### D-221  S3  open  ci  slice D1

**Title.** `weekly-rebuild.yml` refreshes `arm-transcode:<tag>` but not the `:<tag>-nvidia` alias `release.yml` published; the two tags documented as "the same image" diverge after the first weekly run.

**Where.** `.github/workflows/weekly-rebuild.yml:91,161-171` vs `.github/workflows/release.yml:67,109-113` at `2625b3e7`. Docs claiming identity: `release.yml:8-10`, `docs/user/Hardware-Transcoding.md:184-189,199`, `.env.example:53-55`.

**What.** The release matrix carries `alias: "-nvidia"` for the base transcode leg and tags the same digest twice. The weekly rebuild's matrix has no `alias`, and its `metadata-action` step emits only `type=raw,value=<tag>` with the leg suffix, so the CVE-refresh rebuild never re-pushes `<tag>-nvidia`. An operator who followed Hardware-Transcoding.md and set `ARM_TRANSCODE_IMAGE_NVENC=.../arm-transcode:v3.x.y-nvidia` keeps pulling the stale digest with no signal, defeating the workflow's stated purpose ("users pinned to the supported stable tag get CVE-patched bits"). `write_image_pins` (config.sh:443-446) also never pins `ARM_TRANSCODE_IMAGE_NVENC`, so such a user is not moved by `armctl upgrade` either. Expected: add the `alias` leg + alias tag lines to weekly-rebuild (same as release.yml), or stop publishing the alias.

**Repro / evidence.**

```
$ grep -n 'alias' .github/workflows/release.yml .github/workflows/weekly-rebuild.yml
.github/workflows/release.yml:67:          - {service: transcode, target: base, suffix: "", alias: "-nvidia"}
.github/workflows/release.yml:109:          # `alias` (base transcode only) adds a second tag for the same
.github/workflows/release.yml:113:            type=ref,event=tag,suffix=${{ matrix.alias }},enable=${{ matrix.alias != '' }}
(weekly-rebuild.yml: no match)
```

**Suggested fix location.** `.github/workflows/weekly-rebuild.yml` matrix + "Compute image tags" step; optionally `deploy/install/config.sh:write_image_pins` for `ARM_TRANSCODE_IMAGE_NVENC`.

**Verification.** Static diff of the two workflows.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/219

### D-222  S4  open  docs  slice D1

**Title.** Hardware-Transcoding says NVIDIA needs "driver >= 418.81" while the installer skips NVENC entirely below driver 530.

**Where.** `docs/user/Hardware-Transcoding.md:21` vs `deploy/lib/detect.sh:14,26-28` and `services/transcode/Dockerfile:272-284` at `2625b3e7`.

**What.** `detect_gpus` advertises NVENC only when `nvenc_driver_ok` sees major >= `ARM_NVENC_MIN_DRIVER=530` (the nv-codec-headers 12.1.14.0 floor the Dockerfile pins); on 418–529 it writes no NVIDIA entry to `ARM_GPUS` and warns. The user page's "Older cards need driver >= 418.81" sends an operator on a 470/525 driver to look for a different cause when the GPU never appears. Expected: state the 530 floor (and keep it in lockstep per `feedback_nvenc_header_driver_pin.md`).

**Repro / evidence.**

```
$ grep -n 'ARM_NVENC_MIN_DRIVER=' deploy/lib/detect.sh
14:ARM_NVENC_MIN_DRIVER=530
$ sed -n 21p docs/user/Hardware-Transcoding.md
| **NVIDIA** | NVENC | GeForce GTX Pascal (1050+) or RTX Turing (1650+, 2060+). Older cards need driver >= 418.81. |
```

**Suggested fix location.** `docs/user/Hardware-Transcoding.md:21` (and the "GPU isn't detected" entry in Troubleshooting.md could name the warning text from detect.sh:27).

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/220

### D-223  S4  open  docs  slice D1

**Title.** Three user pages link to `README.md#local-development`, a heading the README does not have.

**Where.** `docs/user/Getting-Started.md:147-150`, `docs/user/Troubleshooting.md:170-173`, `docs/user/Status-Known-Issues.md:12-15` at `2625b3e7`; `README.md` headings are Overview / Features / Usage / Requirements / Install / Troubleshooting / Contributing / License.

**What.** The "image pull returns 404 during the alpha; build locally" escape hatch points at a non-existent anchor, so the one place a blocked installer-user is sent lands on the top of the README with no build instructions. (The absolute GitHub URL also bypasses the docs site's link checker, which only validates relative links, so `npm test` in `site/` cannot catch it.) Expected: link to `CONTRIBUTING.md` § dev setup or `docs/developers/contributing/Contribute.md`, or add the section to README.

**Repro / evidence.**

```
$ grep -n '^## ' README.md
27:## Overview  34:## Features  53:## Usage  60:## Requirements  67:## Install  75:## Troubleshooting  78:## Contributing  84:## License
$ grep -rn 'README.md#local-development' docs/user | wc -l
3
```

**Suggested fix location.** The three pages.

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/221

### D-224  S4  open  devtools  slice D1

**Title.** Stale descriptions of removed behaviour: devtools/README.md says iso-smoke "borrows an enrolled drive"; the compose template says "install.sh adds that volume automatically"; `.env.example` says armctl writes `./ssh`.

**Where.** `devtools/README.md:56` (also `:17,19` say certs go under `certs/` and that `docker-compose.yml` is created from the template; the data dir is `arm/certs/`), `docker-compose.yml.example:92-96`, `.env.example:152` at `2625b3e7`. Code: `devtools/iso-smoke.sh:5-8` ("no longer borrows … a real enrolled drive"), `devtools/test-setup-dev.sh` ("iso-smoke no longer borrows a drive" passes), `deploy/install/config.sh:511,544-545` (`ARM_TRANSCODE_SSH_DIR=${ARM_DIR}/ssh`, the mount is written by `armctl install` into `host-overlay.yml`), `install.sh:1-6` (bootstrap only).

**What.** devtools/README.md describes the pre-D-015/D-020 iso-smoke (`ARM_SMOKE_DRIVE_ID`, stopping the manager-created container) that the script and its test both say is gone. The compose comment credits `install.sh` with adding the ssh volume, but `install.sh` is now a bootstrap and the volume comes from `armctl install`'s generated host overlay; `.env.example` says the value is `./ssh` while config.sh writes an absolute path. Minor, but these are the files `env_merge_new_keys` ships verbatim to every production install.

**Repro / evidence.**

```
$ sed -n 56p devtools/README.md | cut -c1-120
Prereqs: dev stack up (`docker compose up -d arm-db arm-backend arm-ui`) and at least one **enrolled** drive. The script borrows
$ sed -n 94p docker-compose.yml.example
      # install.sh adds that volume automatically; if you hand-copy this
$ grep -n 'ARM_TRANSCODE_SSH_DIR' deploy/install/config.sh
511:        env_set ARM_TRANSCODE_SSH_DIR "${ARM_DIR}/ssh"
```

**Suggested fix location.** `devtools/README.md` (iso-smoke + setup-dev sections), `docker-compose.yml.example:92-96`, `.env.example:151-157`.

**Verification.** grep + read.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/222

### D-225  S4  open  ci  slice D1

**Title.** `stale.yml` runs with no `permissions:` block, and CI builds/tests the UI on Node 24 while `.nvmrc`, the ui-neu Dockerfile and `setup-dev.sh` require Node 26.

**Where.** `.github/workflows/stale.yml:1-15` (no `permissions:`), `.github/workflows/ci.yml:23` (`NODE_VERSION: '24'`), `.github/workflows/docs-pages.yml:262` (`'24'`) vs `services/ui-neu/frontend/.nvmrc` (`26`), `services/ui-neu/Dockerfile:445,454` (`node:26-slim`), `devtools/setup-dev.sh:178` ("install Node 26 (matches … .nvmrc / Dockerfile)") at `2625b3e7`.

**What.** Every other workflow declares least-privilege `permissions:`; `stale.yml` inherits the repository default token scope (write-all on older repos, or read-only on hardened ones, where `actions/stale` then fails to label/close). `check-ui-neu`, `lint-ui-neu`, `test-ui-neu`, `codegen-ui-neu` and `test-site` run `npm ci`/vitest/svelte-check/codegen on Node 24, so CI does not exercise the toolchain the image ships and contributors are told to use; a Node-26-only or Node-24-only breakage passes in one place and fails in the other. Expected: `permissions: issues: write, pull-requests: write` on stale.yml; `NODE_VERSION` read from `.nvmrc` (`node-version-file`) or set to 26.

**Repro / evidence.**

```
$ grep -c '^permissions:' .github/workflows/*.yml | grep ':0'
.github/workflows/stale.yml:0
$ cat services/ui-neu/frontend/.nvmrc; grep -n "NODE_VERSION:" .github/workflows/ci.yml .github/workflows/docs-pages.yml
26
.github/workflows/ci.yml:23:  NODE_VERSION: '24'   
.github/workflows/docs-pages.yml:262:  NODE_VERSION: '24'
```

**Suggested fix location.** `.github/workflows/stale.yml`, `.github/workflows/ci.yml`, `.github/workflows/docs-pages.yml` (`actions/setup-node` supports `node-version-file: services/ui-neu/frontend/.nvmrc`).

**Verification.** grep.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/223

### D-226  S4  open  docs  slice D1  regression of D-019

**Title.** User docs still describe the per-drive `armv3-ripper-srN` compose model: container names, "devices passed in / paired by the scanner", a per-drive `ID_PATH` udev rule, and `docker compose exec ripper`.

**Where.** `docs/user/Troubleshooting.md:23,25-27,29,47,57-68`, `docs/user/MakeMKV.md:34`, `docs/user/MakeMKV-Ripper.md:18` at `2625b3e7`. Code: `services/backend/arm_backend/ripper_manager.py:100-114` (names are `arm-ripper-<serial>-<id6>` / `arm-ripper-iso-<id12>`), `:43,155` (device cgroup rules, no `devices:`), `deploy/lib/udev.sh:17-20` (unscoped `KERNEL=="sr[0-9]*"` rule).

**What.** D-019 moved the wiki into `docs/user` (publish-wiki.yml syncs it) and most pages were rewritten, but Troubleshooting still tells users `docker ps` should list `armv3-ripper-srN`, to `docker logs -f armv3-ripper-sr0` / `docker inspect armv3-ripper-sr0`, that "each drive needs both its block device and its SCSI-generic node passed in. The backend's drive scanner pairs them when it starts the ripper", and hand-writes a udev rule scoped by `ENV{ID_PATH}` "for the ARM drive(s) only" while the installer writes an unscoped rule for every `sr*`. MakeMKV.md names `armv3-ripper-sr0`; MakeMKV-Ripper.md names a compose service `ripper` that does not exist. None of these commands work on a v3 stack.

**Repro / evidence.**

```
$ grep -rn 'armv3-ripper\|compose exec ripper\|SCSI-generic node passed' docs/user
docs/user/Troubleshooting.md:23:   `armv3-ripper-srN` as up. ...
docs/user/Troubleshooting.md:26:   device and its SCSI-generic node passed in. The backend's drive scanner
docs/user/Troubleshooting.md:29:   `docker logs -f armv3-ripper-sr0`. ...
docs/user/Troubleshooting.md:47:(`docker inspect armv3-ripper-sr0`).
docs/user/MakeMKV.md:34:docker exec armv3-ripper-sr0 grep app_Key /home/arm/.MakeMKV/settings.conf
docs/user/MakeMKV-Ripper.md:18:docker compose exec ripper grep app_Key /home/arm/.MakeMKV/settings.conf
```

**Suggested fix location.** The three pages; point readers at `bash devtools/ripper-containers.sh list` / `docker ps --filter label=arm.drive_id` and the Drives page, and describe the cgroup + pre-created nodes model (06-deployment.md:156-157 has it right).

**Verification.** grep + read of ripper_manager.py / udev.sh.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/224

### D-227  S4  open  docs  slice D1  regression of D-056

**Title.** Bare `docker compose up -d` is still the instruction in eight developer-facing places, contrary to CLAUDE.md / CONTRIBUTING.md ("never a bare docker compose").

**Where.** `devtools/README.md:56`, `docs/developers/contributing/real-disc-smoke.md:116`, `docs/user/Hardware-Transcoding.md:250`, `docs/user/Web-UI.md:92` (`docker compose logs` on a production install that has no compose file), `devtools/setup-dev.sh:371`, `devtools/crash-drill.sh:60,75`, `devtools/seed-test-data.sh:34,53`, `devtools/iso-smoke.sh:283` at `2625b3e7`.

**What.** D-056's original anchors (`CONTRIBUTING.md:65-66`, `Contribute.md:32-33`) are fixed, but the same instruction survives in the devtools README, the real-disc runbook, two user pages and the error/usage text of four dev scripts. A dev who follows `crash-drill.sh`'s own hint (`cd … && docker compose up -d`) starts the stack without the spawned-container cleanup, the guard or the backup that `setup-dev.sh up` exists for; a production user following Web-UI.md:92 gets "no configuration file provided". Expected: `bash devtools/setup-dev.sh up` in dev text, `armctl compose logs` / `armctl up` in user pages.

**Repro / evidence.**

```
$ grep -rn 'docker compose up -d' devtools/*.sh devtools/README.md docs/user docs/developers | grep -v 'never\|bare' 
devtools/setup-dev.sh:371:  (or: docker compose up -d --build; no backup or health wait)
devtools/crash-drill.sh:60:    err "    cd ${ROOT_DIR} && docker compose up -d"
devtools/seed-test-data.sh:53:        echo "stack not running ($svc is down); start it with: docker compose up -d" >&2
devtools/iso-smoke.sh:283:            err "bring the stack up first: cd ${ROOT_DIR} && docker compose up -d arm-db arm-backend arm-ui"
devtools/README.md:56:Prereqs: dev stack up (`docker compose up -d arm-db arm-backend arm-ui`) ...
docs/developers/contributing/real-disc-smoke.md:116:docker compose up -d arm-db arm-backend arm-ui       # if not already up
docs/user/Hardware-Transcoding.md:250:  the old environment; run `armctl up` (or `docker compose up -d`) instead.
```

**Suggested fix location.** The files listed; `devtools/test-setup-dev.sh` could pin the absence in `devtools/*.sh`.

**Verification.** grep above.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/225

### D-228  S4  open  docs  slice D1

**Title.** Deployment docs describe the optical-access and first-boot mechanisms the code does not use: `group_add`, `CDROM_GID` via `stat -c %g /dev/sr0`, compose `devices:`, and a "random" first-boot admin password.

**Where.** `docs/user/Getting-Started.md:61-62`, `docs/user/Configuring-ARM.md:29`, `docs/developers/architecture/06-deployment.md:226,256,265,397` at `2625b3e7`. Code: `deploy/lib/detect.sh:92-96` (`getent group cdrom`, else 44), `services/_common/docker-entrypoint.sh:350-366` (`usermod -aG` + `mknod` of `sr0..7`/`sg0..15`), `services/backend/arm_backend/ripper_manager.py:43,155` (`device_cgroup_rules`, no `devices`), `services/backend/arm_backend/seeders.py:45-46,66-69` (`ADMIN_DEFAULT_PASSWORD = "admin"`).

**What.** 06-deployment.md contradicts itself (lines 156-157 describe the cgroup + pre-created-node model; lines 256 and 265 say "drive exposed via compose `devices:`" and "`group_add: [\"${CDROM_GID}\"]`"), and says the admin seed is "a random password written to /logs/first-boot.log" while the seeder writes the fixed default `admin` (which Getting-Started.md:155 states correctly). Configuring-ARM says `CDROM_GID` is "detected via `stat -c %g /dev/sr0`"; the installer uses `getent group cdrom` with fallback 44 and never looks at `/dev/sr0`. Expected: one description matching `detect.sh`, `docker-entrypoint.sh`, `ripper_manager.py` and `seeders.py` (`feedback_docs_describe_current_state.md`).

**Repro / evidence.**

```
$ grep -n 'group_add\|stat -c %g /dev/sr0\|random password' docs/user/Getting-Started.md docs/user/Configuring-ARM.md docs/developers/architecture/06-deployment.md
docs/user/Getting-Started.md:62:granted access to the drive via `group_add` automatically.
docs/user/Configuring-ARM.md:29:| `CDROM_GID` | The host's optical group GID, detected via `stat -c %g /dev/sr0` ...
docs/developers/architecture/06-deployment.md:226:CDROM_GID=<detected via `stat -c %g /dev/sr0`, else 44>
docs/developers/architecture/06-deployment.md:256:The ripper containers also need `group_add: ["${CDROM_GID}"]` ... detects it via `stat -c %g /dev/sr0`.
docs/developers/architecture/06-deployment.md:265:| `arm-ripper-*` | no | `/dev/sr*` | Drive exposed via compose `devices:` ...
docs/developers/architecture/06-deployment.md:397:... seeds the `admin` user with a random password written to `/logs/first-boot.log` ...
```

**Suggested fix location.** The three pages; `deploy/lib/detect.sh:90-91` comment is the correct source for `CDROM_GID`.

**Verification.** grep + read of the referenced code.

**Issue.** https://github.com/uprightbass360/arm-v3/issues/226

