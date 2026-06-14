---
name: project_ui_port_migration
description: UI port — migrating the neu SvelteKit UI into the v3 tree. Backend target ready (integration/ui-port-target, no blockers). NEXT STEP = decide what/where/how to import the UI code (open questions below); not started yet.
metadata:
  type: project
---

**Goal:** port the **neu SvelteKit UI** to run against the ARM v3 backend, retaining its
featureset. As of 2026-06-14 the decision is to **migrate the UI code into a new location
in the v3 tree** (this repo) rather than keep it in its separate repo.

## Backend target — READY (no blockers)
- A UI-port blocker audit (2026-06-14) found **NO fundamental backend feature blockers.**
  The audit's one false alarm (notifications) is actually built + stacked (Tier-3/#8); it
  only looked missing because the audit checked *bare* `wolfy/main`. Auth/login is ready
  (JWT + `password_must_change`, no `/me` needed). Themes (B9 unbuilt) + image-proxy (B13
  deferred) degrade gracefully in the UI. Transcoder/config/drives/tracks/naming shipped
  with field-rename adapters (BC-S5–S13). Dashboard composes client-side (B14 wontfix).
- **The assembled backend target is `integration/ui-port-target`** (on origin, `570311a3`):
  new `wolfy/main` (incl. the merged rc2 fix PR #17) + a clean merge of the stack tip
  (`feat/track-operator-editing`, all 11 tiers #6–#16). Full suite **1287 green**. The UI
  port runs against THIS (bare wolfy/main lacks the unmerged tiers). Rebuild after a new
  tier lands by re-merging the new stack tip. See [[project_wolfy_pr_stack_state]].

## The UI source to migrate
- `/home/upb/src/automatic-ripping-machine-ui/` — its **own git repo** (HEAD `5f2425c`).
  - `frontend/` (262M incl. node_modules/.venv — SvelteKit + Tailwind 4; `frontend/src/`).
  - `backend/` (1.1M — a Python **BFF** the SvelteKit app talks to; `backend/services/`:
    `arm_client.py` (proxies to ARM), `transcoder_client.py`, `themes.py`, `image_cache.py`,
    `system_cache.py`). The frontend hits the BFF, the BFF proxies to ARM v3.
  - UI AI-context lives at `/home/upb/src/arm-ai/arm-ui/` (specs/plans/memory).
- This v3 tree already has `services/ui/` = the **current Vue 3 SPA** (the thing being
  replaced/superseded by the SvelteKit port).

## OPEN DECISIONS — resolve before importing (asked, not yet answered):
1. **What code:** the SvelteKit `frontend/` only, or frontend + the Python `backend/` BFF?
   (v3's arch has no BFF today — the Vue SPA talks straight to FastAPI. Porting the BFF too
   is a bigger arch question; the BFF's themes/image_cache services overlap v3 wontfix/defer
   decisions. Likely: frontend-first, decide BFF separately — but CONFIRM.)
2. **Where:** replace `services/ui/` (the Vue SPA), or a fresh path (`services/ui-svelte/`
   / `services/web/`) alongside it during transition? (Replacing is cleaner long-term;
   alongside lets both coexist while porting.)
3. **Which branch:** a real feature branch (off the stack tip `feat/track-operator-editing`,
   as the next stacked tier — OR off `integration/ui-port-target`). NOT the throwaway
   integration branch directly. (Currently checked out on `integration/ui-port-target`.)
4. **Copy vs history-preserving:** straight file copy into the new path (typical for a port)
   vs. preserving the UI repo's git history (cross-repo, heavier). Exclude
   `node_modules/.venv/.worktrees/.pytest_cache/.coverage` from whatever moves.

## Workflow notes
- This is a cross-repo, hard-to-reverse structural change — confirm what/where/how before
  moving. Use brainstorming if the scope (frontend-only vs frontend+BFF, and the
  arch-fit of a BFF in v3) needs design.
- The port itself is a distinct workstream from the backend stack; once the code is in the
  tree it becomes part of this repo's build.
