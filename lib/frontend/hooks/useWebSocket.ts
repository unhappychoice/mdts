import { useEffect, useState } from 'react';

export const useWebSocket = () => {
  const [refresh, setRefresh] = useState(false);
  const [refreshTree, setRefreshTree] = useState(false);
  const [changedFilePath, setChangedFilePath] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'reload') {
        setChangedFilePath(message.filePath);
        setRefresh((prev) => !prev);
      } else if (message.type === 'reload-tree') {
        setRefreshTree((prev) => !prev);
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  return { refresh, refreshTree, changedFilePath };
};
