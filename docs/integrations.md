---
title: Integrations and Recipes
description: Launch mdts from Raycast, Claude Code hooks, VS Code, shell aliases and Git hooks
category: Documentation
tags:
  - integrations
  - raycast
  - hooks
  - workflows
  - automation
---

mdts is a local server with no configuration file and no plugin system, but that
also means anything that can run a shell command can launch it. This page
collects the recipes users have asked for: Raycast, Claude Code hooks, VS Code
tasks, shell aliases and Git hooks.

## The pattern behind every recipe

Every integration below does the same four things:

1. Pick the directory that holds the Markdown (`~/notes`, the current project,
   the folder in the front Finder window).
2. Start `npx --yes mdts <directory> --no-open --silent` in the background.
3. Wait until the port answers.
4. Open `http://localhost:8521` (or the port passed with `--port`).

`--no-open` is what makes this reliable: the integration decides when the
browser opens instead of racing the server startup. `--yes` skips the `npx`
install prompt the first time. Port `8521` is the default; when it is already
taken by another mdts instance, pass `--port 8522` (or `--port auto`, which picks
the next free port and prints it).

Only one server per port and per directory is needed. mdts watches the mounted
directory and live-reloads, so a running instance already reflects new files.

## Raycast (macOS)

Save the script below as `~/.raycast-scripts/mdts-preview.sh`, make it
executable (`chmod +x`), and add the folder in Raycast under **Extensions ->
Script Commands**. Raycast reads the `@raycast.*` comments in the header.

```bash
#!/usr/bin/env bash
# @raycast.schemaVersion 1
# @raycast.title Preview Markdown
# @raycast.mode silent
# @raycast.icon 📝
# @raycast.description Serve a Markdown folder with mdts and open it
# @raycast.argument1 { "type": "text", "placeholder": "Folder (default: ~/notes)", "optional": true }

set -euo pipefail

DIR="${1:-$HOME/notes}"
PORT="${MDTS_PORT:-8521}"
MDTS_CMD="${MDTS_CMD:-npx --yes mdts}"
LOG="${TMPDIR:-/tmp}/mdts-preview.log"

port_open() { (exec 3<>"/dev/tcp/localhost/${1}") 2>/dev/null; }

# Ask the server on $PORT which folder it mounted. Empty when the port does not
# answer with mdts's file tree.
mounted_folder() {
  curl -fsS --max-time 2 "http://localhost:${1}/api/filetree" 2>/dev/null | node -e '
    let raw = "";
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => {
      try {
        process.stdout.write(JSON.parse(raw).mountedDirectoryPath ?? "");
      } catch {}
    });
  '
}

if port_open "$PORT"; then
  want=$(cd "$DIR" 2>/dev/null && pwd) || want=""
  served=$(mounted_folder "$PORT")
  served=${served//\\//}
  if [ -n "$want" ] && [ "$served" = "$want" ]; then
    open "http://localhost:${PORT}"
    exit 0
  fi
  echo "Port ${PORT} already serves ${served:-another service}; set MDTS_PORT for ${DIR}" >&2
  exit 1
fi

if [ ! -d "$DIR" ]; then
  echo "Not a folder: $DIR" >&2
  exit 1
fi

nohup $MDTS_CMD "$DIR" --port "$PORT" --no-open --silent >"$LOG" 2>&1 &

ready=0
for _ in $(seq 1 40); do
  if port_open "$PORT"; then
    ready=1
    break
  fi
  sleep 0.25
done

if [ "$ready" -ne 1 ]; then
  echo "mdts did not start on port ${PORT}; see $LOG" >&2
  exit 1
fi

open "http://localhost:${PORT}"
```

`"optional": true` in the argument metadata is what makes the empty field fall
back to `~/notes`; Raycast otherwise requires an argument before running the
command.

A second command that serves the folder of the front Finder window needs no
argument:

```bash
DIR=$(osascript -e 'tell application "Finder" to set theFolder to POSIX path of (target of front window as alias)')
```

Use that as `DIR` instead of `${1:-$HOME/notes}`, with `@raycast.mode silent` and
no `@raycast.argument1`.

### Deeplinks

Raycast can run the script command from anywhere with the `raycast://` URL
scheme, for example from a Shortcut, a Stream Deck or a shell script:

```
raycast://script-commands/raycast-mdts-preview?arguments=%2FUsers%2Fyou%2Fnotes
```

The slug after `script-commands/` is the script file name without `.sh`. Each
argument is one `arguments` query parameter, URL-encoded (a path like
`/Users/you/notes` becomes `%2FUsers%2Fyou%2Fnotes`). Without the query string
the command uses its default folder. Raycast asks for confirmation the first
time a deeplink runs a command; choosing **Always Open Command** skips that for
the future. The **Copy Deeplink** action in the command's action panel writes
the URL for you, so the slug does not have to be typed by hand. The format is
documented at
[developers.raycast.com/information/lifecycle/deeplinks](https://developers.raycast.com/information/lifecycle/deeplinks).

mdts itself has no custom URL scheme: it is a local web server, and the deeplink
above belongs to Raycast, not to mdts.

## Claude Code hooks

Claude Code can run a hook after every file write. The hook below starts mdts on
the folder of the Markdown file that was just written, then leaves it running:
mdts live-reloads, so the next write shows up without starting another server.

The hook script only needs `node` (already required by mdts), so it avoids a
`jq` dependency:

```bash
#!/usr/bin/env bash
# .claude/hooks/mdts-preview.sh
# PostToolUse hook: serve the folder of a written Markdown file with mdts.
set -euo pipefail

input=$(cat)
path=$(printf '%s' "$input" | node -e '
  let raw = "";
  process.stdin.on("data", (chunk) => (raw += chunk));
  process.stdin.on("end", () => {
    try {
      // Some shells and editors prepend a BOM; JSON.parse rejects it.
      const payload = JSON.parse(raw.replace(/^\uFEFF/, ""));
      process.stdout.write(payload.tool_input?.file_path ?? "");
    } catch {}
  });
')

[ -n "$path" ] || exit 0
case "$path" in
  *.md|*.mdx|*.markdown) ;;
  *) exit 0 ;;
esac

dir=$(cd "$(dirname "$path")" && pwd)
PORT="${MDTS_PORT:-8521}"
MDTS_CMD="${MDTS_CMD:-npx --yes mdts}"

port_open() { (exec 3<>"/dev/tcp/localhost/${1}") 2>/dev/null; }

# Ask the server on $PORT which folder it mounted, with a hard timeout so a
# stalled or foreign listener cannot hold the synchronous hook.
mounted_folder() {
  curl -fsS --max-time 2 "http://localhost:${1}/api/filetree" 2>/dev/null | node -e '
    let raw = "";
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => {
      try {
        process.stdout.write(JSON.parse(raw).mountedDirectoryPath ?? "");
      } catch {}
    });
  '
}

if port_open "$PORT"; then
  served=$(mounted_folder "$PORT")
  served=${served//\\//}
  if [ "$served" = "$dir" ]; then
    exit 0
  fi
  # Claude Code does not surface stderr from a successful hook, so return the
  # guidance as a systemMessage instead.
  printf '{"systemMessage":"mdts on port %s serves %s; set MDTS_PORT for %s"}\n' \
    "$PORT" "${served:-another service}" "$dir"
  exit 0
fi

nohup $MDTS_CMD "$dir" --port "$PORT" --no-open --silent >/dev/null 2>&1 &
```

The `curl` asks the running server which folder it mounted, with a two-second
cap: a stalled or foreign listener cannot hold the hook. If a later write
targets another folder, the hook does not reuse that server; it returns a
`systemMessage` naming the folder the server does serve and asks for a different
`MDTS_PORT` (see [Running several projects at once](#running-several-projects-at-once)),
rather than silently doing nothing.

Register it in `.claude/settings.json` (project) or `~/.claude/settings.json`
(user):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/mdts-preview.sh" }
        ]
      }
    ]
  }
}
```

Open `http://localhost:8521` once; it stays current through the session. Other
agent CLIs with a "after file edit" hook (Cursor rules, Aider, Codex CLI) can run
the same script.

## VS Code tasks

Put this in `.vscode/tasks.json` and run **Tasks: Run Task -> Preview Markdown
with mdts**:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Preview Markdown with mdts",
      "type": "shell",
      "command": "npx --yes mdts \"${workspaceFolder}\" --no-open",
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}
```

Open `http://localhost:8521` afterwards. Drop `--no-open` if you prefer the
browser to open as part of the task, at the cost of a second tab on every run.

## Shell aliases and functions

For zsh or bash, a function that starts the server once and reuses it. The port
check uses `curl` instead of bash's `/dev/tcp`, which zsh does not provide:

```bash
mdts-preview() {
  local dir="${1:-.}"
  local port="${MDTS_PORT:-8521}"
  local url="http://localhost:${port}"

  if curl -fsS --max-time 1 "${url}/api/filetree" >/dev/null 2>&1; then
    open "$url" 2>/dev/null || xdg-open "$url"
    return 0
  fi

  ( cd "$dir" && npx --yes mdts . --port "$port" --no-open --silent >/dev/null 2>&1 & )

  local ready=0
  for _ in $(seq 1 40); do
    if curl -fsS --max-time 1 "${url}/api/filetree" >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 0.25
  done

  if [ "$ready" -ne 1 ]; then
    echo "mdts did not start on port ${port}" >&2
    return 1
  fi

  open "$url" 2>/dev/null || xdg-open "$url"
}
```

`mdts-preview`, `mdts-preview ~/notes`, `mdts-preview docs` then cover the
common cases. On Linux replace `open` with `xdg-open` (the function above tries
both).

## Git hooks (optional)

A `post-commit` hook that keeps a filtered preview of the changelog ready on
port 8522:

```sh
#!/bin/sh
# .git/hooks/post-commit
npx --yes mdts . -g 'CHANGELOG.md' --port 8522 --no-open --silent >/dev/null 2>&1 &
printf 'CHANGELOG preview: http://localhost:8522\n'
```

Git hooks are local to the clone and are not committed. Opening a browser on
every commit is intrusive, so the hook only prints the URL; open it when you
want it. Use `--port 8522` so the changelog preview does not collide with the
main instance on 8521.

## Running several projects at once

Each instance owns one port:

```bash
npx mdts ~/notes --port 8521 --no-open
npx mdts ~/work/api-docs --port 8522 --no-open
```

Run them in two terminals: both commands stay in the foreground and keep
serving. In one terminal, append `&` to the first command (or use another port
with `--port auto`) before starting the second.

`--port auto` is useful in scripts that do not know whether 8521 is free: mdts
picks the next available port, and the startup log prints the URL it chose.

## Troubleshooting

- **`EADDRINUSE` on startup**: another process owns the port. Pass `--port`, or
  stop the old server (`pkill -f "mdts .* --port 8521"`).
- **The browser opens before the server is ready**: keep `--no-open` and open
  the URL after the port answers, as the recipes above do.
- **Nothing is listed**: mdts serves a directory, so pass the folder that
  contains the Markdown. `-g 'docs/**/*.md'` narrows the tree further.
- **`npx` asks to install mdts**: `--yes` (used above) answers the prompt for
  you; non-interactive hooks otherwise fail with an install prompt.
