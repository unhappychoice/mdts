import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../src/store/store';

const mockStore = configureStore<RootState, ThunkDispatch<RootState, undefined, AnyAction>>([thunk]);

export const createMockStore = (
  initialState: Partial<RootState> = {},
): MockStoreEnhanced<RootState, ThunkDispatch<RootState, undefined, AnyAction>> => {
  const defaultState: RootState = {
    appSetting: {
      darkMode: 'dark',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: true,
    },
    fileTree: {
      fileTree: [
        { path: 'test.md', status: ' ' },
        { folder: [{ path: 'folder/subfile.md', status: 'M' }] },
      ],
      filteredFileTree: [
        { path: 'test.md', status: ' ' },
        { folder: [{ path: 'folder/subfile.md', status: 'M' }] },
      ],
      loading: false,
      error: null,
      searchQuery: '',
    },
    content: {
      content: '',
      loading: false,
      error: null,
    },
    outline: {
      outline: [],
      loading: false,
      error: null,
    },
    history: {
      currentPath: null,
      isDirectory: false,
    },
    config: {
      fontFamily: 'Roboto',
      fontFamilyMonospace: 'monospace',
      fontSize: 14,
    },
  };

  const state: RootState = {
    ...defaultState,
    ...initialState,
    appSetting: {
      ...defaultState.appSetting,
      ...(initialState.appSetting || {}),
    },
    fileTree: {
      ...defaultState.fileTree,
      ...(initialState.fileTree || {}),
    },
    content: {
      ...defaultState.content,
      ...(initialState.content || {}),
    },
    outline: {
      ...defaultState.outline,
      ...(initialState.outline || {}),
    },
    history: {
      ...defaultState.history,
      ...(initialState.history || {}),
    },
    config: {
      ...defaultState.config,
      ...(initialState.config || {}),
    },
  };

  return mockStore(state);
};