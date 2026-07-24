import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';
import { ContentSearchResult } from '../../../../../src/shared/searchTypes';

export interface FileTreeItem {
  path: string;
  status: string;
}

export interface SearchSnippet {
  line: number;
  text: string;
}

export interface FileTreeState {
  fileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[];
  filteredFileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[];
  searchQuery: string;
  searchMode: 'filename' | 'content';
  contentSearchResults: ContentSearchResult[];
  expandedNodes: string[];
  mountedDirectoryPath: string;
  isGitRepository: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FileTreeState = {
  fileTree: [],
  filteredFileTree: [],
  searchQuery: '',
  searchMode: 'filename',
  contentSearchResults: [],
  expandedNodes: [],
  mountedDirectoryPath: '',
  isGitRepository: false,
  loading: true,
  error: null,
};

const LOCAL_STORAGE_KEY_PREFIX = 'mdts_expanded_nodes_';
const LOCAL_STORAGE_RECENT_PATHS_KEY = 'mdts_recent_paths';
const MAX_RECENT_PATHS = 10;

const saveExpandedNodes = (path: string, nodes: string[]) => {
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PREFIX}${path}`,
      JSON.stringify(nodes)
    );
    let recentPaths: string[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_RECENT_PATHS_KEY) || '[]'
    );
    recentPaths = recentPaths.filter(p => p !== path);
    recentPaths.unshift(path);
    if (recentPaths.length > MAX_RECENT_PATHS) {
      const oldPath = recentPaths.pop();
      if (oldPath) {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${oldPath}`);
      }
    }
    localStorage.setItem(
      LOCAL_STORAGE_RECENT_PATHS_KEY,
      JSON.stringify(recentPaths)
    );
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

const filterTree = (
  tree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[],
  searchQuery: string
): (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] => {
  if (!searchQuery) return tree;

  return tree
    .reduce((acc: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[], item) => {
      if ('path' in item) {
        const fileItem = item as FileTreeItem;
        const fileName = fileItem.path.split('/').pop() || '';
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
          ? [...acc, { [key]: children } as { [key: string]: (FileTreeItem | object)[] }]
          : acc;
      }
    }, []);
};

export const fetchFileTree = createAsyncThunk(
  'fileTree/fetchFileTree',
  async () => {
    const data = await fetchData<{
      fileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[];
      mountedDirectoryPath: string;
      isGitRepository: boolean;
    }>('/api/filetree', 'json');
    return {
      fileTree: data?.fileTree || [],
      mountedDirectoryPath: data?.mountedDirectoryPath,
      isGitRepository: data?.isGitRepository ?? false,
    };
  }
);

export const fetchContentSearchResults = createAsyncThunk(
  'fileTree/fetchContentSearchResults',
  async (query: string) => {
    if (!query || query.trim() === '') return [];
    const data = await fetchData<ContentSearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`, 'json');
    return data || [];
  }
);

const fileTreeSlice = createSlice({
  name: 'fileTree',
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
      if (state.searchMode === 'filename') {
        // Only refresh the file tree filter when in filename search mode.
        // Content search results are handled separately by the fetchContentSearchResults thunk.
        state.filteredFileTree = filterTree(state.fileTree, action.payload);
      }
    },
    setSearchMode: (state, action: { payload: 'filename' | 'content' }) => {
      state.searchMode = action.payload;
      if (action.payload === 'filename') {
        state.filteredFileTree = filterTree(state.fileTree, state.searchQuery);
      } else {
        state.contentSearchResults = [];
      }
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
    expandAllNodes: (
      state, action: { payload: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] | null }
    ) => {
      const allItemIds: string[] = [];
      const collectIds = (items: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[], parentPath: string = '') => {
        items.forEach(item => {
          if (!('path' in item)) {
            const key = Object.keys(item)[0];
            const currentPath = parentPath ? `${parentPath}/${key}` : key;
            allItemIds.push(currentPath);
            collectIds(item[key] as (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[], currentPath);
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
        state.isGitRepository = action.payload.isGitRepository;
        state.filteredFileTree = filterTree(action.payload.fileTree, state.searchQuery);
        state.expandedNodes = loadExpandedNodes(action.payload.mountedDirectoryPath);
      })
      .addCase(fetchFileTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch file tree';
      })
      .addCase(fetchContentSearchResults.fulfilled, (state, action) => {
        if (state.searchMode !== 'content') return;
        if (action.meta.arg !== state.searchQuery) return;
        state.contentSearchResults = action.payload;
      });
  },
});

export const selectFilteredFileTree = (
  fullFileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[],
  targetPath: string
): (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] => {
  if (targetPath === '') {
    const result: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] = [];
    fullFileTree.forEach(item => {
      if ('path' in item) {
        result.push({
          path: (item as FileTreeItem).path.split('/').pop() || (item as FileTreeItem).path,
          status: (item as FileTreeItem).status,
        });
      } else {
        const key = Object.keys(item)[0];
        const newObject: { [key: string]: (FileTreeItem | object)[] } = {};
        newObject[key.split('/').pop() || key] = item[key];
        result.push(newObject);
      }
    });
    return result;
  }

  const findChildren = (
    currentTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[],
    pathSegments: string[],
    currentSegmentIndex: number
  ): (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] | null => {
    if (currentSegmentIndex === pathSegments.length) {
      return currentTree;
    }

    const segment = pathSegments[currentSegmentIndex];

    for (const item of currentTree) {
      if (!('path' in item)) {
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
    const result: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] = [];
    children.forEach(item => {
      if ('path' in item) {
        result.push({ path: (item as FileTreeItem).path.split('/').pop() || (item as FileTreeItem).path, status: (item as FileTreeItem).status });
      } else {
        const key = Object.keys(item)[0];
        const newObject: { [key: string]: (FileTreeItem | object)[] } = {};
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
  setSearchMode,
  toggleNode,
  setExpandedNodes,
  expandAllNodes,
  setMountedDirectoryPath,
} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;
