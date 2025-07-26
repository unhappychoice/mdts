import { configureStore } from '@reduxjs/toolkit';
import fileTreeReducer, {
  expandAllNodes,
  fetchFileTree,
  selectFilteredFileTree,
  setExpandedNodes,
  setMountedDirectoryPath,
  setSearchQuery,
  toggleNode,
} from '../../../src/store/slices/fileTreeSlice';
import { fetchData } from '../../../src/api';

// Mock fetchData
jest.mock('../../../src/api', () => ({
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
      { 'dir1': [{ path: 'dir1/file1.md', status: ' ' }, { path: 'dir1/file2.txt', status: ' ' }] },
      { path: 'file3.md', status: ' ' },
    ];
    store.dispatch(fetchFileTree.fulfilled({ fileTree, mountedDirectoryPath: '/test' }, '', undefined));

    store.dispatch(setSearchQuery('file1'));
    expect(store.getState().fileTree.searchQuery).toEqual('file1');
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dir1': [{ path: 'dir1/file1.md', status: ' ' }] },
    ]);

    store.dispatch(setSearchQuery('file'));
    expect(store.getState().fileTree.searchQuery).toEqual('file');
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dir1': [{ path: 'dir1/file1.md', status: ' ' }, { path: 'dir1/file2.txt', status: ' ' }] },
      { path: 'file3.md', status: ' ' },
    ]);

    store.dispatch(setSearchQuery(''));
    expect(store.getState().fileTree.searchQuery).toEqual('');
    expect(store.getState().fileTree.filteredFileTree).toEqual(fileTree);

    // Test with no match
    store.dispatch(setSearchQuery('nomatch'));
    expect(store.getState().fileTree.searchQuery).toEqual('nomatch');
    expect(store.getState().fileTree.filteredFileTree).toEqual([]);

    // Test case insensitivity
    store.dispatch(setSearchQuery('FILE1'));
    expect(store.getState().fileTree.searchQuery).toEqual('FILE1');
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dir1': [{ path: 'dir1/file1.md', status: ' ' }] },
    ]);

    // Test with nested directories
    const nestedFileTree = [
      { 'dirA': [{ 'dirB': [{ path: 'dirA/dirB/fileX.md', status: ' ' }] }] },
      { path: 'fileY.md', status: ' ' },
    ];
    store.dispatch(fetchFileTree.fulfilled({ fileTree: nestedFileTree, mountedDirectoryPath: '/test' }, '', undefined));
    store.dispatch(setSearchQuery('fileX'));
    expect(store.getState().fileTree.filteredFileTree).toEqual([
      { 'dirA': [{ 'dirB': [{ path: 'dirA/dirB/fileX.md', status: ' ' }] }] },
    ]);

    // Test with partial match in directory name (should not match)
    store.dispatch(setSearchQuery('dir'));
    expect(store.getState().fileTree.filteredFileTree).toEqual([]);

    // Test with empty fileTree
    store.dispatch(fetchFileTree.fulfilled({ fileTree: [], mountedDirectoryPath: '/test' }, '', undefined));
    store.dispatch(setSearchQuery('file'));
    expect(store.getState().fileTree.filteredFileTree).toEqual([]);
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
      { 'dir1': [{ path: 'dir1/file1.md', status: ' ' }, { 'dir2': [{ path: 'dir1/dir2/file2.md', status: ' ' }] }] },
      { path: 'file3.md', status: ' ' },
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
      const mockFileTree = [{ 'dir': [{ path: 'dir/file.md', status: ' ' }] }];
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
      const mockFileTree = [{ 'dir': [{ path: 'dir/file.md', status: ' ' }] }];
      const mockMountedPath = '/mock/path';
      localStorage.setItem(`mdts_expanded_nodes_${mockMountedPath}`, JSON.stringify(['dir']));
      (fetchData as jest.Mock).mockResolvedValueOnce({ fileTree: mockFileTree, mountedDirectoryPath: mockMountedPath });

      await store.dispatch(fetchFileTree());

      expect(store.getState().fileTree.expandedNodes).toEqual(['dir']);
    });

    it('should handle error when saving expanded nodes to local storage', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem = jest.fn(() => { throw new Error('localStorage setItem error'); });

      store.dispatch(setMountedDirectoryPath('/test/path'));
      store.dispatch(toggleNode('path/to/node'));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save expanded nodes to local storage', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it('should handle error when loading expanded nodes from local storage', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem = jest.fn(() => { throw new Error('localStorage getItem error'); });

      const mockFileTree = [{ 'dir': [{ path: 'dir/file.md', status: ' ' }] }];
      const mockMountedPath = '/mock/path';
      (fetchData as jest.Mock).mockResolvedValueOnce({ fileTree: mockFileTree, mountedDirectoryPath: mockMountedPath });

      await store.dispatch(fetchFileTree());

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load expanded nodes from local storage', expect.any(Error));
      expect(store.getState().fileTree.expandedNodes).toEqual([]);
      consoleErrorSpy.mockRestore();
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
      { 'dir1': [{ path: 'dir1/fileA.md', status: ' ' }, { path: 'dir1/fileB.txt', status: ' ' }] },
      { 'dir2': [{ path: 'dir2/fileC.md', status: ' ' }] },
      { path: 'root/fileD.md', status: ' ' },
    ];

    it('should return top-level items when targetPath is empty', () => {
      const selected = selectFilteredFileTree(fullFileTree, '');
      expect(selected).toEqual([
        { 'dir1': [{ path: 'dir1/fileA.md', status: ' ' }, { path: 'dir1/fileB.txt', status: ' ' }] },
        { 'dir2': [{ path: 'dir2/fileC.md', status: ' ' }] },
        { path: 'fileD.md', status: ' ' },
      ]);
    });

    it('should return children of a specified directory', () => {
      const selected = selectFilteredFileTree(fullFileTree, 'dir1');
      expect(selected).toEqual([{ path: 'fileA.md', status: ' ' }, { path: 'fileB.txt', status: ' ' }]);
    });

    it('should return children of a nested directory', () => {
      const nestedFileTree = [
        { 'dirA': [{ 'dirB': [{ path: 'dirA/dirB/fileX.md', status: ' ' }, { path: 'dirA/dirB/fileY.txt', status: ' ' }] }] },
      ];
      const selected = selectFilteredFileTree(nestedFileTree, 'dirA/dirB');
      expect(selected).toEqual([{ path: 'fileX.md', status: ' ' }, { path: 'fileY.txt', status: ' ' }]);
    });

    it('should return empty array for non-existent path', () => {
      const selected = selectFilteredFileTree(fullFileTree, 'nonexistent/path');
      expect(selected).toEqual([]);
    });

    it('should return empty array for a file path', () => {
      const selected = selectFilteredFileTree(fullFileTree, 'root/fileD.md');
      expect(selected).toEqual([]);
    });

    it('should handle deeply nested directories', () => {
      const deeplyNestedFileTree = [
        { 'a': [{ 'b': [{ 'c': [{ path: 'a/b/c/d.md', status: ' ' }] }] }] },
      ];
      const selected = selectFilteredFileTree(deeplyNestedFileTree, 'a/b/c');
      expect(selected).toEqual([{ path: 'd.md', status: ' ' }]);
    });

    it('should handle empty file tree', () => {
      const selected = selectFilteredFileTree([], 'some/path');
      expect(selected).toEqual([]);
    });

    it('should handle root path with empty file tree', () => {
      const selected = selectFilteredFileTree([], '');
      expect(selected).toEqual([]);
    });

    it('should handle file tree with only files at root', () => {
      const fileOnlyTree = [{ path: 'file1.md', status: ' ' }, { path: 'file2.txt', status: ' ' }];
      const selected = selectFilteredFileTree(fileOnlyTree, '');
      expect(selected).toEqual([{ path: 'file1.md', status: ' ' }, { path: 'file2.txt', status: ' ' }]);
    });

    it('should handle file tree with mixed files and directories at root', () => {
      const mixedTree = [
        { 'dir1': [{ path: 'dir1/fileA.md', status: ' ' }] },
        { path: 'fileB.md', status: ' ' },
      ];
      const selected = selectFilteredFileTree(mixedTree, '');
      expect(selected).toEqual([
        { 'dir1': [{ path: 'dir1/fileA.md', status: ' ' }] },
        { path: 'fileB.md', status: ' ' },
      ]);
    });

    it('should handle targetPath that is a direct child of a root directory', () => {
      const tree = [
        { 'root': [{ path: 'root/file1.md', status: ' ' }, { 'root/nested': [{ path: 'root/nested/file2.md', status: ' ' }] }] },
      ];
      const selected = selectFilteredFileTree(tree, 'root');
      expect(selected).toEqual([{ path: 'file1.md', status: ' ' }, { 'nested': [{ path: 'root/nested/file2.md', status: ' ' }] }]);
    });

    it('should handle targetPath that is a direct child of a nested directory', () => {
      const tree = [
        { 'root': [{ path: 'root/file1.md', status: ' ' }, { 'nested': [{ path: 'root/nested/file2.md', status: ' ' }] }] },
      ];
      const selected = selectFilteredFileTree(tree, 'root/nested');
      expect(selected).toEqual([{ path: 'file2.md', status: ' ' }]);
    });
  });
});
