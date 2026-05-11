# DEV Branch Workflow — Effective 04-26-2026

## Branching model

```
feature/* ──→ dev ──→ main (production)
```

- **main** = production. Only receives merges from `dev` when changes are ready to ship.
- **dev** = integration branch. All feature work merges here first.
- **feature/*** = individual feature branches, created from `dev`.

## Rules

1. Never push directly to `main` — only merge `dev` → `main` via PR
2. Never push directly to `dev` — feature branches merge via PR
3. CI must pass on all PRs (5 checks: preflight, lint, typecheck, unit, e2e-preview)
4. `main` branch protection stays active
5. Add branch protection to `dev` as well (same rules)

## Vercel environments

| Branch | Vercel Environment | URL |
|--------|-------------------|-----|
| `main` | Production | sagie.co |
| `dev` | Preview | Assign stable alias in Vercel dashboard (e.g., `dev-sagie.vercel.app`) |
| `feature/*` | Preview | Auto-generated preview URLs |

### Vercel setup steps (manual, in Vercel dashboard)

1. Go to Project Settings → Git
2. Production Branch should already be `main` — confirm
3. Go to Project Settings → Domains
4. Optionally add a preview domain alias for the `dev` branch
5. Go to Project Settings → Environment Variables
6. Set `NEXT_PUBLIC_LAUNCH_MODE=simple` for **Production** environment only
7. Do NOT set it for Preview or Development — this keeps dev/preview fully functional

## Daily workflow

```bash
# Starting new feature work
git checkout dev
git pull origin dev
git checkout -b feature/my-feature

# ... build the feature ...

# Push and create PR targeting dev
git push origin feature/my-feature
# Create PR: feature/my-feature → dev

# When dev is ready for production
git checkout dev
git pull origin dev
# Create PR: dev → main
```

## Worktree adaptation

The existing worktree workflow still works — just change the base:

```bash
# Old: worktrees from main
git worktree add ~/SAGIE-HQ/sagie-feature-x -b feature/x origin/main

# New: worktrees from dev
git worktree add ~/SAGIE-HQ/sagie-feature-x -b feature/x origin/dev
```

Update `scripts/worktree-setup.sh` to use `origin/dev` instead of `origin/main`.

## Rollback

If something breaks in production:
1. Revert the merge commit on `main`
2. OR: Vercel dashboard → Deployments → promote a previous deployment

## Launch mode toggle

The `NEXT_PUBLIC_LAUNCH_MODE=simple` env var controls the route gate:
- Set in Vercel Production → site shows homepage only
- Remove or change value → full site accessible
- No deploy needed to toggle — just update env var and redeploy from Vercel dashboard
