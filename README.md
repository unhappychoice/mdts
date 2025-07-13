<h1 align="center">
  <img src="docs/logo.svg" alt="mdts" width="400">
</h1>

`mdts` (MarkDown Tree Server) is a simple command-line tool that serves Markdown files from a specified local directory and provides a web-based interface to browse and view them. It automatically opens the served content in your default web browser.

## Features

- **File Tree Navigation**: Provides a hierarchical view of your Markdown files for easy browsing.
- **Markdown Rendering**: Renders Markdown files in a clean, readable format.
- [WIP] **Live Reload**: 

![screenshot](docs/screenshot.png)


## Usage
```bash
npx mdts
```

By default, `mdts` will serve files from the current directory (`.`) on port `8521`. It will automatically open a new tab in your web browser pointing to `http://localhost:8521`.

### Options

You can specify a different directory and port:

```bash
npx mdts [directory] --port 8000
```

-   `-p, --port <port>`: Specify the port to serve on (default: `8521`)
-   `[directory]`: Specify the directory to serve (default: current directory `.`)

**Example:**

To serve Markdown files from the `docs` directory on port `3000`:

```bash
npx mdts docs -p 3000
```

## Development

To build the project:

```bash
npm run build & npm run build:frontend
```

To start the server:
```bash
npm start
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
