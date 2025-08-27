---
title: Basic Markdown Specification
description: Comprehensive demonstration of CommonMark specification features
category: Specification
tags:
  - commonmark
  - basic
  - specification
  - reference
spec: basic
---

# Markdown Comprehensive Sample

This file demonstrates a wide variety of Markdown features.

## 1. Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## 2. Text Formatting

This is **bold text**.
This is *italic text*.
This is ***bold and italic text***.
This is ~~strikethrough text~~.

You can also use `inline code` within a sentence.

---

## 3. Blockquotes

> This is a blockquote. It's useful for quoting text from another source.
>
> > This is a nested blockquote.

---

## 4. Lists

### Unordered List
- Item 1
- Item 2
  - Nested Item 2.1
  - Nested Item 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task to do

---

## 5. Code Blocks

You can create fenced code blocks with syntax highlighting:

```javascript
// Javascript code example
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

```python
# Python code example
def add(a, b):
  return a + b

print(add(5, 3))
```

---

## 6. Horizontal Rule

You can create a horizontal rule using three or more hyphens, asterisks, or underscores.

---
***
___

---

## 7. Links

### External Links
[Visit Google](https://www.google.com)
[Visit the project repository](https://github.com/unhappychoice/mdts)

### Internal Anchor Links
This is a link to a section within this document.
[Go to the Tables section](#8-tables)

---

## 8. Images

![Placeholder Image](../logo.svg)

*Caption for the image above.*

---

## 9. Tables

Tables are created using pipes and hyphens.

| Header 1 | Header 2 | Header 3 |
| :--- | :---: | ---: |
| Left-aligned | Centered | Right-aligned |
| Cell 1 | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |

