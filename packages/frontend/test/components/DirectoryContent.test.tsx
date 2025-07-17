import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DirectoryContent from '../../src/components/DirectoryContent';

const mockStore = configureStore([]);

describe('DirectoryContent', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      fileTree: {
        fileTree: [{ name: 'file1.md', path: '/file1.md', type: 'file' }],
        filteredFileTree: [{ name: 'file1.md', path: '/file1.md', type: 'file' }],
        loading: false,
        error: null,
        searchQuery: '',
      },
    });
  });

  test('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <DirectoryContent selectedDirectoryPath="" onFileSelect={() => {}} onDirectorySelect={() => {}} contentMode="fixed" />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
