---
name: wolfy-pr-workflow
description: How to push branches and open PRs on the wolfy partner repo (token dance + non-fork in-repo PR path)
metadata:
  type: feedback
---

PRs target **wolfy** (`shitwolfymakes/automatic-ripping-machine`), the RC line — NOT origin (`uprightbass360/arm-v3`, a standalone non-fork). Full detail in the git-ignored `CLAUDE.local.md`; the load-bearing bits:

**Every wolfy git/gh command must start with `unset GITHUB_TOKEN`.** A read-only fine-grained PAT lives in the `GITHUB_TOKEN` env var and overrides gh's stored classic `gho_` token on every call → pushes/PRs fail with permission errors. `unset` is per-shell/per-Bash-call in this harness (doesn't persist), so prefix it on each push. Then `gh auth setup-git` routes git HTTPS creds through gh. Confirm with `gh auth status` (want the `gho_` classic token, scopes incl. `repo`).

**Cross-repo PRs do NOT work** — `uprightbass360/arm-v3` is `fork: false` with no `parent`, so GitHub can't resolve `--head uprightbass360:<branch>`. Instead: push the branch INTO wolfy and open an in-repo PR:
```
unset GITHUB_TOKEN; gh auth setup-git
git push wolfy <branch>:<branch>          # also push origin <branch>:<branch> for backup
gh pr create --repo shitwolfymakes/automatic-ripping-machine \
  --base <parent-branch> --head <branch> --draft --title "..." --body "..."
```
Stacked PRs target the branch below them (not `main`); retarget to `main` as each lands.

**Why:** the agent harness injects a read-only `GITHUB_TOKEN`; the classic token with write access is only reachable once that env var is unset. Branches are pushed to BOTH wolfy (PR target) and origin (backup). See [[project_wolfy_pr_stack_state]] for the current stack.

**How to apply:** prefix `unset GITHUB_TOKEN` on every wolfy/origin git+gh command; never rely on the env token; open PRs in-repo on wolfy, never cross-repo.
