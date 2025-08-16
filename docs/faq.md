# FAQ – Frequently Asked Questions

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

Currently no, but theme customization may be supported in the future.

## ❓ Is it safe to use for private documentation?

Yes. By default, `mdts` only serves files from your local machine on `localhost`.  
If you change the host to be accessible over the network, take appropriate security precautions.

## ❓ How is this different from tools like `grip`, `markserv`, or `md-fileserver`?

See our [comparison table](./comparison.md) for a detailed breakdown.
