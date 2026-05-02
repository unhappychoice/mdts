import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MarkdownCode from '../../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MarkdownCode';

const mockStore = configureStore([]);
const hashDiagram = (diagram: string): string =>
  Math.abs(
    Array.from(diagram).reduce((hash, char) => {
      const nextHash = (hash << 5) - hash + char.charCodeAt(0);
      return nextHash & nextHash;
    }, 0),
  ).toString(36);

describe('MarkdownCode', () => {
  let store: unknown;

  beforeEach(() => {
    store = mockStore({
      config: {
        fontFamilyMonospace: 'monospace',
        syntaxHighlighterTheme: 'github',
      },
    });
  });

  it('should render inline code correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MarkdownCode inline>{'console.log("hello");'}</MarkdownCode>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render code block correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MarkdownCode className="language-js">{'console.log("hello");'}</MarkdownCode>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render mermaid chart correctly', async () => {
    let asFragment: unknown;
    await act(async () => {
      ({ asFragment } = render(
        <Provider store={store}>
          <MarkdownCode className="language-mermaid">{'graph TD; A-->B'}</MarkdownCode>
        </Provider>
      ));
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render PlantUML renderer for puml code blocks', () => {
    const chart = '@startuml\nA --> B\n@enduml';
    const hash = hashDiagram(chart);
    store = mockStore({
      config: {
        fontFamilyMonospace: 'monospace',
        syntaxHighlighterTheme: 'github',
      },
      plantUML: {
        svgCache: {},
        loading: { [hash]: true },
        errors: { [hash]: null },
      },
    });

    render(
      <Provider store={store}>
        <MarkdownCode className="language-puml">{chart}</MarkdownCode>
      </Provider>
    );

    expect(screen.getByText('Loading PlantUML diagram...')).toBeInTheDocument();
  });
});
