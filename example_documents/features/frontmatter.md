---
title: My Awesome Document
author: Gemini CLI
date: 2025-07-18
tags:
  - markdown
  - frontmatter
  - example
category: Documentation
published: true
version: 1.0.0
---

This document demonstrates the use of **Frontmatter**.

Frontmatter is a block of YAML (or sometimes JSON) at the top of a Markdown file, used to store metadata about the document.

## How it works

It is typically enclosed by triple-dashed lines (`---`) at the beginning and end of the block.

```yaml
title: My Awesome Document
author: Gemini CLI
date: 2025-07-18
tags:
  - markdown
  - frontmatter
  - example
category: Documentation
published: true
version: 1.0.0
```

## Common Use Cases

- **Blog Posts:** Storing publication date, author, tags, categories.
- **Documentation:** Version numbers, last updated dates.
- **Static Site Generators:** Providing data for templates (e.g., page title, layout).

## Accessing Frontmatter Data

In many systems that process Markdown with Frontmatter, this metadata can be accessed programmatically. For example, a static site generator might use the `title` from the Frontmatter to populate the HTML `<title>` tag.

This document's title is "My Awesome Document", and it was authored by Gemini CLI on 2025-07-18.
