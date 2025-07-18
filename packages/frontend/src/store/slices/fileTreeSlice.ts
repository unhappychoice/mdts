
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

interface FileTreeItem {
  [key: string]: (FileTreeItem | string)[];
}

interface FileTreeState {
  fileTree: (FileTreeItem | string)[];
  filteredFileTree: (FileTreeItem | string)[];
  searchQuery: string;
  expandedNodes: string[];
  mountedDirectoryPath: string;
  loading: boolean;
  error: string | null;
}

const initialState: FileTreeState = {
  fileTree: [],
  filteredFileTree: [],
  searchQuery: '',
  expandedNodes: [],
  mountedDirectoryPath: '',
  loading: true,
  error: null,
};

const LOCAL_STORAGE_KEY_PREFIX = 'mdts_expanded_nodes_';
const LOCAL_STORAGE_RECENT_PATHS_KEY = 'mdts_recent_paths';
const MAX_RECENT_PATHS = 10;

const saveExpandedNodes = (path: string, nodes: string[]) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${path}`, JSON.stringify(nodes));
    let recentPaths: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RECENT_PATHS_KEY) || '[]');
    recentPaths = recentPaths.filter(p => p !== path);
    recentPaths.unshift(path);
    if (recentPaths.length > MAX_RECENT_PATHS) {
      const oldPath = recentPaths.pop();
      if (oldPath) {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${oldPath}`);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_RECENT_PATHS_KEY, JSON.stringify(recentPaths));
  } catch (e) {
    console.error('Failed to save expanded nodes to local storage', e);
  }
};

const loadExpandedNodes = (path: string): string[] => {
  try {
    const storedNodes = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${path}`);
    return storedNodes ? JSON.parse(storedNodes) : [];
  } catch (e) {
    console.error('Failed to load expanded nodes from local storage', e);
    return [];
  }
};

const filterTree = (tree: (FileTreeItem | string)[], searchQuery: string): (FileTreeItem | string)[] => {
  if (!searchQuery) return tree;

  return tree
    .reduce((acc: (FileTreeItem | string)[], item) => {
      if (typeof item === 'string') {
        const fileName = item.split('/').pop() || '';
        return fileName.toLowerCase().includes(searchQuery.toLowerCase())
          ? [...acc, item]
          : acc;
      } else {
        const key = Object.keys(item)[0];
        const value = item[key];

        const children = Array.isArray(value)
          ? filterTree(value, searchQuery)
          : [];

        return children.length > 0
          ? [...acc, { [key]: children } as FileTreeItem ]
          :acc;
      }
    }, []);
};

export const fetchFileTree = createAsyncThunk(
  'fileTree/fetchFileTree',
  async () => {
    const data = await fetchData<{ fileTree: FileTreeItem[], mountedDirectoryPath: string }>('/api/filetree', 'json');
    return { fileTree: data?.fileTree || [], mountedDirectoryPath: data?.mountedDirectoryPath };
  }
);

const fileTreeSlice = createSlice({
  name: 'fileTree',
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
      state.filteredFileTree = filterTree(state.fileTree, action.payload);
    },
    toggleNode: (state, action: { payload: string }) => {
      const path = action.payload;
      if (state.expandedNodes.includes(path)) {
        state.expandedNodes = state.expandedNodes.filter((nodePath) => nodePath !== path);
      } else {
        state.expandedNodes.push(path);
      }
      saveExpandedNodes(state.mountedDirectoryPath, state.expandedNodes);
    },
    setExpandedNodes: (state, action: { payload: string[] }) => {
      state.expandedNodes = action.payload;
      saveExpandedNodes(state.mountedDirectoryPath, state.expandedNodes);
    },
    expandAllNodes: (state, action: { payload: (FileTreeItem | string)[] | null }) => {
      const allItemIds: string[] = [];
      const collectIds = (items: (FileTreeItem | string)[], parentPath: string = '') => {
        items.forEach(item => {
          if (typeof item !== 'string') {
            const key = Object.keys(item)[0];
            const currentPath = parentPath ? `${parentPath}/${key}` : key;
            allItemIds.push(currentPath);
            collectIds(item[key] as (FileTreeItem | string)[], currentPath);
          }
        });
      };
      if (action.payload) {
        collectIds(action.payload);
      }
      state.expandedNodes = allItemIds;
      saveExpandedNodes(state.mountedDirectoryPath, state.expandedNodes);
    },
    setMountedDirectoryPath: (state, action: { payload: string }) => {
      state.mountedDirectoryPath = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileTree.fulfilled, (state, action) => {
        state.loading = false;
        state.fileTree = action.payload.fileTree;
        state.mountedDirectoryPath = action.payload.mountedDirectoryPath;
        state.filteredFileTree = filterTree(action.payload.fileTree, state.searchQuery);
        state.expandedNodes = loadExpandedNodes(action.payload.mountedDirectoryPath);
      })
      .addCase(fetchFileTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch file tree';
      });
  },
});

export const selectFilteredFileTree = (
  fullFileTree: (FileTreeItem | string)[],
  targetPath: string
): (FileTreeItem | string)[] => {
  if (targetPath === '') {
    const result: FileTreeItem[] | string[] = [];
    fullFileTree.forEach(item => {
      if (typeof item === 'string') {
        result.push(item.split('/').pop() || item);
      } else {
        const key = Object.keys(item)[0];
        const newObject: FileTreeItem = {};
        newObject[key.split('/').pop() || key] = item[key];
        result.push(newObject);
      }
    });
    return result;
  }

  const findChildren = (
    currentTree: (FileTreeItem | string)[],
    pathSegments: string[],
    currentSegmentIndex: number
  ): (FileTreeItem | string)[] | null => {
    if (currentSegmentIndex === pathSegments.length) {
      return currentTree;
    }

    const segment = pathSegments[currentSegmentIndex];

    for (const item of currentTree) {
      if (typeof item !== 'string') {
        const key = Object.keys(item)[0];
        const itemSegments = key.split('/');
        if (itemSegments[itemSegments.length - 1] === segment) {
          const children = item[key];
          if (Array.isArray(children)) {
            return findChildren(children, pathSegments, currentSegmentIndex + 1);
          }
        }
      }
    }
    return null;
  };

  const pathSegments = targetPath.split('/').filter(s => s !== '');
  const children = findChildren(fullFileTree, pathSegments, 0);

  if (children) {
    const result: FileTreeItem[] | string[] = [];
    children.forEach(item => {
      if (typeof item === 'string') {
        result.push(item.split('/').pop() || item);
      } else {
        const key = Object.keys(item)[0];
        const newObject: FileTreeItem = {};
        newObject[key.split('/').pop() || key] = item[key];
        result.push(newObject);
      }
    });
    return result;
  }

  return [];
};

export const {
  setSearchQuery,
  toggleNode,
  setExpandedNodes,
  expandAllNodes,
  setMountedDirectoryPath,
} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;
