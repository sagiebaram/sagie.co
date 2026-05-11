#!/bin/bash
# Sprint Launcher — creates worktrees + tmux session from sprint plan
# Usage: ./scripts/sprint-launch.sh [sprint-file]
# Default: reads the latest .planning/SPRINT-*-SESSIONS.md
#
# What it does:
#   1. Parses branch names from the sprint sessions file
#   2. Creates git worktrees for each branch
#   3. Builds a tmux session with one pane per track
#   4. Lands you in the session, ready to paste prompts
#
# Requires: tmux, git

set -e

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "✗ Not inside a git repository"
  exit 1
fi

cd "$REPO_ROOT"

# ── Find sprint file ──────────────────────────────────────────────
SPRINT_FILE="$1"
if [ -z "$SPRINT_FILE" ]; then
  SPRINT_FILE=$(ls -t .planning/SPRINT-*-SESSIONS.md 2>/dev/null | head -1)
fi

if [ -z "$SPRINT_FILE" ] || [ ! -f "$SPRINT_FILE" ]; then
  echo "✗ No sprint sessions file found"
  echo "  Usage: $0 [path-to-sprint-sessions.md]"
  echo "  Or place a SPRINT-*-SESSIONS.md in .planning/"
  exit 1
fi

echo "→ Reading sprint plan: $SPRINT_FILE"

# ── Parse branches ────────────────────────────────────────────────
# Extracts lines like "Branch: `fix/accessibility-visual-tokens`"
BRANCHES=()
while IFS= read -r line; do
  branch=$(echo "$line" | grep -oP '(?<=Branch:\s`)[^`]+' 2>/dev/null || echo "$line" | sed -n 's/.*Branch:[[:space:]]*`\([^`]*\)`.*/\1/p')
  if [ -n "$branch" ]; then
    BRANCHES+=("$branch")
  fi
done < <(grep "Branch:" "$SPRINT_FILE")

if [ ${#BRANCHES[@]} -eq 0 ]; then
  echo "✗ No branches found in $SPRINT_FILE"
  exit 1
fi

echo "→ Found ${#BRANCHES[@]} tracks:"
for b in "${BRANCHES[@]}"; do
  echo "  • $b"
done
echo ""

# ── Check for dependency markers ──────────────────────────────────
# Tracks with ⚠️ DEPENDS ON are Wave 2 — skip unless --all flag
WAVE1_BRANCHES=()
WAVE2_BRANCHES=()

for b in "${BRANCHES[@]}"; do
  # Check if this branch's section has a DEPENDS ON marker
  if grep -A2 "Branch:.*\`$b\`" "$SPRINT_FILE" | grep -qi "depends on\|⚠️"; then
    WAVE2_BRANCHES+=("$b")
  else
    WAVE1_BRANCHES+=("$b")
  fi
done

if [ "$1" = "--wave2" ] || [ "$2" = "--wave2" ]; then
  TARGET_BRANCHES=("${WAVE2_BRANCHES[@]}")
  SESSION_NAME="sprint-w2"
  echo "→ Launching Wave 2 (${#TARGET_BRANCHES[@]} tracks)"
elif [ "$1" = "--all" ] || [ "$2" = "--all" ]; then
  TARGET_BRANCHES=("${BRANCHES[@]}")
  SESSION_NAME="sprint"
  echo "→ Launching ALL tracks (${#TARGET_BRANCHES[@]} tracks)"
else
  TARGET_BRANCHES=("${WAVE1_BRANCHES[@]}")
  SESSION_NAME="sprint-w1"
  echo "→ Launching Wave 1 (${#TARGET_BRANCHES[@]} tracks)"
  if [ ${#WAVE2_BRANCHES[@]} -gt 0 ]; then
    echo "  Wave 2 deferred (${#WAVE2_BRANCHES[@]} tracks): ${WAVE2_BRANCHES[*]}"
    echo "  Run with --wave2 after Wave 1 merges"
  fi
fi
echo ""

if [ ${#TARGET_BRANCHES[@]} -eq 0 ]; then
  echo "✗ No tracks to launch"
  exit 1
fi

# ── Create worktrees ──────────────────────────────────────────────
echo "→ Fetching latest origin/main..."
git fetch origin main

WORKTREE_PATHS=()
for branch in "${TARGET_BRANCHES[@]}"; do
  dirname=$(echo "$branch" | sed 's|/|-|g')
  wt_path="../sagie-${dirname}"

  if [ -d "$wt_path" ]; then
    echo "  ⤳ Worktree exists: $wt_path (reusing)"
  else
    git worktree add "$wt_path" -b "$branch" origin/main 2>/dev/null || \
    git worktree add "$wt_path" "$branch" 2>/dev/null || {
      echo "  ✗ Failed to create worktree for $branch"
      continue
    }
    echo "  ✓ Created: $wt_path"
  fi
  WORKTREE_PATHS+=("$wt_path")
done

echo ""

if [ ${#WORKTREE_PATHS[@]} -eq 0 ]; then
  echo "✗ No worktrees created"
  exit 1
fi

# ── Kill existing tmux session if present ─────────────────────────
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "→ Killing existing tmux session '$SESSION_NAME'"
  tmux kill-session -t "$SESSION_NAME"
fi

# ── Build tmux session ────────────────────────────────────────────
echo "→ Building tmux session '$SESSION_NAME' with ${#WORKTREE_PATHS[@]} panes"

# First pane — create the session
FIRST_PATH="${WORKTREE_PATHS[0]}"
FIRST_BRANCH="${TARGET_BRANCHES[0]}"
tmux new-session -d -s "$SESSION_NAME" -c "$REPO_ROOT/$FIRST_PATH"
tmux rename-window -t "$SESSION_NAME" "tracks"

# Set first pane title
tmux send-keys -t "$SESSION_NAME" "# Track: $FIRST_BRANCH" C-m
tmux send-keys -t "$SESSION_NAME" "clear" C-m

# Remaining panes — split and assign
for i in $(seq 1 $((${#WORKTREE_PATHS[@]} - 1))); do
  wt="${WORKTREE_PATHS[$i]}"
  branch="${TARGET_BRANCHES[$i]}"

  # Alternate horizontal/vertical splits for grid layout
  if [ $((i % 2)) -eq 1 ]; then
    tmux split-window -h -t "$SESSION_NAME" -c "$REPO_ROOT/$wt"
  else
    tmux split-window -v -t "$SESSION_NAME" -c "$REPO_ROOT/$wt"
  fi

  tmux send-keys -t "$SESSION_NAME" "# Track: $branch" C-m
  tmux send-keys -t "$SESSION_NAME" "clear" C-m
done

# Even out the layout
tmux select-layout -t "$SESSION_NAME" tiled

# Select first pane
tmux select-pane -t "$SESSION_NAME:0.0"

# ── Summary ───────────────────────────────────────────────────────
echo ""
echo "✓ Sprint session ready!"
echo ""
echo "  tmux attach -t $SESSION_NAME"
echo ""
echo "  Each pane is in its worktree. Start Claude Code:"
echo "    claude                    # interactive"
echo "    cat .planning/sessions/track-N-*.md | claude  # with prompt"
echo ""
echo "  Pane layout:"
for i in "${!TARGET_BRANCHES[@]}"; do
  echo "    Pane $i: ${TARGET_BRANCHES[$i]}"
done
echo ""
echo "  Shortcuts: ⌘1-4 switch panes, ⌘Z zoom, ⌘W close"

# ── Attach ────────────────────────────────────────────────────────
# If not already in tmux, attach
if [ -z "$TMUX" ]; then
  tmux attach -t "$SESSION_NAME"
else
  tmux switch-client -t "$SESSION_NAME"
fi
