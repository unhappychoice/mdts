import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import {
  COMPACT_CONTENT_WIDTH,
  isSameContentWidth,
  measureCompactContentWidth,
} from './measureCompactContentWidth';

interface CompactContentWidth {
  ref: RefObject<HTMLDivElement | null>;
  width: number;
}

const useCompactContentWidth = (enabled: boolean, observeKey: unknown): CompactContentWidth => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(COMPACT_CONTENT_WIDTH);

  useLayoutEffect(() => {
    if (!enabled) {
      setWidth(COMPACT_CONTENT_WIDTH);
      return;
    }

    const container = ref.current;
    if (!container) {
      return;
    }

    const apply = () => {
      const next = measureCompactContentWidth(container);
      setWidth((previous) => (isSameContentWidth(previous, next) ? previous : next));
    };

    apply();

    const parent = container.parentElement;
    const observers: Array<{ disconnect: () => void }> = [];

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(apply);
      if (parent) {
        resizeObserver.observe(parent);
      }
      observers.push(resizeObserver);
    }

    const mutationObserver = new MutationObserver(apply);
    mutationObserver.observe(container, { childList: true, subtree: true });
    observers.push(mutationObserver);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [enabled, observeKey]);

  return { ref, width };
};

export default useCompactContentWidth;
