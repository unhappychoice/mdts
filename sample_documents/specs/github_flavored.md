# GitHub Flavored Markdown (GFM) Features

This document showcases various features specific to GitHub Flavored Markdown (GFM).

## 1. Task Lists

Task lists allow you to create checklists within your Markdown documents.

- [x] Complete this task
- [ ] Start this task
- [ ] Finish this task

## 2. Tables

GFM supports creating tables using pipes (`|`) and hyphens (`-`).

| Header 1 | Header 2 | Header 3 |
| :------- | :------: | -------: |
| Left     | Center   | Right    |
| Cell A   | Cell B   | Cell C   |
| Cell D   | Cell E   | Cell F   |

## 3. Strikethrough

Use two tildes (`~~`) to strikethrough text.

This is some ~~strikethrough text~~.

## 4. Autolinks

GFM automatically turns URLs and email addresses into clickable links.

Visit our website: https://github.com/unhappychoice/mdts
Contact us at: example@example.com

## 5. Fenced Code Blocks

While standard Markdown supports indented code blocks, GFM's fenced code blocks are more common and support syntax highlighting.

```python
# Python example
def hello_gfm():
    print("Hello, GFM!")

hello_gfm()
```

## 6. Footnotes (Extension)

Although not part of the original Markdown spec, footnotes are a common extension, often supported in GFM contexts.

Here is some text with a footnote.[^gfm_footnote]

[^gfm_footnote]: This is a footnote demonstrating GFM's common extensions.

## 7. Emoji Shortcodes

GFM supports emoji shortcodes, which are converted into actual emojis.

:smile: :rocket: :+1: :tada:

