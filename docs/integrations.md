---
title: Integrations
description: Integration recipes for using mdts with common tools and workflows
category: Documentation
tags:
  - integrations
  - raycast
  - vscode
  - git-hooks
  - shell
  - npm
---

# Integrations

`mdts` is a CLI tool that fits naturally into a variety of developer workflows. This page provides copy-paste ready recipes for integrating `mdts` with popular tools.

---

## Raycast Script Command

Add a Raycast script command to launch `mdts` on the directory you're currently working in.

Create a file at `~/.raycast/scripts/open-mdts.sh`:

```bash
#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Preview Markdown (mdts)
# @raycast.mode silent
# @raycast.packageName Developer Tools

# Optional parameters:
# @raycast.icon 📝
# @raycast.argument1 { "type": "directory", "placeholder": "Directory", "optional": true }

DIR="${1:-$PWD}"
npx mdts "$DIR"
```

Make it executable and add it to Raycast:

```bash
chmod +x ~/.raycast/scripts/open-mdts.sh
```

Then in Raycast: **Import Script Commands** → select the file. Now you can trigger it from the Raycast launcher with an optional directory argument (defaults to your current working directory).

---

## VS Code Task

Add a task to `.vscode/tasks.json` so you can launch `mdts` from the Command Palette or bind it to a keyboard shortcut.

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Preview Markdown (mdts)",
      "type": "shell",
      "command": "npx mdts ${workspaceFolder}",
      "presentation": {
        "reveal": "silent",
        "panel": "dedicated",
        "focus": false
      },
      "problemMatcher": [],
      "runOptions": {
        "runOn": "default"
      }
    },
    {
      "label": "Preview Markdown — docs/ only",
      "type": "shell",
      "command": "npx mdts ${workspaceFolder}/docs",
      "presentation": {
        "reveal": "silent",
        "panel": "dedicated"
      },
      "problemMatcher": []
    }
  ]
}
```

**Bind to a keyboard shortcut** by adding this to `keybindings.json` (`Ctrl+Shift+P` → *Open Keyboard Shortcuts (JSON)*):

```json
{
  "key": "ctrl+shift+m",
  "command": "workbench.action.tasks.runTask",
  "args": "Preview Markdown (mdts)"
}
```

---

## Shell Alias

Add a short alias to your shell config for quick access from any directory.

**Bash** (`~/.bashrc`) or **Zsh** (`~/.zshrc`):

```bash
# Open mdts in the current directory
alias mdp="npx mdts ."

# Open mdts in a specific directory, defaulting to current
function mdpreview() {
  npx mdts "${1:-.}"
}
```

After adding, reload your shell:

```bash
source ~/.bashrc   # or source ~/.zshrc
```

Usage:

```bash
mdp                   # preview current directory
mdpreview ./docs      # preview a specific folder
```

---

## Git Hooks

### post-commit: preview changed Markdown files

This hook opens `mdts` after a commit if any Markdown files were changed. It extracts the directory of the first changed `.md` file and serves it.

Create `.git/hooks/post-commit`:

```bash
#!/bin/bash

# Get the list of changed .md files in the last commit
CHANGED_MD=$(git diff-tree --no-commit-id -r --name-only HEAD | grep '\.md$')

if [ -n "$CHANGED_MD" ]; then
  # Serve the directory containing the first changed markdown file
  FIRST_FILE=$(echo "$CHANGED_MD" | head -n 1)
  DIR=$(dirname "$FIRST_FILE")
  echo "mdts: opening preview for $DIR"
  npx mdts "$DIR" &
fi
```

Make it executable:

```bash
chmod +x .git/hooks/post-commit
```

### pre-commit: lint or validate Markdown (optional)

If you want to run a Markdown linter before committing (e.g., `markdownlint`), here's a pattern that pairs well with `mdts`:

```bash
#!/bin/bash

CHANGED_MD=$(git diff --cached --name-only | grep '\.md$')

if [ -n "$CHANGED_MD" ]; then
  if command -v markdownlint &>/dev/null; then
    markdownlint $CHANGED_MD || exit 1
  fi
fi
```

---

## npm Script

Add `mdts` as a script in your `package.json` to make it accessible to all contributors without any global installs.

```json
{
  "scripts": {
    "docs": "mdts ./docs",
    "docs:root": "mdts .",
    "docs:watch": "mdts . --silent"
  }
}
```

Run with:

```bash
npm run docs           # serve the docs/ folder
npm run docs:root      # serve everything from the project root
```

This is especially useful for monorepos or team projects where you want a consistent, documented way to preview documentation locally.

---

## Tips

- Use `--no-open` if you want `mdts` to start silently without opening a browser tab automatically:
  ```bash
  npx mdts . --no-open
  ```
- Use `--port` to avoid conflicts when running multiple instances:
  ```bash
  npx mdts ./docs --port 8600
  ```
- Use `--glob` to narrow the file tree in large projects:
  ```bash
  npx mdts . -g 'docs/**/*.md' 'README.md'
  ```

See the [Advanced Configuration](./configuration.md) guide for more customization options.
