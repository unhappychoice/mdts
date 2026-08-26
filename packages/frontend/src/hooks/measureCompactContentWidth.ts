export const COMPACT_CONTENT_WIDTH = 800;
export const OVERFLOW_HOST_SELECTOR = '.table-wrapper, pre, .katex-display';
export const OVERFLOW_SLACK_PX = 4;

const WIDTH_EPSILON = 1;

const parsePaddingPx = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getHorizontalPadding = (element: HTMLElement): number => {
  const { paddingLeft, paddingRight } = window.getComputedStyle(element);
  return parsePaddingPx(paddingLeft) + parsePaddingPx(paddingRight);
};

const measureIntrinsicWidth = (element: HTMLElement): number => {
  const previousWidth = element.style.width;
  const previousMinWidth = element.style.minWidth;
  element.style.width = 'max-content';
  element.style.minWidth = 'max-content';
  const width = element.scrollWidth;
  element.style.width = previousWidth;
  element.style.minWidth = previousMinWidth;
  return width;
};

export const measureCompactContentWidth = (container: HTMLElement): number => {
  const available = container.parentElement?.clientWidth ?? COMPACT_CONTENT_WIDTH;
  const paddingX = getHorizontalPadding(container);
  let required = COMPACT_CONTENT_WIDTH;

  container.querySelectorAll<HTMLElement>(OVERFLOW_HOST_SELECTOR).forEach((element) => {
    required = Math.max(required, measureIntrinsicWidth(element) + paddingX + OVERFLOW_SLACK_PX);
  });

  const cap = Math.max(available, COMPACT_CONTENT_WIDTH);
  return Math.min(Math.max(required, COMPACT_CONTENT_WIDTH), cap);
};

export const isSameContentWidth = (left: number, right: number): boolean => (
  Math.abs(left - right) < WIDTH_EPSILON
);
