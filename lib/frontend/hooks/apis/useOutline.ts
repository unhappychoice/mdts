import { useEffect, useState } from 'react';
import { fetchData } from '../../api';
import { useWebSocket } from '../useWebSocket';

export type OutlineItem = {
  id: string;
  text: string;
  level: number;
};

export const useOutline = (path: string) => {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  const getOutline = async () => {
    try {
      const url = path
        ? `/api/outline?filePath=${encodeURIComponent(path)}`
        : '/api/outline?filePath=mdts-welcome-markdown.md';
      const data = await fetchData<OutlineItem[]>(url, 'json');
      setOutline(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (path !== decodeURIComponent(window.location.pathname.substring(1))) return;

    setLoading(true);
    getOutline();
  }, [path]);

  useEffect(() => {
    if (event && event.type === 'reload-content' && path) {
      getOutline();
    }
  }, [event]);

  return { outline, loading, error };
};
