import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import configReducer, { fetchConfig, saveConfigToBackend, ConfigState } from '../../../src/store/slices/configSlice';
import * as api from '../../../src/api'; // Import the actual api module

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

describe('configSlice', () => {
  let store: ReturnType<typeof configureStore> & {
    dispatch: ThunkDispatch<{ config: ConfigState }, undefined, AnyAction>;
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock global fetch for saveConfigToBackend
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}), // Mock json method for consistency
    } as Response);

    store = configureStore({
      reducer: {
        config: configReducer,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the initial state', () => {
    expect(store.getState().config).toEqual({
      fontFamily: 'Roboto',
      fontFamilyMonospace: 'monospace',
      fontSize: 14,
    });
  });

  it('should fetch config successfully', async () => {
    (api.fetchData as jest.Mock).mockResolvedValueOnce({ fontFamily: 'TestFont', fontFamilyMonospace: 'TestMono', fontSize: 16 });
    const action = await store.dispatch(fetchConfig());
    expect(action.type).toEqual('config/fetchConfig/fulfilled');
    expect(store.getState().config.fontFamily).toEqual('TestFont');
    expect(store.getState().config.fontFamilyMonospace).toEqual('TestMono');
    expect(store.getState().config.fontSize).toEqual(16);
  });

  it('should save config to backend successfully and re-fetch', async () => {
    // Mock fetchData for the re-fetch after saving
    (api.fetchData as jest.Mock).mockResolvedValueOnce({
      fontFamily: 'TestFontAfterSave',
      fontFamilyMonospace: 'TestMonoAfterSave',
      fontSize: 18,
    });

    const saveAction = await store.dispatch(
      saveConfigToBackend({ fontFamily: 'SavedFont', fontFamilyMonospace: 'SavedMono', fontSize: 18 }),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/config',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ fontFamily: 'SavedFont', fontFamilyMonospace: 'SavedMono', fontSize: 18 }),
      }),
    );
    expect(saveAction.type).toEqual('config/saveConfigToBackend/fulfilled');

    // The fetchConfig thunk is dispatched inside saveConfigToBackend, and its fulfilled action will update the state.
    // We need to wait for this to complete.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.getState().config.fontFamily).toEqual('TestFontAfterSave');
    expect(store.getState().config.fontSize).toEqual(18);
  });
});