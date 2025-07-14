import { useEffect, useState } from 'react';
import { fetchData } from '../../api';
import { useWebSocket } from '../useWebSocket';

export const useContent = (path: string) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  const getContent = async () => {
    try {
      const data = await fetchData<string>(`/api/markdown/${path}`, 'text');
      setContent(data || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!path) {
      setContent('');
      setLoading(false);
      return;
    }

    setLoading(true);
    getContent();
  }, [path]);

  useEffect(() => {
    if (event && event.type === 'reload-content' && path) {
      getContent();
    }
  }, [event]);

  return { content, loading, error };
};
