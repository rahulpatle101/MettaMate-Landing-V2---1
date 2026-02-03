#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
BRANCH="gh-pages"
TMP_DIR="/tmp/gh-pages-$(basename "$ROOT")"

npm run build

if [ -d "$TMP_DIR" ]; then
  git worktree remove "$TMP_DIR" --force || true
  rm -rf "$TMP_DIR"
fi

if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  git worktree add "$TMP_DIR" "$BRANCH"
else
  git worktree add "$TMP_DIR" -b "$BRANCH"
fi

rm -rf "$TMP_DIR"/*
cp -R "$ROOT/dist/." "$TMP_DIR/"

git -C "$TMP_DIR" add -A
if git -C "$TMP_DIR" diff --cached --quiet; then
  echo "No changes to deploy."
else
  git -C "$TMP_DIR" commit -m "Deploy"
  git -C "$TMP_DIR" push -u origin "$BRANCH"
fi

git worktree remove "$TMP_DIR"
