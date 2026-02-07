---
title: Advanced Configuration
description: Detailed configuration options and customization guide for mdts
category: Documentation
tags:
  - configuration
  - settings
  - customization
  - advanced
---

This guide covers advanced configuration options and customization techniques for mdts.

## Configuration Storage

mdts uses two storage mechanisms for different types of settings:

### Browser Settings (localStorage)
Stored in browser's localStorage, specific to each browser and domain:
- Theme preferences (light/dark mode)
- Application color themes
- Layout mode (compact/full-width)
- Panel visibility (file tree, outline)
- File tree expanded state
- Recent file paths

### System Configuration File
Stored in `~/.config/mdts/config.json`, shared across all browser sessions:

```json
{
  "fontFamily": "Roboto",
  "fontFamilyMonospace": "Roboto Mono",
  "fontSize": 16,
  "theme": "default",
  "syntaxHighlighterTheme": "auto"
}
```

## Configuration Options

### Font Settings

#### Font Family
Set the primary font for document content:
```json
{
  "fontFamily": "Arial, sans-serif"
}
```

Common options:
- `"Roboto"` (default)
- `"Arial, sans-serif"`
- `"Georgia, serif"`
- `"system-ui"`

#### Monospace Font Family
Set the font for code blocks and inline code:
```json
{
  "fontFamilyMonospace": "Monaco, monospace"
}
```

Common options:
- `"Roboto Mono"` (default)
- `"Monaco, monospace"`
- `"Consolas, monospace"`
- `"Source Code Pro"`

#### Font Size
Set the base font size in pixels:
```json
{
  "fontSize": 18
}
```

Range: 14-24 pixels

### Theme Configuration

#### Application Theme
Choose the overall color scheme:
```json
{
  "theme": "aurora"
}
```

Available themes:
- `default`, `aurora`, `autumn`, `cafe`, `deepsea`, `forest`
- `glacier`, `inkblue`, `inkstone`, `lavender`, `moss`
- `nightfox`, `ocean`, `rosequartz`, `sakura`, `sandstone`
- `solarized`, `storm`, `sunset`, `tropical`, `wisteria`

#### Syntax Highlighting Theme
Configure code block highlighting:
```json
{
  "syntaxHighlighterTheme": "atom-one-dark"
}
```

Popular options:
- `auto` (default, follows dark/light mode)
- `atom-one-dark`, `github`, `vs-code`, `monokai`
- `solarized-dark`, `solarized-light`, `tomorrow`

## Manual Configuration

### Direct File Editing
You can manually edit the configuration file:

```bash
# Edit system config
vim ~/.config/mdts/config.json

# Create config directory if it doesn't exist
mkdir -p ~/.config/mdts
```

### Backup and Restore
```bash
# Backup current config
cp ~/.config/mdts/config.json ~/.config/mdts/config.backup.json

# Restore from backup
cp ~/.config/mdts/config.backup.json ~/.config/mdts/config.json
```

### Reset to Defaults
Delete the config file to reset to defaults:
```bash
rm ~/.config/mdts/config.json
```

## CLI Integration

### Glob Patterns
Use the `--glob` (`-g`) option to filter which markdown files are shown in the file tree.
Patterns are resolved relative to the specified directory.

```bash
# Show only files matching a pattern
npx mdts ./project -g 'docs/**/*.md'

# Multiple patterns
npx mdts ./monorepo -g 'packages/*/README.md' 'docs/*.md'

# Meeting notes from a specific year
npx mdts ./notes -g '2026/**/*.md'
```

When `--glob` is not provided, all markdown files in the directory are shown as before.

### Programmatic Usage
You can also use mdts as a Node.js module:

```javascript
import { startServer } from 'mdts';

const server = startServer({
  directory: './docs',
  port: 8521,
  host: 'localhost',
  silent: false
});
```

### Custom Startup Scripts
Create shell scripts for common configurations:

```bash
#!/bin/bash
# docs-server.sh
npx mdts ./documentation --host 0.0.0.0 --port 3000

# monorepo-docs.sh — only show package READMEs
npx mdts . -g 'packages/*/README.md' 'docs/**/*.md'
```

## Advanced Customization

### Custom CSS (Future)
While not currently supported, custom CSS injection may be added in future versions for advanced styling customization.

### Plugin System (Future)  
A plugin system for extending markdown rendering capabilities is under consideration for future releases.

## Performance Tuning

### Directory Optimization
- Point mdts to specific subdirectories rather than large root directories
- Use `.gitignore` patterns to exclude unnecessary files
- Avoid directories with thousands of files

### Memory Management
- Restart mdts periodically for long-running sessions
- Monitor memory usage if processing very large markdown files
- Consider splitting large documents into smaller files

## Security Considerations

### Network Access
```bash
# Local only (default, secure)
npx mdts

# Network accessible (use carefully)
npx mdts --host 0.0.0.0
```

### File Access
- mdts can only access files within the mounted directory
- No file write operations are performed
- Configuration files are stored in user's home directory

### Content Security
- Inline HTML is processed and rendered
- External links are preserved as-is
- No external content is automatically fetched

---

For additional configuration help, see the [FAQ](faq.md) or [API Reference](api.md).
