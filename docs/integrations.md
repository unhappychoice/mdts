---
title: Integration Recipes
description: Practical ways to launch mdts from desktop launchers, coding-agent hooks, and local developer workflows
category: Documentation
tags:
  - integrations
  - workflows
  - automation
---

`mdts` is intentionally small enough to fit into existing developer workflows. These recipes show how to start a local Markdown preview from tools you may already use during writing, documentation review, or agent-assisted development.

## Raycast Script Command

Use a Raycast Script Command when you want to start `mdts` from the keyboard instead of opening a terminal first.

Create a script file in a Raycast Script Commands directory:

```bash
#!/bin/bash
# @raycast.schemaVersion 1
# @raycast.title Preview Markdown with mdts
# @raycast.mode silent
# @raycast.packageName Development
# @raycast.description Start mdts for a Markdown directory.
# @raycast.argument1 { "type": "text", "placeholder": "Directory", "optional": true }

set -euo pipefail

DIR="${1:-$HOME}"
PORT="${MDTS_PORT:-8521}"
LOG_FILE="${TMPDIR:-/tmp}/mdts-raycast.log"

cd "$DIR"
nohup npx mdts . --port "$PORT" --no-open >"$LOG_FILE" 2>&1 &
open "http://localhost:$PORT"
```

Notes:

- Pass a directory path when you run the command, or leave it empty to preview your home directory.
- If another `mdts` process already uses port `8521`, set `MDTS_PORT` to another value before running the command.
- Raycast picks up script metadata automatically when the script lives in a configured Script Commands directory.

## Claude Code Hooks

Use a Claude Code hook when you want a Markdown preview to be available while an agent edits project documentation. Since `mdts` already live-reloads file changes, the hook only needs to ensure that the preview server is running.

Create `.claude/hooks/start-mdts.sh` in your project:

```bash
#!/usr/bin/env bash
set -euo pipefail

PORT="${MDTS_PORT:-8521}"
ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LOG_FILE="${TMPDIR:-/tmp}/mdts-claude-hook.log"

if curl -fsS "http://localhost:$PORT" >/dev/null 2>&1; then
  exit 0
fi

cd "$ROOT"
nohup npx mdts . --port "$PORT" --no-open >"$LOG_FILE" 2>&1 &
```

Make it executable:

```bash
chmod +x .claude/hooks/start-mdts.sh
```

Then add a project-level `.claude/settings.json` hook:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/start-mdts.sh",
            "args": [],
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "if": "Write(*.md)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/start-mdts.sh",
            "args": [],
            "timeout": 30
          },
          {
            "type": "command",
            "if": "Edit(*.md)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/start-mdts.sh",
            "args": [],
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

This starts `mdts` at session start and checks again after Markdown writes or edits. The script exits immediately if a server is already responding on the configured port, so repeated hooks stay cheap.

## npm Scripts

Use an npm script when a repository has a standard docs folder and you want every contributor to use the same preview command.

```json
{
  "scripts": {
    "docs:preview": "mdts docs",
    "docs:preview:all": "mdts . -g 'README.md' 'docs/**/*.md' 'packages/*/README.md'"
  },
  "devDependencies": {
    "mdts": "^0.20.3"
  }
}
```

Run it with:

```bash
npm run docs:preview
```

## Shell Aliases

Use a shell alias for personal workflows where you often preview the current directory.

```bash
alias mdpreview='npx mdts .'
alias mdpreview-docs='npx mdts docs'
```

For larger repositories, prefer a function so you can pass a directory and keep the file tree focused:

```bash
mdpreview-readmes() {
  npx mdts "${1:-.}" -g 'README.md' 'docs/**/*.md' 'packages/*/README.md'
}
```

## VS Code Tasks

Use a VS Code task when you want a one-click or command-palette preview from inside the editor.

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Preview Markdown with mdts",
      "type": "shell",
      "command": "npx mdts .",
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}
```

Run `Tasks: Run Task` and choose `Preview Markdown with mdts`.

## Choosing a Recipe

- Use Raycast for a personal global shortcut.
- Use Claude Code hooks when documentation changes are made by an agent and you want the preview ready automatically.
- Use npm scripts for project-wide contributor commands.
- Use shell aliases or VS Code tasks for local convenience.
