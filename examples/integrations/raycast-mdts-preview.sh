#!/usr/bin/env bash
# Raycast Script Command: serve a Markdown folder with mdts and open it.
#
# Install: save this file in ~/.raycast-scripts/, run `chmod +x` on it, then add
# the folder under Raycast -> Extensions -> Script Commands.
#
# Override the port with MDTS_PORT, or the command with MDTS_CMD (useful when
# mdts is installed globally: MDTS_CMD=mdts).
#
# @raycast.schemaVersion 1
# @raycast.title Preview Markdown
# @raycast.mode silent
# @raycast.icon 📝
# @raycast.description Serve a Markdown folder with mdts and open it
# @raycast.argument1 { "type": "text", "placeholder": "Folder (default: ~/notes)" }

set -euo pipefail

DIR="${1:-$HOME/notes}"
PORT="${MDTS_PORT:-8521}"
MDTS_CMD="${MDTS_CMD:-npx --yes mdts}"

# Reuse a running server instead of starting a second one on the same port.
if (exec 3<>"/dev/tcp/127.0.0.1/${PORT}") 2>/dev/null; then
  open "http://localhost:${PORT}"
  exit 0
fi

if [ ! -d "$DIR" ]; then
  echo "Not a folder: $DIR" >&2
  exit 1
fi

nohup $MDTS_CMD "$DIR" --port "$PORT" --no-open --silent >/dev/null 2>&1 &
for _ in $(seq 1 20); do
  (exec 3<>"/dev/tcp/127.0.0.1/${PORT}") 2>/dev/null && break
  sleep 0.25
done

open "http://localhost:${PORT}"
