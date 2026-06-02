export const MARKDOWN_FILE_EXTENSIONS = ['.md', '.markdown', '.mdc'];

export const hasSupportedMarkdownExtension = (filePath: string): boolean => {
  const lowerCasePath = filePath.toLowerCase();
  return MARKDOWN_FILE_EXTENSIONS.some(extension => lowerCasePath.endsWith(extension));
};
