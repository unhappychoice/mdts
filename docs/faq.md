---
title: FAQ - Frequently Asked Questions
description: Common questions and answers about mdts usage and features
category: Documentation
tags:
  - faq
  - help
  - troubleshooting
---

## ❓ What is `mdts`?

`mdts` (Markdown Tree Server) is a simple CLI tool that serves a local directory of Markdown files as a browsable, hierarchical document viewer in your browser.

## ❓ Do I need to install it?

No installation is required. You can run it instantly via [`npx`](https://docs.npmjs.com/cli/v10/commands/npx):

```bash
npx mdts
```

## ❓ Can it export to static HTML?

No. `mdts` is intended for **local, real-time browsing only**.
It does not support static HTML export. For static site generation, use tools like Docusaurus, MkDocs, or VitePress.

## ❓ Can I use it to view a single Markdown file?

Yes. While `mdts` is designed for directories with multiple Markdown files, you can also point it to a directory with just one `.md` file and it will be displayed in the viewer.

## ❓ Does it support live reload on file changes?

Yes. `mdts` automatically reloads the browser when Markdown files are changed, allowing you to preview updates in real time while editing.

## ❓ Is there syntax highlighting?

Yes. `mdts` supports basic syntax highlighting using [highlight.js](https://highlightjs.org/).  
Code blocks in fenced markdown will be highlighted automatically.

## ❓ Can I customize the style or layout?

Yes! `mdts` provides comprehensive customization options through the settings dialog (gear icon in the header):

- **Layout Settings**: Choose between compact (centered) or full-width content layout
- **Color Scheme**: Switch between light/dark modes and select from various application themes
- **Syntax Highlighting**: Choose from multiple syntax highlighting themes for code blocks
- **Font Settings**: Customize font size, font family for regular text, and monospace font for code

All settings are automatically saved to localStorage and persist across sessions.

## ❓ Is it safe to use for private documentation?

Yes. By default, `mdts` only serves files from your local machine on `localhost`.  
If you change the host to be accessible over the network, take appropriate security precautions.

## ❓ How are my settings stored and managed?

`mdts` uses both localStorage (browser) and configuration files (system) to save your preferences:

### Browser Settings (localStorage)
- **Theme settings**: Dark/light mode, application color themes, syntax highlighting themes
- **Layout preferences**: Content width (compact/full), panel visibility
- **File tree state**: Expanded/collapsed folder states and recent file paths

### System Configuration File
Some settings are also saved to `~/.config/mdts/config.json` on your system:
- **Font settings**: Font family, size, and monospace preferences
- **Global theme preferences**: Default theme and syntax highlighting settings

All settings persist across browser sessions and require no manual configuration. You can reset to defaults using the "Restore default setting" button in the settings dialog.

## ❓ Can I filter which files are shown?

Yes. Use the `--glob` (`-g`) option to specify glob patterns. Only matching markdown files will appear in the file tree:

```bash
npx mdts ./project -g 'docs/**/*.md' 'README.md'
```

Patterns are resolved relative to the specified directory. You can pass multiple patterns to combine results.

## ❓ How do glob patterns work with `--glob`?

Patterns follow standard glob syntax (powered by the [`glob`](https://www.npmjs.com/package/glob) package):

- `*.md` — all `.md` files in the root
- `docs/**/*.md` — all `.md` files recursively under `docs/`
- `packages/*/README.md` — `README.md` in each direct subdirectory of `packages/`

Only files ending in `.md` or `.markdown` are included, even if the pattern matches other files.

## ❓ How is this different from tools like `grip`, `markserv`, or `md-fileserver`?

See our [comparison table](./comparison.md) for a detailed breakdown.
