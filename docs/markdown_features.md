# Supported Markdown Features

This document outlines the Markdown features supported by mdts. mdts aims to provide a rich and versatile Markdown rendering experience, including standard Markdown syntax and several popular extensions.

## Standard Markdown

mdts fully supports the CommonMark specification, which includes:

*   **Headings:** H1 to H6
*   **Paragraphs:** Standard text blocks
*   **Emphasis:** Bold (`**text**` or `__text__`) and Italic (`*text*` or `_text_`)
*   **Blockquotes:** Using `> `
*   **Lists:** Ordered (`1. `) and Unordered (`- ` or `* `)
*   **Code Blocks:** Fenced code blocks (```language) and inline code (`code`)
*   **Links:** Inline links (`[text](url)`) and reference links
*   **Images:** Inline images (`![alt text](url)`)
*   **Horizontal Rules:** Using `---`, `***`, or `___`

## Extended Markdown Features

In addition to standard Markdown, mdts supports several extended features for enhanced document creation:

### Tables

Create well-formatted tables using Markdown syntax.

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
```

### Task Lists

Create interactive task lists within your documents.

```markdown
- [x] Completed task
- [ ] Pending task
```

### Footnotes

Add footnotes to provide additional information without cluttering the main text.

```markdown
Here is some text with a footnote[^1].

[^1]: This is the footnote content.
```

### Frontmatter

Support for YAML frontmatter at the beginning of your Markdown files for metadata.

```markdown
---
title: My Document
author: John Doe
date: 2023-07-23
---

# Document Content
```

### Inline HTML

You can embed raw HTML directly within your Markdown files.

```markdown
This is a paragraph with some <span>inline HTML</span>.
```

### Mermaid Diagrams

Integrate Mermaid syntax to render diagrams and flowcharts directly within your Markdown.

````markdown
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

### Syntax Highlighting

Code blocks automatically receive syntax highlighting for various programming languages. Specify the language after the opening fence.

```javascript
// Example JavaScript code
function greet(name) {
  console.log(`Hello, ${name}!`);
}
greet('World');
```

## GitHub Flavored Markdown (GFM)

mdts largely adheres to the GitHub Flavored Markdown (GFM) specification, which includes features like:

*   **Autolinks:** URLs and email addresses are automatically converted to links.
*   **Strikethrough:** Using `~~text~~`
*   **Tables:** (as mentioned above)
*   **Task Lists:** (as mentioned above)

We strive to keep our Markdown rendering up-to-date with widely adopted standards to ensure compatibility and a consistent viewing experience.
