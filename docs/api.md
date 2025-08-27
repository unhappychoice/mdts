---
title: API Reference
description: REST API endpoints and WebSocket interface for mdts server
category: Documentation
tags:
  - api
  - endpoints
  - websocket
  - development
---

# API Reference

mdts provides a REST API and WebSocket interface for programmatic access to markdown content and configuration.

## Base URL

When running locally: `http://localhost:8521`

## REST API Endpoints

### File Tree API

#### `GET /api/filetree`
Returns the complete file tree structure of the mounted directory.

**Response:**
```json
{
  "fileTree": [...],
  "mountedDirectoryPath": "/path/to/directory"
}
```

#### `GET /api/filetree?path=<file_path>`
Returns rendered markdown content for a specific file.

**Parameters:**
- `path` - File path relative to mounted directory

**Response:**
```json
{
  "markdown": "rendered HTML content"
}
```

### Outline API

#### `GET /api/outline?path=<file_path>`
Returns the table of contents (outline) for a markdown file.

**Parameters:**
- `path` - File path relative to mounted directory

**Response:**
```json
{
  "outline": [
    {
      "level": 1,
      "text": "Heading Text",
      "anchor": "heading-text"
    }
  ]
}
```

### Configuration API

#### `GET /api/config`
Returns current system configuration settings.

**Response:**
```json
{
  "fontFamily": "Roboto",
  "fontFamilyMonospace": "Roboto Mono", 
  "fontSize": 16,
  "theme": "default",
  "syntaxHighlighterTheme": "auto"
}
```

#### `POST /api/config`
Updates system configuration settings.

**Request Body:**
```json
{
  "fontFamily": "Arial",
  "fontSize": 18,
  "theme": "dark"
}
```

**Response:** `200 OK` with "Config saved" message

### Welcome Content API

#### `GET /api/markdown/mdts-welcome-markdown.md`
Returns the default welcome markdown content.

## WebSocket Interface

### Connection
Connect to WebSocket at: `ws://localhost:8521`

### Messages

#### File Watching
Send a `watch-file` message to start watching a file for changes:

```json
{
  "type": "watch-file",
  "path": "relative/path/to/file.md"
}
```

#### Live Reload
The server sends reload notifications when watched files change:

```json
{
  "type": "reload",
  "path": "path/to/changed/file.md"
}
```

## Error Responses

All API endpoints return appropriate HTTP status codes:

- `200 OK` - Success
- `404 Not Found` - File or resource not found
- `500 Internal Server Error` - Server error

Error responses include descriptive error messages in the response body.

## Usage Examples

### Fetch File Tree
```bash
curl http://localhost:8521/api/filetree
```

### Get Markdown Content
```bash
curl "http://localhost:8521/api/filetree?path=README.md"
```

### Update Configuration
```bash
curl -X POST http://localhost:8521/api/config \
  -H "Content-Type: application/json" \
  -d '{"fontSize": 18, "theme": "dark"}'
```

## Development Notes

- All file paths in API responses are relative to the mounted directory
- WebSocket connections are automatically established by the frontend
- Configuration changes are persisted to `~/.config/mdts/config.json`
- The server supports CORS for development purposes