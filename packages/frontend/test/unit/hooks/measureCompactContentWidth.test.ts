import {
  COMPACT_CONTENT_WIDTH,
  measureCompactContentWidth,
} from '../../../src/hooks/measureCompactContentWidth';

const setLayout = (element: HTMLElement, clientWidth: number, scrollWidth: number) => {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: clientWidth });
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: scrollWidth });
};

describe('measureCompactContentWidth', () => {
  let parent: HTMLDivElement;
  let container: HTMLDivElement;

  beforeEach(() => {
    parent = document.createElement('div');
    container = document.createElement('div');
    parent.appendChild(container);
    document.body.appendChild(parent);

    jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      if (element === container) {
        return { paddingLeft: '32px', paddingRight: '32px' } as CSSStyleDeclaration;
      }
      return { paddingLeft: '0px', paddingRight: '0px' } as CSSStyleDeclaration;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('keeps compact width when there is no overflowing content', () => {
    setLayout(parent, 1600, 1600);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    expect(measureCompactContentWidth(container)).toBe(COMPACT_CONTENT_WIDTH);
  });

  test('expands to fit a wide table before using a scrollbar', () => {
    setLayout(parent, 1600, 1600);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    setLayout(tableWrapper, 736, 1200);
    container.appendChild(tableWrapper);

    expect(measureCompactContentWidth(container)).toBe(1268);
  });

  test('caps expansion at the available parent width', () => {
    setLayout(parent, 1400, 1400);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    setLayout(tableWrapper, 736, 2000);
    container.appendChild(tableWrapper);

    expect(measureCompactContentWidth(container)).toBe(1400);
  });

  test('expands for wide code blocks', () => {
    setLayout(parent, 1800, 1800);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    const pre = document.createElement('pre');
    setLayout(pre, 736, 1500);
    container.appendChild(pre);

    expect(measureCompactContentWidth(container)).toBe(1568);
  });

  test('uses the widest overflowing host', () => {
    setLayout(parent, 2000, 2000);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    setLayout(tableWrapper, 736, 900);
    const pre = document.createElement('pre');
    setLayout(pre, 736, 1100);
    container.appendChild(tableWrapper);
    container.appendChild(pre);

    expect(measureCompactContentWidth(container)).toBe(1168);
  });

  test('does not shrink below compact width when the parent is narrower', () => {
    setLayout(parent, 600, 600);
    setLayout(container, COMPACT_CONTENT_WIDTH, COMPACT_CONTENT_WIDTH);

    expect(measureCompactContentWidth(container)).toBe(COMPACT_CONTENT_WIDTH);
  });
});
