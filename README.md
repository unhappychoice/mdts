<h1 align="center">
  <img src="docs/logo.svg" alt="mdts" width="400">
</h1>

**A zero-config CLI tool to preview your local Markdown files in a browser.**  **`npx mdts` — and you're done.**

<p align="center">
  <img src="docs/screen_animation.gif" width="600" alt="mdts demo">
</p>

## 🔧 Features

- ⚡ **Instant Markdown Preview** – Run and view in seconds  
- 🌐 **Web UI** – Clean, tree-based browser interface  
- 🔄 **Live Reload** – Automatically refreshes on file changes  
- 🧘 **Zero Setup** – No config, no install, no nonsense  


## 🚀 Quick Start

```bash
npx mdts
```

This starts a local server at http://localhost:8521 and opens your browser.
Your current directory becomes a browsable Markdown tree.

## 💡 Use Cases

- Reviewing AI-generated docs  
- Quickly checking README or note folders  
- Lightweight local Markdown wiki  

## 🖼 Screenshot

> Browsable file tree + rendered Markdown with live reload

<p align="center">
  <img src="docs/screenshot.png" width="800" alt="mdts screenshot">
</p>

## 📦 Requirements

- Node.js
- No installation needed – uses `npx`

## 🛠 Options

```bash
npx mdts <directory> --port 3000
```

| Option         | Description                           | Example |
| -------------- | ------------------------------------- | --------| 
| `<directory>`  | Specify root directory (default .)    | ./docs  |
| `--port`       | Change the server port (default 8521) | 8000    |

