#!/bin/bash
# Git Worktree Cleanup for sagie.co Sprint Sessions
# Usage: ./scripts/worktree-cleanup.sh <branch-name>
#    or: ./scripts/worktree-cleanup.sh --all
#
# Removes a worktree after its PR has been merged.

set -e

if [ "$1" = "--all" ]; then
  echo "→ Listing all worktrees..."
  git worktree list
  echo ""
  read -p "Remove ALL worktrees except main? (y/N) " confirm
  if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    git worktree list --porcelain | grep "^worktree " | grep -v "$(pwd)" | awk '{print $2}' | while read wt; do
      echo "  Removing ${wt}..."
      git worktree remove "$wt" --force 2>/dev/null || echo "  ⚠ Could not remove ${wt}"
    done
    git worktree prune
    echo "✓ All worktrees cleaned up."
  else
    echo "Cancelled."
  fi
  exit 0
fi

BRANCH=$1
DIRNAME=$(echo "$BRANCH" | sed 's|/|-|g')
WORKTREE_PATH="../sagie-${DIRNAME}"

if [ -z "$BRANCH" ]; then
  echo "Usage: $0 <branch-name>"
  echo "   or: $0 --all"
  echo ""
  echo "Current worktrees:"
  git worktree list
  exit 1
fi

if [ ! -d "$WORKTREE_PATH" ]; then
  echo "✗ No worktree found at ${WORKTREE_PATH}"
  exit 1
fi

git worktree remove "$WORKTREE_PATH"
echo "✓ Worktree removed: ${WORKTREE_PATH}"
echo "  Branch ${BRANCH} still exists — delete with: git branch -d ${BRANCH}"
