export interface FileTreeItem {
  path: string;
  status: string;
}

export type FileTree = (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[];
