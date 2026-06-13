---
name: project_wolfy_pr_stack_state
description: Current state of the 10-deep neu-port PR stack on wolfy (#6–#15), what's shipped, and the backlog pull queue
metadata:
  type: project
---

The neu→v3 port ships as a **linear stack of DRAFT PRs on wolfy** (`shitwolfymakes/automatic-ripping-machine`), all branched bottom-up off `main`. As of 2026-06-13:

```
main
 └ #6  feat/neu-ports           Tier-1 — metadata key-test, naming preview, ISO scan, drive ops
   └ #7  feat/tier2-ports        Tier-2 — metadata search/lookup, system preflight/paths/stats, ripping-pause gate
     └ #8  feat/notification-channels  Tier-3 — notification channels, message bus, in-app inbox
       └ #9  feat/tier4-quickwins      Tier-4 — naming validate, drive delete, system version, music disc token
         └ #10 feat/metadata-imdb-identify  Tier-5 — metadata identify imdb-id round-trip
           └ #11 feat/makemkv-key-validity  Tier-6 — makemkv key-validity (B3)
             └ #12 feat/settings-config-org Tier-7 — settings & config organization (B5)
               └ #13 feat/config-secret-masking  Tier-8 — mask secret-tier config on read (B30)
                 └ #14 feat/settings-feeders  Tier-9 — generic naming preview (B10) + transcoder-availability preflight check (B11)
                   └ #15 feat/transcoder-dashboard  Tier-10 — transcoder dashboard stats/workers/retry (B7) + per-task log viewer (B8)
```

All 10 are **DRAFT, unmerged**. PR titles are functionality-first `Tier-N — <what it does>` (no "neu ports"/"quick-wins"). Merge order is forced bottom-up by the Alembic migration chain (0013→0018) + the shared openapi snapshot; retarget each PR to `main` as the one below it merges (per CLAUDE.local.md).

**Shipped backlog items (see `../arm-ai/arm-v3/docs/port-backlog.md`, the pull queue):** B3, B5, B30, the correctness sweep B25/B26/B29, B10+B11 (Tier-9), and B7+B8 (Tier-10). B0 retired. **B31** (storage/CPU/GPU resource feed) `ready` but parked on a wolfy disk-probe decision (see `followups-for-wolfy.md`) — disk-only B31a is the cheap core, GPU live-util deferred to B31b (transcoder-side probe). Everything else (B1/B2/B4/B6/B9/B12–B24/B27/B28) still `ready`/`blocked`.

**Slot-back pattern:** the B25/B26/B29 sweep did NOT make a new PR — fixes were cascade-rebased into their origin PRs (B29+B26→#6, B25→#7, tvdb registry→#12, masking test→#13), then #6–#13 force-pushed. So a "fix" can fold into the PR that introduced the feature when that PR is still open; cost is an 8-branch cascade rebase. The proven cascade recipe: backup refs (`refs/backup/sweep-pre/*`) → rebuild each branch fresh from wolfy via `git rebase --onto <new-parent> wolfy/<old-parent> <branch>` (NOT plain `git rebase`, which replays prior local edits and conflicts) → regen snapshot per layer → verify full suite green → force-push-with-lease bottom-up.

**Layer-aware test trap (cost me a re-cascade):** a test authored at a low layer that asserts behavior introduced at a HIGHER layer breaks at the top. The fix goes at the LOW layer (so it flows up), made layer-agnostic. Example: the tvdb round-trip test must assert the stored value + field-presence, NOT cleartext — because secret-masking at #13 turns the GET value into `<hidden>`.

Workflow per batch: brainstorming → writing-plans → subagent-driven-development (or hybrid: subagents for isolated fixes, inline for git surgery) → finishing-a-development-branch. Specs/plans live in `../arm-ai/arm-v3/docs/superpowers/{specs,plans}/`. Backlog + BC log (`neu-ui-port-breaking-changes.md`, BC-N*/BC-S*) in `../arm-ai/arm-v3/docs/`. See [[wolfy-pr-workflow]] for the push mechanics.
