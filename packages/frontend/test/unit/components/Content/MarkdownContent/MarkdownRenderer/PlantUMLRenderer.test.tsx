import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import PlantUMLRenderer from '../../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/PlantUMLRenderer';

const mockStore = configureStore([thunk]);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('PlantUMLRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cached SVG if available', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    const svg = '<svg><text>Test SVG</text></svg>';
    
    // Calculate the actual hash for the diagram
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedHash = Math.abs(hash).toString(36);
    
    const store = mockStore({
      plantUML: {
        svgCache: { [expectedHash]: svg },
        loading: { [expectedHash]: false },
        errors: { [expectedHash]: null },
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(screen.getByText('Test SVG')).toBeInTheDocument();
  });

  it('should show loading state while generating SVG', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    
    // Calculate the actual hash for the diagram
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedHash = Math.abs(hash).toString(36);
    
    const store = mockStore({
      plantUML: {
        svgCache: {},
        loading: { [expectedHash]: true },
        errors: { [expectedHash]: null },
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(screen.getByText('Loading PlantUML diagram...')).toBeInTheDocument();
  });

  it('should show error state when generation fails', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    const errorMessage = 'Failed to render PlantUML diagram';
    
    // Calculate the actual hash for the diagram
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedHash = Math.abs(hash).toString(36);
    
    const store = mockStore({
      plantUML: {
        svgCache: {},
        loading: { [expectedHash]: false },
        errors: { [expectedHash]: errorMessage },
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(screen.getByText('PlantUML Error:')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(/A --> B/)).toBeInTheDocument();
  });

  it('should dispatch generatePlantUMLSvg when SVG not cached and not loading', async () => {
    const chart = '@startuml\nA --> B\n@enduml';
    
    const store = mockStore({
      plantUML: {
        svgCache: {},
        loading: {},
        errors: {},
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should render raw chart content when no SVG available', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    
    const store = mockStore({
      plantUML: {
        svgCache: {},
        loading: {},
        errors: {},
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(screen.getByText(/A --> B/)).toBeInTheDocument();
  });

  it('should not dispatch action if SVG already cached', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    const svg = '<svg><text>Cached SVG</text></svg>';
    
    // Calculate the actual hash for the diagram
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedHash = Math.abs(hash).toString(36);
    
    const store = mockStore({
      plantUML: {
        svgCache: { [expectedHash]: svg },
        loading: { [expectedHash]: false },
        errors: { [expectedHash]: null },
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch action if already loading', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    
    // Calculate the actual hash for the diagram
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedHash = Math.abs(hash).toString(36);
    
    const store = mockStore({
      plantUML: {
        svgCache: {},
        loading: { [expectedHash]: true },
        errors: { [expectedHash]: null },
      },
    });

    render(
      <Provider store={store}>
        <PlantUMLRenderer chart={chart} />
      </Provider>
    );

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});