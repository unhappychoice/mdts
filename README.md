<h1 align="center">
  <img src="docs/images/logo.svg" alt="mdts" width="400">
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/mdts"><img src="https://img.shields.io/npm/v/mdts.svg?style=flat-square&color=1e3a8a" alt="npm"></a>
  <a href="https://github.com/unhappychoice/mdts/releases"><img src="https://img.shields.io/github/v/release/unhappychoice/mdts?style=flat-square&color=0f172a&label=release" alt="release"></a>
  <a href="https://github.com/unhappychoice/mdts/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/unhappychoice/mdts/test.yml?branch=main&style=flat-square&label=CI" alt="CI"></a>
  <a href="https://codecov.io/gh/unhappychoice/mdts"><img src="https://img.shields.io/codecov/c/github/unhappychoice/mdts?style=flat-square" alt="codecov"></a>
  <a href="https://github.com/unhappychoice/mdts/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/mdts.svg?style=flat-square" alt="license"></a>
</p>

<p align="center">
  (<strong>M</strong>)ark(<strong>d</strong>)own (<strong>T</strong>)ree (<strong>S</strong>)erver
  <br>
  A zero-config CLI tool to preview your local Markdown files in a browser.
  <br>
  <strong>npx mdts</strong> — and you're done.
</p>

<p align="center">
  <a href="https://mdts-unhappychoice.netlify.app" target="_blank">
    <strong>🔗 Try the Live Demo</strong>
  </a>
</p>

<p align="center">
  <img src="docs/images/screen_animation.gif" width="640" alt="mdts demo">
</p>

## 🔧 Features

- ⚡ **Instant Markdown Preview** – Run and view in seconds  
- 🌐 **Web UI** – Clean, tree-based browser interface with three-panel layout
- 🔄 **Live Reload** – Automatically refreshes on file changes  
- 🧘 **Zero Setup** – No config, no install, no nonsense
- 🎨 **Custom Themes** – 20+ beautiful application themes and syntax highlighting options


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

See [detailed use cases](docs/usecases.md) for more examples and workflows.  

## 📦 Requirements

- Node.js
- No installation needed – uses `npx`

## 🛠 Options

```bash
npx mdts [directory] [options]
```

| Option              | Description                                          | Example                        |
| ------------------- | ---------------------------------------------------- | ------------------------------ |
| `[directory]`       | Directory to serve (default `.`)                     | `./docs`                       |
| `--glob`, `-g`      | Glob patterns to filter markdown files               | `-g 'docs/*.md' 'specs/*.md'` |
| `--search-max-files`| Max files to index for search (default `5000`)       | `--search-max-files 10000`     |
| `--search-max-size` | Max file size to index for search in MB (default `5`)| `--search-max-size 10`         |
| `--host`, `-H`      | Host to listen on (default `localhost`)              | `0.0.0.0`                      |
| `--port`, `-p`      | Port to serve on (default `8521`)                    | `8000`                         |
| `--silent`, `-s`    | Suppress server logs (default `false`)               |                                |
| `--no-open`         | Do not open the browser automatically                |                                |
| `--version`, `-V`   | Output version number                                |                                |
| `--help`, `-h`      | Display help for command                             |                                |

### Examples

```bash
# Serve current directory (all markdown files)
npx mdts

# Serve a specific directory
npx mdts ./docs

# Filter with glob patterns (only matching files are shown)
npx mdts ./project -g 'docs/**/*.md' 'README.md'

# Adjust search indexing for large repositories
npx mdts ./monorepo --search-max-files 10000 --search-max-size 20

# Combine options
npx mdts ./monorepo -g 'packages/*/README.md' --port 3000 --no-open
```

## 📚 Documentation

### 🔗 [Live Demo](https://mdts-unhappychoice.netlify.app)
Experience mdts in action with real examples and interactive features.

### 📖 Documentation
- [Use Cases](docs/usecases.md)
- [Markdown Features](docs/markdown_features.md)  
- [Frontend Features](docs/frontend_features.md)
- [Advanced Configuration](docs/configuration.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Comparison with other tools](docs/comparison.md)
- [FAQ](docs/faq.md)

## Contributing

Found a bug? Have an idea? Want to send a PR?  
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details — we'd love to have your help!

## Author

[@unhappychoice](https://unhappychoice.com)
