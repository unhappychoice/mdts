import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchContent } from '../store/slices/contentSlice';
import { fetchFileTree } from '../store/slices/fileTreeSlice';
import { fetchOutline } from '../store/slices/outlineSlice';

type Event = { type: 'reload-content' } | { type: 'reload-tree' };

export const useWebSocket = (currentPath: string | null): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const ws = new WebSocket(
      (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
        window.location.host
    );

    ws.onmessage = (event) => {
      const message: Event = JSON.parse(event.data);

      if (message.type === 'reload-content') {
        if (!currentPath) return;
        dispatch(fetchContent(currentPath));
        dispatch(fetchOutline(currentPath));
      } else if (message.type === 'reload-tree') {
        dispatch(fetchFileTree());
      }
    };

    return () => {
      ws.close();
    };
  }, [dispatch, currentPath]);
};
