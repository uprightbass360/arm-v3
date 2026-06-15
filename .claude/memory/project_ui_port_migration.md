---
name: project_ui_port_migration
description: UI port — neu UI at services/ui-neu/; arch Option A (no BFF: frontend→v3). Phase 0 (image-proxy v3 router) + Phase 1 Tier A (v3 types + authed client) DONE. Phase 1 = frontend en-masse repoint + login as a 3-PR sub-chain (A done; B login, C repoint next). CRITICAL: root .gitignore lib/ rule swallowed src/lib — fixed on the Phase-1 branch only.
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

## ARCHITECTURE DECIDED (brainstorm 2026-06-14) — Option A: NO BFF
Spec: `../arm-ai/arm-v3/docs/superpowers/specs/2026-06-14-ui-neu-port-foundation-design.md`.
The whole neu Python BFF gets **deleted**. End-state:
- **Frontend → v3 only**, nginx static + `/api/` reverse-proxy to arm-backend (mirrors the
  existing Vue `services/ui` exactly — one contract, under `openapi-drift` CI).
- **Themes** ship as **static** assets (built-ins now; user-upload backlogged).
- **Image-proxy/cache** → a small **v3 router** (the one runtime piece; unauthenticated,
  allowlist-guarded). This consolidation is what lets the BFF be deleted.
- **Aggregations** → client-side fan-out (consistent with B14).
- **`arm_contracts` dropped**; survivors (e.g. `PATTERN_TOKENS`) → `arm_common`; frontend types
  from v3 OpenAPI. **Auth:** frontend owns the JWT (login phase early).
- **Verified route inventory:** EXISTS 16 · FIELD-MISMATCH 38 · MISSING ~75 · BFF-OWNED 10. v3
  natively covers ~12%. Foundation repoints the ~54 EXISTS+FIELD-MISMATCH; the ~75 MISSING are a
  prioritized **backlog** (file-browser, maintenance, folder-import, TVDB, transcoder-model
  reconciliation, job operator verbs, etc. — each its own future spec). Foundation scope is the
  walking skeleton only; cutover/delete-Vue is OUT of scope (decide later).

## FOUNDATION PLAN (each its own stacked tier off the one below)
Phase 0 image-proxy v3 router (DONE) → **Phase 1 (collapses orig Phases 1+3+4): frontend
en-masse repoint + login** → Phase 2 nginx + static themes + delete demo/system-cache → Phase 5
delete the BFF + drop arm_contracts. (Orig Phases 3+4 — repoint EXISTS + adapters — were folded
into Phase 1.)

### Phase 0 — DONE (2026-06-14)
Branch `feat/ui-neu-image-proxy` off `feat/ui-neu-migration` (Phase-0 tier), pushed to origin +
wolfy. 5 commits: ARM_IMAGE_CACHE_PATH setting → ported image_cache (100% cov) → GET
/api/images/proxy (unauth, **SSRF-hardened**: redirects off, streaming 2MB cap, JSONResponse,
no SVG; 100% cov) → main.py wiring + startup_scan → OpenAPI snapshot regen. Full suite 1303
green. Plan: `../arm-ai/arm-v3/docs/superpowers/plans/2026-06-14-ui-neu-port-phase0-image-proxy-plan.md`.
PR not opened yet. **The image-proxy now lives in v3 — do NOT re-port it from the BFF.**

### Phase 1 — frontend en-masse repoint + login (IN PROGRESS; own 3-PR sub-chain)
Spec: `../arm-ai/arm-v3/docs/superpowers/specs/2026-06-14-ui-neu-port-phase1-frontend-repoint-design.md`.
Decided shape: components bind **directly to v3 wire types** (no translation layer); regenerate
`api.gen.ts` from v3 OpenAPI + rewrite all ~65 consumer files to v3 names; FIELD-MISMATCH deltas
absorbed inside `api/*.ts` module bodies; whole-screen feature-flag the ~75 MISSING screens; full
login (localStorage JWT, 401→redirect, `password_must_change`). Delivered as a **3-PR stacked
sub-chain** off the Phase 0 tip: **Tier A** (v3 types + authed client) → **Tier B** (login +
feature-flags) → **Tier C** (repoint api modules + components + tests; stack goes GREEN here).
**Red build across Tiers A–B is ACCEPTED** (owner-approved) — the 65 consumers don't typecheck
until C; do NOT gate Tiers A/B on `svelte-check`.

**Tier A — DONE (2026-06-14).** Branch `feat/ui-neu-fe-client` off `feat/ui-neu-image-proxy`,
pushed origin + wolfy. 4 commits: regenerate api.gen.ts from v3 snapshot (codegen.sh repointed +
vendoring path-drift fixed) → **`.gitignore` src/lib recovery** (see below) → consolidated authed
`client.ts` (shared request/handle core, `get/post/patch/del`, `buildQuery`, localStorage token
store, 401 hook; keeps `apiFetch`/`apiFormPost`; 24 client tests green) → codegen.sh comment fix.
Plan: `../arm-ai/arm-v3/docs/superpowers/plans/2026-06-14-ui-neu-port-phase1-tierA-client-plan.md`.
Backend suite still 1303 green (frontend changes inert). PR not opened. NEXT = Tier B (login).

### ⚠️ CRITICAL MIGRATION DEFECT found + fixed in Tier A — root `.gitignore` `lib/` swallowed src/lib
The migration commit (`47cb01ad`) **silently dropped the ENTIRE SvelteKit `src/lib/` tree** —
only 1 of 212 files was tracked. Cause: the root `.gitignore`'s Python-packaging rule **`lib/`
(line ~17)** matches `services/ui-neu/frontend/src/lib/`. Fixed on `feat/ui-neu-fe-client` with a
negation (`!services/ui-neu/frontend/src/lib/` + `/**`) and committed the 211 recovered files.
**The fix lives on the Phase-1 branch, NOT on main** — so on a fresh `main` checkout `src/lib` is
still ignored; it merges to wolfy/main via the PR chain. Also note **`.gitignore` line ~171 is a
literal `.gitignore`** rule (ignores all nested `.gitignore` files — why Phase-0's service
`.gitignore` needed `git add -f`). When creating new `services/ui-neu/...` files, **verify
`git check-ignore` doesn't swallow them** (esp. anything under a `lib/` or `build/` path).

## NEXT STEPS
1. Phase 1 — v3 OpenAPI client in SvelteKit + login/JWT store (brainstorm/plan when reached).
2. Open the wolfy PRs for the migration + Phase 0 tiers when ready (branches pushed).
3. **Deferred (owner directive):** wiring `ui-neu` into v3 compose/CI/test — a later structural
   pass. NOTE: the migrated `ui-neu` Python is **NOT ruff-clean to v3's config** — a
   `pre-commit run --all-files` reformats ~100 ui-neu files + leaves ~7 unfixable ruff errors
   (all under `services/ui-neu/`). When wiring CI, either clean ui-neu or exclude it from the v3
   ruff/mypy scope. For Phase-N PRs, run pre-commit **scoped to changed files**, never
   `--all-files` (it rewrites vendored BFF code that's slated for deletion).

## References
- UI AI-context: `/home/upb/src/arm-ai/arm-ui/` (specs/plans/memory).
- Breaking-change log (UI adapts to v3): `/home/upb/src/arm-ai/arm-v3/docs/neu-ui-port-breaking-changes.md`.
- This is a cross-repo structural change; the port is a distinct workstream from the
  backend stack. See [[project_wolfy_pr_stack_state]].
