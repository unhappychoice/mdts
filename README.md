<h1 align="center">
  <img src="docs/logo.svg" alt="mdts" width="400">
</h1>

`mdts` (MarkDown Tree Server) is a simple command-line tool that serves Markdown files from a specified local directory and provides a web-based interface to browse and view them. It automatically opens the served content in your default web browser.

## Features

- **File Tree Navigation**: Provides a hierarchical view of your Markdown files for easy browsing.
- **Markdown Rendering**: Renders Markdown files in a clean, readable format.
- **Live Reload**: Automatically reloads the page in the browser when Markdown files are changed on disk. 

![screenshot](docs/screen_animation.gif)


## Usage
```bash
npx mdts
```

By default, `mdts` will serve files from the current directory (`.`) on port `8521`. It will automatically open a new tab in your web browser pointing to `http://localhost:8521`.

### Options

You can specify a different directory and port:

-   `-p, --port <port>`: Specify the port to serve on (default: `8521`)
-   `[directory]`: Specify the directory to serve (default: current directory `.`)

**Example:**

To serve Markdown files from the `docs` directory on port `3000`:

```bash
npx mdts docs -p 3000
```

### Advanced Usage Examples
Here are some practical scenarios where `mdts` can be useful:

-   **AI-powered documentation workflow:**
    Leverage AI tools to generate or refine your documentation. As the AI produces content, use `mdts` to instantly preview the generated Markdown files locally. This allows for a rapid feedback loop, enabling you to review, edit, and iterate on AI-generated documentation in real-time within your browser, ensuring accuracy and adherence to your project's style before committing changes.
    ```bash
    # Assuming your AI-generated docs are in a 'docs-ai' directory
    npx mdts docs-ai
    ```
    This setup provides a seamless way to integrate AI into your documentation pipeline, making the process of creating and maintaining comprehensive project documentation more efficient.

-   **Exploring a new project's documentation:**
    When joining a new project, you often need to quickly understand its structure and documentation. Running `mdts` at the project root can give you an immediate overview of all Markdown-based documentation (e.g., `README.md`, `CONTRIBUTING.md`, `docs/`).
    ```bash
    # Navigate to your new project's root directory
    cd /path/to/new-project
    npx mdts .
    ```
    This provides a convenient way to browse all project-related Markdown files without opening them individually in a text editor.

-   **Browsing a collection of Markdown notes/documents:**
    If you have a repository where you collect Markdown files exported from various sources (e.g., Notion, Evernote, Confluence), `mdts` can help you browse them easily.
    ```bash
    npx mdts ~/my-markdown-collection
    ```
    This will serve all Markdown files in `~/my-markdown-collection` and its subdirectories, allowing you to navigate through them in your browser.

-   **Reviewing `README` files of installed `node_modules`:**
    Sometimes you might want to quickly check the `README.md` of a library installed in your `node_modules` directory to understand its usage or features.
    ```bash
    npx mdts node_modules
    ```
    This will serve the `node_modules` directory, allowing you to browse the `README.md` files of your installed packages directly in your browser.

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
