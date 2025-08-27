---
title: Frontend Features
description: Comprehensive guide to mdts web interface features and customization options
category: Documentation
tags:
  - frontend
  - ui
  - features
  - customization
---

# ✨ Key Features of `mdts`

`mdts` offers a clean and intuitive interface for browsing and reading Markdown documents, with a focus on comfort, performance, and real-time preview.

## 🖥️ 1. Intuitive and Clean Layout

The UI is divided into three panels—file tree, document view, and outline—making navigation effortless.

### 🧭 Header Bar

- **Logo & Title**: Click to return to the home page.
- **Settings Button**: Opens comprehensive settings dialog for customizing appearance.
- **GitHub Link**: Quick access to the project repository.
- **Version Info**: Shows current version with link to changelog.

### 🌲 File Tree (Left Panel)

- **Folder Navigation**: Browse and expand/collapse folders.
- **File Search**: Filter by filename as you type.
- **Quick Access**: Click any file to open instantly.
- **Tree Controls**: Expand/collapse all folders with one click.

### 📄 Document Viewer (Center Panel)

- **Beautiful Markdown Rendering**: Supports headings, lists, code blocks, tables, images.
- **Mermaid Diagrams**: Flowcharts and diagrams are rendered inline.
- **Syntax Highlighting**: Code is easy to read.
- **Frontmatter Panel**: Displays metadata like title, tags, and author (if present).
- **Folder Listing**: Selecting a folder shows its contents.
- **Breadcrumbs**: Shows current path and allows quick navigation up.
- **Error Display**: Clear messages when loading fails.

### 🧱 Outline Panel (Right)

- **Table of Contents**: All headings listed hierarchically.
- **Quick Jumps**: Click to jump to a section in long documents.

## ⚙️ 2. Interactive Viewing Modes

- **Preview Mode**: Default view with full rendering.
- **Metadata Mode**: View document frontmatter in detail.
- **Raw Mode**: See the raw Markdown source.
- **Live Reload**: Changes made in external editors appear instantly in the viewer.

## 🧩 3. Comprehensive Settings & Customization

`mdts` provides an advanced settings dialog (accessible via the gear icon) with three main configuration tabs:

### 🎨 Layout Settings
- **Content Width**: Toggle between `compact` (centered, focused reading) and `full-width` (spans entire screen) layouts
- **Responsive Design**: Automatically adjusts to different screen sizes

### 🌈 Color Scheme Settings  
- **Light/Dark Mode**: Instantly switch between light and dark themes
- **Application Themes**: Choose from multiple built-in color schemes to personalize the interface
- **Syntax Highlighting Themes**: Select from a wide variety of popular code highlighting themes (Atom One Dark, GitHub, VS Code, etc.)

### 🔤 Font Settings
- **Font Size**: Adjust global text size with live preview (14px - 24px range)
- **Font Family**: Customize regular text font (system defaults or custom fonts)
- **Monospace Font**: Set specific font for code blocks and inline code
- **Font Input Modes**: Choose between dropdown selection or custom font input

### 💾 Persistent Settings
Settings are saved in two locations for maximum flexibility:

- **Browser Storage (localStorage)**: Theme preferences, layout settings, and file tree state
- **System Configuration**: Font settings and global preferences saved to `~/.config/mdts/config.json`

This dual approach ensures your customizations persist across different browsers and sessions while maintaining system-wide consistency for core settings like fonts.

## 🚀 4. Fast and Reliable

- **Smooth Navigation**: Fast file switching and rendering.
- **Lightweight & Fast**: Designed to be performant even with large files.
- **Stable Behavior**: Handles edge cases gracefully.
- **Quick Start**: Loads immediately with welcome screen or last opened content.

---

`mdts` enhances the Markdown reading experience with thoughtful design, real-time preview, and powerful productivity features.
