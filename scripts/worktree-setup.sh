#!/bin/bash
# Git Worktree Setup for sagie.co Sprint Sessions
# Usage: ./scripts/worktree-setup.sh <branch-name>
# Example: ./scripts/worktree-setup.sh fix/accessibility-visual-tokens
#
# Creates a git worktree at ../sagie-<branch-name> based on latest origin/main.
# Each worktree = one Claude Code session = one PR.

set -e

BRANCH=$1
DIRNAME=$(echo "$BRANCH" | sed 's|/|-|g')
WORKTREE_PATH="../sagie-${DIRNAME}"

if [ -z "$BRANCH" ]; then
  echo "Usage: $0 <branch-name>"
  echo ""
  echo "Sprint 04-05 branches:"
  echo "  fix/accessibility-visual-tokens  (Track 1 — Critical)"
  echo "  fix/ui-components                (Track 2 — High)"
  echo "  fix/globe-performance            (Track 3 — High)"
  echo "  fix/scroll-position              (Track 4 — High)"
  echo "  feature/form-validation-ux       (Track 5 — Medium, after Track 1)"
  echo "  feature/svg-icons                (Track 6 — Medium, after SVGs pushed)"
  echo "  test/coverage-expansion           (Track 7 — parallel agent)"
  exit 1
fi

# Fetch latest main
echo "→ Fetching latest origin/main..."
git fetch origin main

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
  echo "✗ Worktree already exists at ${WORKTREE_PATH}"
  echo "  To remove: git worktree remove ${WORKTREE_PATH}"
  exit 1
fi

# Create worktree
git worktree add "$WORKTREE_PATH" -b "$BRANCH" origin/main
echo ""
echo "✓ Worktree created at ${WORKTREE_PATH}"
echo "  Branch: ${BRANCH}"
echo ""
echo "Next steps:"
echo "  cd ${WORKTREE_PATH}"
echo "  claude  # start Claude Code session"
