import { configureStore } from '@reduxjs/toolkit';
import fileTreeReducer, { 
  setSearchQuery, 
  toggleNode, 
  setExpandedNodes, 
  expandAllNodes, 
  setMountedDirectoryPath, 
  fetchFileTree, 
  selectFilteredFileTree,
} from '../../src/store/slices/fileTreeSlice';
import { fetchData } from '../../src/api';

// Mock fetchData
jest.mock('../../src/api', () => ({
  fetchData: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('fileTreeSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        fileTree: fileTreeReducer,
      },
    });
  });

  it('should return the initial state', () => {
    expect(store.getState().fileTree.fileTree).toEqual([]);
    expect(store.getState().fileTree.filteredFileTree).toEqual([]);
    expect(store.getState().fileTree.searchQuery).toEqual('');
    expect(store.getState().fileTree.expandedNodes).toEqual([]);
    expect(store.getState().fileTree.mountedDirectoryPath).toEqual('');
    expect(store.getState().fileTree.loading).toBe(true);
    expect(store.getState().fileTree.error).toBeNull();
  });

  it('should handle setSearchQuery', () => {
    const fileTree = [
      { 'dir1': ['dir1/file1.md', 'dir1/file2.txt'] },
      'file3.md',
    ];
    store.dispatch(fetchFileTree.fulfilled({ fileTree, mountedDirectoryPath: '/test' }, '', undefined));

    store.dispatch(setSearchQuery('file1'));
    expect(store.getState().fileTree.searchQuery).toEqual('file1');
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dir1': ['dir1/file1.md'] },
    ]);

    store.dispatch(setSearchQuery('file'));
    expect(store.getState().fileTree.searchQuery).toEqual('file');
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dir1': ['dir1/file1.md', 'dir1/file2.txt'] },
      'file3.md',
    ]);

    store.dispatch(setSearchQuery(''));
    expect(store.getState().fileTree.searchQuery).toEqual('');
    expect(store.getState().fileTree.filteredFileTree).toEqual(fileTree);
  });

  it('should handle toggleNode', () => {
    store.dispatch(setMountedDirectoryPath('/test/path'));
    store.dispatch(toggleNode('path/to/node'));
    expect(store.getState().fileTree.expandedNodes).toEqual(['path/to/node']);
    expect(localStorage.getItem('mdts_expanded_nodes_/test/path')).toEqual(JSON.stringify(['path/to/node']));

    store.dispatch(toggleNode('path/to/node'));
    expect(store.getState().fileTree.expandedNodes).toEqual([]);
    expect(localStorage.getItem('mdts_expanded_nodes_/test/path')).toEqual(JSON.stringify([]));
  });

  it('should handle setExpandedNodes', () => {
    store.dispatch(setMountedDirectoryPath('/test/path'));
    store.dispatch(setExpandedNodes(['node1', 'node2']));
    expect(store.getState().fileTree.expandedNodes).toEqual(['node1', 'node2']);
    expect(localStorage.getItem('mdts_expanded_nodes_/test/path')).toEqual(JSON.stringify(['node1', 'node2']));
  });

  it('should handle expandAllNodes', () => {
    const fileTree = [
      { 'dir1': ['dir1/file1.md', { 'dir2': ['dir1/dir2/file2.md'] }] },
      'file3.md',
    ];
    store.dispatch(setMountedDirectoryPath('/test/path'));
    store.dispatch(expandAllNodes(fileTree));
    expect(store.getState().fileTree.expandedNodes).toEqual([
      'dir1',
      'dir1/dir2',
    ]);
    expect(localStorage.getItem('mdts_expanded_nodes_/test/path')).toEqual(JSON.stringify([
      'dir1',
      'dir1/dir2',
    ]));
  });

  it('should handle setMountedDirectoryPath', () => {
    store.dispatch(setMountedDirectoryPath('/new/path'));
    expect(store.getState().fileTree.mountedDirectoryPath).toEqual('/new/path');
  });

  describe('fetchFileTree async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch(fetchFileTree.pending('requestId', undefined));
      expect(store.getState().fileTree.loading).toBe(true);
      expect(store.getState().fileTree.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockFileTree = [{ 'dir': ['dir/file.md'] }];
      const mockMountedPath = '/mock/path';
      (fetchData as jest.Mock).mockResolvedValueOnce({ fileTree: mockFileTree, mountedDirectoryPath: mockMountedPath });

      await store.dispatch(fetchFileTree());

      expect(store.getState().fileTree.loading).toBe(false);
      expect(store.getState().fileTree.fileTree).toEqual(mockFileTree);
      expect(store.getState().fileTree.mountedDirectoryPath).toEqual(mockMountedPath);
      expect(store.getState().fileTree.filteredFileTree).toEqual(mockFileTree);
      expect(store.getState().fileTree.expandedNodes).toEqual([]); // No expanded nodes in local storage initially
    });

    it('should load expanded nodes from local storage on fulfilled state', async () => {
      const mockFileTree = [{ 'dir': ['dir/file.md'] }];
      const mockMountedPath = '/mock/path';
      localStorage.setItem(`mdts_expanded_nodes_${mockMountedPath}`, JSON.stringify(['dir']));
      (fetchData as jest.Mock).mockResolvedValueOnce({ fileTree: mockFileTree, mountedDirectoryPath: mockMountedPath });

      await store.dispatch(fetchFileTree());

      expect(store.getState().fileTree.expandedNodes).toEqual(['dir']);
    });

    it('should handle rejected state', async () => {
      const errorMessage = 'Failed to fetch';
      (fetchData as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchFileTree());

      expect(store.getState().fileTree.loading).toBe(false);
      expect(store.getState().fileTree.error).toEqual(errorMessage);
    });
  });

  describe('selectFilteredFileTree selector', () => {
    const fullFileTree = [
      { 'dir1': ['root/dir1/fileA.md', 'root/dir1/fileB.txt'] },
      { 'dir2': ['root/dir2/fileC.md'] },
      'root/fileD.md',
    ];

    it('should return top-level items when targetPath is empty', () => {
      const selected = selectFilteredFileTree(fullFileTree, '');
      expect(selected).toEqual([
        { 'dir1': ['root/dir1/fileA.md', 'root/dir1/fileB.txt'] },
        { 'dir2': ['root/dir2/fileC.md'] },
        'fileD.md',
      ]);
    });

    it('should return children of a specified directory', () => {
      const selected = selectFilteredFileTree(fullFileTree, 'root/dir1');
      expect(selected).toEqual([]);
    });

    it('should return empty array for non-existent path', () => {
      const selected = selectFilteredFileTree(fullFileTree, 'nonexistent/path');
      expect(selected).toEqual([]);
    });

    it('should handle nested directories', () => {
      const nestedFileTree = [
        { 'root/dirA': [{ 'root/dirA/dirB': ['root/dirA/dirB/fileX.md'] }] },
      ];
      const selected = selectFilteredFileTree(nestedFileTree, 'root/dirA/dirB');
      expect(selected).toEqual([]);
    });
  });
});
