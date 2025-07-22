# Frontend Features
## 1. Application Layout & Structure

- **Overall Application Display:**
  - The main application window, including header, left panel, and right panel.
  - Responsiveness across different screen sizes.

- **Header Bar:**
  - Display of application title/logo.
  - Any interactive elements within the header (e.g., theme toggles, view mode selectors).

- **Left Panel (File Navigation):**
  - Display of the file and directory tree.
  - Expand/collapse functionality for directories.
  - Selection of files/directories to view content.

- **Right Panel (Content Display):**
  - Area where file content or directory listings are shown.

## 2. Content Display & Interaction

- **Markdown Content Rendering:**
  - Accurate display of Markdown syntax (headings, lists, bold/italic text, code blocks, tables, links, images).
  - Handling of embedded HTML within Markdown.
  - Correct rendering of Mermaid diagrams (if supported).
  - Display of frontmatter information (if applicable).

- **Directory Listing Display:**
  - List of files and subdirectories within a selected directory.
  - Clickable entries to navigate into subdirectories or open files.

- **Breadcrumb Navigation:**
  - Visual path indicating the current directory location.
  - Clickable segments to navigate back to parent directories.

- **Error Message Display:**
  - Clear and informative messages when content cannot be loaded or an error occurs.

## 3. User Experience & Settings

- **Theme Switching:**
  - Ability to change the application's visual theme (e.g., light mode, dark mode).
  - Consistency of theme application across all UI elements.

- **View Mode Selection:**
  - Options to change how content is displayed (e.g., preview mode, split view, source code view).

- **Real-time Content Updates:**
  - Automatic refresh of content when the source file changes on disk.

## 4. Overall Application Behavior

- **Navigation Flow:**
  - Smooth transitions and correct content loading when navigating between files and directories.

- **Performance:**
  - Application responsiveness and loading times.

- **Error Handling:**
  - Graceful handling of unexpected situations without crashing.

- **Initial Load:**
  - Correct display of default content or welcome screen upon application startup.
