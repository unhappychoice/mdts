import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../../src/Layout';
import { toggleFileTree, toggleOutline } from '../../src/store/slices/appSettingSlice';
import { createMockStore } from '../utils';

const mockNavigate = jest.fn();
const mockUseIsMobile = jest.fn();

type AppHeaderMockProps = {
  handleFileSelect: (path: string) => void;
  onSettingsClick: () => void;
  onToggleFileTree: () => void;
  onToggleOutline: () => void;
};

type ContentMockProps = {
  onFileSelect: (path: string) => void;
  onDirectorySelect: (path: string) => void;
  scrollToId: string | null;
};

type FileTreeMockProps = {
  isOpen: boolean;
  onFileSelect: (path: string) => void;
  selectedFilePath: string | null;
};

type OutlineMockProps = {
  filePath: string | null;
  isOpen: boolean;
  onItemClick: (id: string) => void;
};

let mockAppHeaderProps: AppHeaderMockProps;
let mockContentProps: ContentMockProps;
let mockFileTreeProps: FileTreeMockProps;
let mockOutlineProps: OutlineMockProps;

function mockHandleHeaderFileSelect() {
  mockAppHeaderProps.handleFileSelect('docs/readme.md');
}

function mockHandleContentFileSelect() {
  mockContentProps.onFileSelect('content/file.md');
}

function mockHandleContentDirectorySelect() {
  mockContentProps.onDirectorySelect('guides');
}

function mockHandleTreeFileSelect() {
  mockFileTreeProps.onFileSelect('tree/file.md');
}

function mockHandleOutlineItemClick() {
  mockOutlineProps.onItemClick('heading-1');
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../src/hooks/useIsMobile', () => ({
  __esModule: true,
  default: () => mockUseIsMobile(),
}));

jest.mock('../../src/components/AppHeader', () => ({
  __esModule: true,
  default: (props: AppHeaderMockProps) => {
    mockAppHeaderProps = props;

    return (
      <div>
        <button onClick={mockHandleHeaderFileSelect}>header-file-select</button>
        <button onClick={props.onSettingsClick}>settings</button>
        <button aria-label="toggle file tree" onClick={props.onToggleFileTree}>toggle file tree</button>
        <button aria-label="toggle outline" onClick={props.onToggleOutline}>toggle outline</button>
      </div>
    );
  },
}));

jest.mock('../../src/components/Content/Content', () => ({
  __esModule: true,
  default: (props: ContentMockProps) => {
    mockContentProps = props;

    return (
      <div>
        <div data-testid="content-scroll-id">{props.scrollToId ?? 'null'}</div>
        <button onClick={mockHandleContentFileSelect}>content-file-select</button>
        <button onClick={mockHandleContentDirectorySelect}>content-directory-select</button>
      </div>
    );
  },
}));

jest.mock('../../src/components/LeftPane/FileTree', () => ({
  __esModule: true,
  default: (props: FileTreeMockProps) => {
    mockFileTreeProps = props;

    return (
      <div>
        <div data-testid="file-tree-open">{String(props.isOpen)}</div>
        <div data-testid="selected-file-path">{props.selectedFilePath ?? 'null'}</div>
        <button onClick={mockHandleTreeFileSelect}>tree-file-select</button>
      </div>
    );
  },
}));

jest.mock('../../src/components/RightPane/Outline', () => ({
  __esModule: true,
  default: (props: OutlineMockProps) => {
    mockOutlineProps = props;

    return (
      <div>
        <div data-testid="outline-file-path">{props.filePath ?? 'null'}</div>
        <div data-testid="outline-open">{String(props.isOpen)}</div>
        <button onClick={mockHandleOutlineItemClick}>outline-item-click</button>
      </div>
    );
  },
}));

describe('Layout', () => {
  const renderLayout = (
    initialState = {},
    onSettingsClick = jest.fn(),
  ) => {
    const store = createMockStore(initialState);
    store.dispatch = jest.fn();

    return {
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <Layout onSettingsClick={onSettingsClick} />
          </MemoryRouter>
        </Provider>
      ),
      onSettingsClick,
      store,
    };
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseIsMobile.mockReturnValue(false);
    document.documentElement.style.removeProperty('--markdown-font-family');
    document.documentElement.style.removeProperty('--markdown-monospace-font-family');
  });

  test('renders correctly', () => {
    const { asFragment } = renderLayout({
      history: { currentPath: 'docs/readme.md', isDirectory: false },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  test('navigates from child callbacks and applies font variables', () => {
    const onSettingsClick = jest.fn();

    renderLayout({
      config: {
        fontFamily: 'Fira Sans',
        fontFamilyMonospace: 'Fira Code',
      },
      history: { currentPath: 'docs/readme.md', isDirectory: false },
    }, onSettingsClick);

    fireEvent.click(screen.getByText('header-file-select'));
    fireEvent.click(screen.getByText('tree-file-select'));
    fireEvent.click(screen.getByText('content-directory-select'));
    fireEvent.click(screen.getByText('settings'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/docs/readme.md');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/tree/file.md');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/guides');
    expect(onSettingsClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('selected-file-path')).toHaveTextContent('docs/readme.md');
    expect(screen.getByTestId('outline-file-path')).toHaveTextContent('docs/readme.md');
    expect(document.documentElement.style.getPropertyValue('--markdown-font-family')).toBe('Fira Sans');
    expect(document.documentElement.style.getPropertyValue('--markdown-monospace-font-family')).toBe('Fira Code');
  });

  test('passes null outline file path for directories and updates scroll target', () => {
    renderLayout({
      history: { currentPath: 'docs', isDirectory: true },
    });

    expect(screen.getByTestId('outline-file-path')).toHaveTextContent('null');
    expect(screen.getByTestId('content-scroll-id')).toHaveTextContent('null');

    fireEvent.click(screen.getByText('outline-item-click'));

    expect(screen.getByTestId('content-scroll-id')).toHaveTextContent('heading-1');
  });

  test('dispatches desktop toggle actions', () => {
    const { store } = renderLayout();

    fireEvent.click(screen.getByLabelText('toggle file tree'));
    fireEvent.click(screen.getByLabelText('toggle outline'));

    expect(store.dispatch).toHaveBeenNthCalledWith(1, toggleFileTree());
    expect(store.dispatch).toHaveBeenNthCalledWith(2, toggleOutline());
    expect(screen.getByTestId('file-tree-open')).toHaveTextContent('true');
    expect(screen.getByTestId('outline-open')).toHaveTextContent('true');
  });

  test('uses local mobile panel state and resets it after returning from desktop', () => {
    mockUseIsMobile.mockReturnValue(true);

    const { rerender, store } = renderLayout({
      appSetting: {
        fileTreeOpen: false,
        outlineOpen: false,
      },
    });

    fireEvent.click(screen.getByLabelText('toggle file tree'));

    expect(screen.getByTestId('file-tree-open')).toHaveTextContent('true');
    expect(screen.getByTestId('outline-open')).toHaveTextContent('false');

    fireEvent.click(screen.getByLabelText('toggle outline'));

    expect(screen.getByTestId('file-tree-open')).toHaveTextContent('false');
    expect(screen.getByTestId('outline-open')).toHaveTextContent('true');
    expect(store.dispatch).not.toHaveBeenCalled();

    mockUseIsMobile.mockReturnValue(false);
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Layout onSettingsClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    mockUseIsMobile.mockReturnValue(true);
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Layout onSettingsClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('file-tree-open')).toHaveTextContent('false');
    expect(screen.getByTestId('outline-open')).toHaveTextContent('false');
  });
});
