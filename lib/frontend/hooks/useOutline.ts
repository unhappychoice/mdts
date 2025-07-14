import { useState, useEffect } from 'react';
import { fetchData } from '../api';

export type OutlineItem = {
  id: string;
  text: string;
  level: number;
};
import { useWebSocket } from './useWebSocket';

export const useOutline = (path: string) => {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  useEffect(() => {
    if (!path) {
      setOutline([]);
      setLoading(false);
      return;
    }
    if (event && (event.type !== 'reload-content')) return

    const getOutline = async () => {
      try {
        if (!event) setLoading(true);
        const data = await fetchData<OutlineItem[]>(`/api/outline?filePath=${encodeURIComponent(path)}`, 'json');
        setOutline(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getOutline();
  }, [path, event]);

  return { outline, loading, error };
};
