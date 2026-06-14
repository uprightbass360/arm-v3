---
name: project_ui_port_migration
description: UI port — neu SvelteKit UI + Python BFF migrated into the v3 tree at services/ui-neu/ (DONE 2026-06-14, branch feat/ui-neu-migration off Tier-12). Next = wire it into v3 build/contract & port against the v3 backend.
metadata:
  type: project
---

**Goal:** port the **neu SvelteKit UI** to run against the ARM v3 backend, retaining its
featureset. The decision (2026-06-14) was to **migrate the UI code into the v3 tree** rather
than keep it in its separate repo.

## STATUS: code migrated (2026-06-14) — DONE
The snapshot import is complete. Remaining work is wiring/porting, not moving.

- **Location:** `services/ui-neu/` (new path; coexists with the existing Vue `services/ui/`
  during the port — cut over / delete the Vue SPA once SvelteKit reaches parity).
- **Branch:** `feat/ui-neu-migration`, based off the stack tip `feat/track-operator-editing`
  (Tier-12 / B19, `5f60cd21`). Commit `47cb01ad`. Pushed to **origin** AND **wolfy**
  (`feat/ui-neu-migration`); PR not opened yet. It is the next stacked tier on the wolfy line.
- **Integration branch rebuilt:** `integration/ui-port-target` re-merged the migration
  (`ee643103`), suite **1287 green**, pushed to origin. (Feature branch alone: 1280 green —
  the 7-test delta is the integration branch's extra merge content, expected.)

### Resolved decisions (the 4 open questions, answered 2026-06-14)
1. **What:** frontend + Python BFF — both `frontend/` (SvelteKit) and `backend/` (FastAPI BFF).
2. **Where:** new path `services/ui-neu/` (user named it "ui-neu").
3. **Branch:** new feature branch off the stack tip (not on the throwaway integration branch).
4. **How:** plain copy snapshot, no git history.

### What was copied / cleaned
- Source: `/home/upb/src/automatic-ripping-machine-ui` @ `5f2425c` (its own git repo).
- Kept (317 files, 5.3M): `frontend/` (SvelteKit src), `backend/` (BFF), `components/contracts/`,
  `Dockerfile`, `docker-compose.yml`, `requirements*.txt`, `pyproject.toml`, `scripts/`,
  `docs/`, `design_handoff_notifications_settings/`, `tests/`, README/LICENSE/VERSION/CHANGELOG,
  `.dockerignore`/`.env.example`/`.gitignore` (service .gitignore force-added — v3 root
  `.gitignore:171` has a literal `.gitignore` rule that ignores all nested ones).
- **`components/contracts/` was a git submodule** (`automatic-ripping-machine-contracts`);
  vendored as plain files — dropped its `.git` gitlink and the repo `.gitmodules`. The
  Dockerfile/compose build it via `additional_contexts: contracts: ./components/contracts`.
- Dropped: build/cache artifacts (node_modules, .svelte-kit, build, coverage, __pycache__,
  .pytest_cache), 12M of `screenshots/`, and neu's repo-level AI/CI tooling (`.claude`,
  `.superpowers`, `.github`, pre-commit, release-please, sonar, codecov).
- Renamed `CLAUDE.md` -> `CLAUDE.neu.md` so it does NOT override v3's session instructions.

### Inert to v3 tooling (verified)
`services/ui-neu` is NOT a uv-workspace member and NOT in root `pyproject.toml` `testpaths`
(scoped to the 4 existing service test dirs), so `uv run pytest` from root does not collect
its tests and `uv sync` does not pull its deps. The migration is a no-op for the v3 backend
suite (1280 green on the feature branch, same as before).

## Backend target — READY (no blockers)
- A UI-port blocker audit (2026-06-14) found **NO fundamental backend feature blockers.**
  False alarm (notifications) is built + stacked (Tier-3/#8). Auth ready (JWT +
  `password_must_change`). Themes (B9 unbuilt) + image-proxy (B13 deferred) degrade
  gracefully. Transcoder/config/drives/tracks/naming shipped with field-rename adapters
  (BC-S5–S13). Dashboard composes client-side (B14 wontfix).
- `integration/ui-port-target` (origin, now `ee643103`) = `wolfy/main` (incl. merged rc2 fix
  PR #17) + the stack tip merge + the ui-neu migration. Rebuild after a new tier lands by
  re-merging the new stack tip. See [[project_wolfy_pr_stack_state]].

## NEXT STEPS (porting, not moving)
1. **Decide the BFF's fate in v3 arch** — the neu BFF (`backend/services/`: `arm_client.py`,
   `transcoder_client.py`, `themes.py`, `image_cache.py`, `system_cache.py`) duplicates parts
   of the v3 FastAPI. v3's principle is **v3 owns the contract**; the UI adapts to v3. Either
   keep the BFF as a thin proxy or re-home its logic into the v3 backend. (Big open arch
   question — likely a brainstorm.)
2. Point the BFF/frontend at the v3 backend's OpenAPI contract (field names differ — see the
   BC-S5–S13 breaking-change entries; the UI adapts to v3, not vice-versa).
3. Wire `services/ui-neu` into the v3 compose/build as needed; decide CI scope.
4. Open the wolfy PR for `feat/ui-neu-migration` when ready (the branch is pushed).

## References
- UI AI-context: `/home/upb/src/arm-ai/arm-ui/` (specs/plans/memory).
- Breaking-change log (UI adapts to v3): `/home/upb/src/arm-ai/arm-v3/docs/neu-ui-port-breaking-changes.md`.
- This is a cross-repo structural change; the port is a distinct workstream from the
  backend stack. See [[project_wolfy_pr_stack_state]].
