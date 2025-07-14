import { useState, useEffect } from 'react';
import { fetchData } from '../api';
import { useWebSocket } from './useWebSocket';

export const useContent = (path: string) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  useEffect(() => {
    if (!path) {
      setContent('');
      setLoading(false);
      return;
    }

    if (event && (event.type !== 'reload-content')) return

    const getContent = async () => {
      try {
        if (!event) setLoading(true);
        const data = await fetchData<string>(`/${path}`, 'text');
        setContent(data || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getContent();
  }, [path, event]);

  return { content, loading, error };
};
