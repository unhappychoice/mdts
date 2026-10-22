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
# @raycast.argument1 { "type": "text", "placeholder": "Folder (default: ~/notes)", "optional": true }

set -euo pipefail

DIR="${1:-$HOME/notes}"
PORT="${MDTS_PORT:-8521}"
MDTS_CMD="${MDTS_CMD:-npx --yes mdts}"
LOG="${TMPDIR:-/tmp}/mdts-preview.log"

port_open() { (exec 3<>"/dev/tcp/localhost/${1}") 2>/dev/null; }

# Reuse a running server instead of starting a second one on the same port.
if port_open "$PORT"; then
  open "http://localhost:${PORT}"
  exit 0
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
