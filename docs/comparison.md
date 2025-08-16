# Comparison with Other Markdown Server Tools

`mdts` is a unique Markdown preview tool designed to serve Markdown files from a local directory **with a structured, navigable file tree**. This page compares `mdts` with similar tools to highlight its strengths and distinct design philosophy.

## Compared Tools

| Tool Name     | Repository |
|---------------|------------|
| **mdts**      | https://github.com/unhappychoice/mdts |
| markserv      | https://github.com/markserv/markserv |
| md-fileserver | https://github.com/commenthol/md-fileserver |
| grip          | https://github.com/joeyespo/grip |

## Feature Comparison

| Feature                        | **mdts** | markserv | md-fileserver | grip |
|--------------------------------|----------|----------|----------------|------|
| **File tree navigation**       | ✅ Full hierarchical tree | △ Directory listing | △ Basic links | ❌ |
| **GitHub-style rendering**     | △ Custom style | ❌ | ❌ | ✅ |
| **Multi-file browsing**        | ✅ Designed for it | ✅ | ✅ | △ (single file oriented) |
| **Zero-install usage**         | ✅ `npx mdts` supported | ❌ (global install recommended) | ✅ `npx` supported | ❌ |
| **Static HTML export**         | ❌ | ❌ | ❌ | ✅ |
| **Modern UI**                  | ✅ SPA-like with clean UX | △ | ❌ (very minimal) | △ Depends on GitHub API |
| **Project-wide document overview** | ✅ Strong support | △ | ❌ | ❌ |
| **Live reload**                | ✅ | ✅ | ❌ | ❌ |

## Why Choose `mdts`

### ✅ Navigate Markdown in a Structured Way
While most Markdown preview tools focus on rendering single files or flat directories, `mdts` is built for exploring and reviewing **entire documentation projects**. It excels at use cases like:

- Browsing and reviewing a large number of Markdown files
- Hosting project wikis or internal knowledge bases locally
- Previewing document structure before publishing

### ✅ Clean, Focused UI
Built with React and modern CSS, `mdts` offers a distraction-free reading experience. It avoids unnecessary decorations or dependencies, making it ideal for focused document consumption.

### ✅ Zero-install via `npx`
You can start using it immediately with a single command:

```
npx mdts
```

## Use Case Guide

| Use Case | Recommended Tool |
|----------|------------------|
| Explore a full Markdown-based documentation structure | ✅ **mdts** |
| Match GitHub’s exact Markdown appearance | grip |
| Serve `.md` files with minimal setup | md-fileserver |
| Live-preview Markdown while editing | markserv |

## Conclusion

Unlike most Markdown preview tools, `mdts` is tailored for **navigating and understanding structured document sets**. If your project documentation spans multiple files and folders, `mdts` provides a natural and effective way to browse, review, and consume it.
