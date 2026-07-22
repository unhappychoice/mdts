import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useSimpleTreeViewApiRef } from '@mui/x-tree-view/hooks';
import React, { useEffect } from 'react';
import { RecursiveTreeItems } from './RecursiveTreeItems';
import { FileTree } from './types';

interface FileTreeViewProps {
  filteredFileTree: FileTree | null;
  expandedNodes: string[];
  selectedFilePath: string | null;
  onFileSelect: (path: string) => void;
  onExpandedItemsChange: (event: React.SyntheticEvent, itemIds: string[]) => void;
  getStatusColor: (status: string) => string;
}

export const FileTreeView: React.FC<FileTreeViewProps> = ({
  filteredFileTree,
  expandedNodes,
  selectedFilePath,
  onFileSelect,
  onExpandedItemsChange,
  getStatusColor
}) => {
  const apiRef = useSimpleTreeViewApiRef();

  useEffect(() => {
    if (!selectedFilePath) return undefined;

    let cancelled = false;
    const tryScroll = () => {
      if (cancelled) return true;
      const element = apiRef.current?.getItemDOMElement?.(selectedFilePath);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return true;
      }
      return false;
    };

    if (tryScroll()) {
      return () => {
        cancelled = true;
      };
    }

    // Newly expanded parents may not have mounted the item yet.
    const timeoutId = window.setTimeout(tryScroll, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [apiRef, selectedFilePath, expandedNodes]);

  return (
    <SimpleTreeView
      apiRef={apiRef}
      className="custom-scrollbar"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expandedItems={expandedNodes}
      selectedItems={selectedFilePath}
      onExpandedItemsChange={onExpandedItemsChange}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', height: 'calc(100vh - 180px)', px: 2, pb: 2 }}
    >
      <RecursiveTreeItems tree={filteredFileTree} onFileSelect={onFileSelect} getStatusColor={getStatusColor} />
    </SimpleTreeView>
  );
};
