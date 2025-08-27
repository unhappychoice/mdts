#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const EXAMPLE_DOCS_DIR = path.join(__dirname, '../example_documents');
const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(__dirname, '../netlify/functions/demo-data.ts');

interface FileTreeItem {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: FileTreeItem[];
  size?: number;
  modified?: string;
}

function generateFileTree(dirPath: string): FileTreeItem[] {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const tree: FileTreeItem[] = [];

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        const children = generateFileTree(fullPath);
        // Only include directory if it has children (not empty)
        if (children.length > 0) {
          tree.push({
            name: item.name,
            path: item.name, // Just use name, will be adjusted later
            type: 'directory',
            children
          });
        }
      } else if (item.name.endsWith('.md') || item.name.endsWith('.markdown')) {
        const stats = fs.statSync(fullPath);
        tree.push({
          name: item.name,
          path: item.name, // Just use name, will be adjusted later
          type: 'file',
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    }

    return tree.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error generating file tree:', error);
    return [];
  }
}

function readAllFiles(dirPath: string, basePath: string = '', fileMap: Map<string, string> = new Map()): Map<string, string> {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        readAllFiles(fullPath, relativePath, fileMap);
      } else if (item.name.endsWith('.md') || item.name.endsWith('.markdown')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          fileMap.set(relativePath, content);
        } catch (error) {
          console.warn(`Failed to read file ${fullPath}:`, error);
        }
      }
      // Images are handled as static files, not included in demo data
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
  
  return fileMap;
}

function adjustTreePaths(tree: FileTreeItem[], parentPath: string): FileTreeItem[] {
  return tree.map(item => {
    const newPath = `${parentPath}/${item.name}`;
    return {
      ...item,
      path: newPath,
      children: item.children ? adjustTreePaths(item.children, newPath) : undefined
    };
  });
}

function main(): void {
  console.log('Generating demo data...');

  // Generate file tree with docs and example_documents as separate root folders
  const fileTree: FileTreeItem[] = [];
  
  if (fs.existsSync(EXAMPLE_DOCS_DIR)) {
    const exampleTree = generateFileTree(EXAMPLE_DOCS_DIR);
    if (exampleTree.length > 0) {
      // Adjust paths to include parent directory
      const adjustedTree = adjustTreePaths(exampleTree, 'example_documents');
      fileTree.push({
        name: 'example_documents',
        path: 'example_documents',
        type: 'directory',
        children: adjustedTree
      });
    }
  }
  
  if (fs.existsSync(DOCS_DIR)) {
    const docsTree = generateFileTree(DOCS_DIR);
    if (docsTree.length > 0) {
      // Adjust paths to include parent directory
      const adjustedTree = adjustTreePaths(docsTree, 'docs');
      fileTree.push({
        name: 'docs',
        path: 'docs',
        type: 'directory',
        children: adjustedTree
      });
    }
  }

  // Read all file contents
  const fileContents = new Map<string, string>();
  
  if (fs.existsSync(EXAMPLE_DOCS_DIR)) {
    readAllFiles(EXAMPLE_DOCS_DIR, 'example_documents', fileContents);
  }
  
  if (fs.existsSync(DOCS_DIR)) {
    readAllFiles(DOCS_DIR, 'docs', fileContents);
  }

  // Read welcome.md
  const welcomePath = path.join(__dirname, '../public/welcome.md');
  let welcomeContent = '';
  if (fs.existsSync(welcomePath)) {
    welcomeContent = fs.readFileSync(welcomePath, 'utf8');
  }

  // Generate TypeScript file
  const tsContent = `// Auto-generated demo data - do not edit manually
export interface FileTreeItem {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: FileTreeItem[];
  size?: number;
  modified?: string;
}

export const WELCOME_CONTENT = ${JSON.stringify(welcomeContent)};

export const DEMO_FILE_TREE: FileTreeItem[] = ${JSON.stringify(fileTree, null, 2)};

export const DEMO_FILE_CONTENTS: Record<string, string> = {
  "mdts-welcome-markdown.md": WELCOME_CONTENT,${fileContents.size > 0 ? '\n' + Array.from(fileContents.entries())
  .map(([path, content]) => `  ${JSON.stringify(path)}: ${JSON.stringify(content)}`)
  .join(',\n') : ''}
};
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log('✅ Demo data generated:', OUTPUT_FILE);
  console.log(`📁 Generated ${fileTree.length} file tree items`);
  console.log(`📄 Generated ${fileContents.size} file contents`);
}

if (require.main === module) {
  main();
}