<h1 align="center">
  <img src="docs/images/logo.svg" alt="mdts" width="400">
</h1>

**A zero-config CLI tool to preview your local Markdown files in a browser.**  **`npx mdts` — and you're done.**

<p align="center">
  <img src="docs/images/screen_animation.gif" width="640" alt="mdts demo">
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

## 📦 Requirements

- Node.js
- No installation needed – uses `npx`

## 🛠 Options

```bash
npx mdts <directory> --host 0.0.0.0 --port 3000 --silent
```

| Option         | Description                           | Example |
| -------------- | ------------------------------------- |---------| 
| `<directory>`  | Specify root directory (default .)    | ./docs  |
| `--host`, `-H` | Host to listen on (default localhost) | 0.0.0.0 |
| `--port`, `-p` | Change the server port (default 8521) | 8000    |
| `--silent`, `-s` | Suppress server logs                  |         |

## 📚 Documentation

- [Use Cases](docs/usecases.md)
- [Markdown Features](docs/markdown_features.md)
- [Frontend Features](docs/frontend_features.md)
- [Screenshots](docs/screenshots.md)
- [Comparison with other tools](docs/comparison.md)
- [FAQ](docs/faq.md)

## Contributing

Found a bug? Have an idea? Want to send a PR?  
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details — we'd love to have your help!
