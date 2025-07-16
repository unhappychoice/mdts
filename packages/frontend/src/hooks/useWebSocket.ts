import { useEffect, useState } from 'react';

type Event = { type: 'reload-content' } | { type: 'reload-tree' };

export const useWebSocket = (): Event | null => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setEvent(message);
      setTimeout(() => setEvent(null), 100);
    };

    return () => {
      ws.close();
    };
  }, []);

  return event;
};
