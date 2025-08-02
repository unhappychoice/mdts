import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React from 'react';
import { RecursiveTreeItems } from './RecursiveTreeItems';
import { FileTree } from './types';

interface FileTreeViewProps {
  filteredFileTree: FileTree | null;
  expandedNodes: string[];
  onFileSelect: (path: string) => void;
  onExpandedItemsChange: (event: React.SyntheticEvent, itemIds: string[]) => void;
  getStatusColor: (status: string) => string;
}

export const FileTreeView: React.FC<FileTreeViewProps> = ({
  filteredFileTree,
  expandedNodes,
  onFileSelect,
  onExpandedItemsChange,
  getStatusColor
}) => (
  <SimpleTreeView
    className="custom-scrollbar"
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
    expandedItems={expandedNodes}
    onExpandedItemsChange={onExpandedItemsChange}
    sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', height: 'calc(100vh - 180px)', px: 2, pb: 2 }}
  >
    <RecursiveTreeItems tree={filteredFileTree} onFileSelect={onFileSelect} getStatusColor={getStatusColor} />
  </SimpleTreeView>
);
