---
title: Use Cases for mdts
description: Common scenarios and workflows where mdts provides value
category: Documentation
tags:
  - use-cases
  - workflows
  - examples
---

`mdts` provides a fast, local, and intuitive way to browse multiple Markdown files organized in directories. Typical use cases include:

## 1. AI-Generated Content Review and Management

With the rise of AI-assisted writing tools, many users generate Markdown documents using AI models.  
`mdts` provides a convenient way to browse, review, and organize AI-generated content locally, enabling fast iteration and editing.

## 2. Personal Knowledge Base & Wiki

Markdown is widely used for personal note-taking and knowledge management.  
`mdts` lets you browse your personal wiki or knowledge base with a clean file tree and quick preview.

## 3. Project Documentation

Many teams write project documentation as Markdown files spread across folders.  
With `mdts`, you can serve and explore these docs locally without complex build tools.

## 4. Drafting Blogs and Articles

Writers often draft blog posts or articles in Markdown.  
`mdts` helps organize and preview multiple drafts efficiently before publishing.

## 5. Monorepo & Large Project Documentation

In monorepos or large codebases, you may only care about a subset of markdown files.  
Use the `--glob` option to narrow the file tree to the files you need:

```bash
# Show only package READMEs in a monorepo
npx mdts . -g 'packages/*/README.md'

# Focus on API docs and changelogs
npx mdts . -g 'docs/api/**/*.md' 'CHANGELOG.md'
```

This improves startup performance and keeps the UI uncluttered.

## 6. Focused Reading with Minimalist UI

`mdts` features a simple, clean interface designed to minimize distractions.  
This allows users to focus on reading and understanding content, making it ideal for deep study or review sessions.
