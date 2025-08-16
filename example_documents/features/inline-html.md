# Inline HTML Example

This document demonstrates how inline HTML can be used within Markdown.

## Basic Inline HTML

You can use `<span>` tags to apply styles or other attributes to text:
This is a <span style="color: blue;">blue text</span>.
This is a <span style="font-weight: bold;">bold text</span>.

## Block-level HTML

You can also embed block-level HTML elements. Note that Markdown parsing within block-level HTML is often disabled by default, but it depends on the Markdown parser.

<div>
  <h3>This is an HTML heading inside a div</h3>
  <p>This is a paragraph inside the div. Markdown like **bold** or *italic* might not be parsed here.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>

## Combining Markdown and HTML

Here, Markdown is used outside the HTML block, but HTML is used inside.

Markdown paragraph with some <em>emphasized text</em> using HTML.

```html
<p>This is a raw HTML paragraph.</p>
```

## Self-closing tags

Self-closing tags like `<br>` or `<hr>` also work:
First line.<br>Second line.
<hr>
Another section after a horizontal rule.
