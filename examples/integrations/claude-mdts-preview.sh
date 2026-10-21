#!/usr/bin/env bash
# Claude Code PostToolUse hook: serve the folder of a written Markdown file
# with mdts, once per session.
#
# Install: save this file as .claude/hooks/mdts-preview.sh in your project (or
# ~/.claude/hooks/ for every project), then register it in .claude/settings.json:
#
#   {
#     "hooks": {
#       "PostToolUse": [
#         {
#           "matcher": "Write|Edit|MultiEdit",
#           "hooks": [
#             { "type": "command", "command": "bash .claude/hooks/mdts-preview.sh" }
#           ]
#         }
#       ]
#     }
#   }
#
# The hook reads the Claude Code hook payload on stdin, so no argument is needed.
# It only needs node (already required by mdts); no jq.
#
# Override the port with MDTS_PORT, or the command with MDTS_CMD.

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

PORT="${MDTS_PORT:-8521}"
MDTS_CMD="${MDTS_CMD:-npx --yes mdts}"

# mdts live-reloads, so one server per session is enough.
if (exec 3<>"/dev/tcp/127.0.0.1/${PORT}") 2>/dev/null; then
  exit 0
fi

nohup $MDTS_CMD "$(dirname "$path")" --port "$PORT" --no-open --silent >/dev/null 2>&1 &
