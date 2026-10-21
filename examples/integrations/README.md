# Integration examples

Runnable versions of the recipes in [docs/integrations.md](../../docs/integrations.md).
Both scripts only need `node` (already required by mdts) and a shell.

| File | What it does |
| --- | --- |
| [`raycast-mdts-preview.sh`](raycast-mdts-preview.sh) | Raycast Script Command that serves a Markdown folder and opens it. |
| [`claude-mdts-preview.sh`](claude-mdts-preview.sh) | Claude Code `PostToolUse` hook that serves the folder of a written Markdown file. |

Install notes are at the top of each script. Both accept `MDTS_PORT` to change
the port and `MDTS_CMD` to use a globally installed `mdts` instead of `npx`.
