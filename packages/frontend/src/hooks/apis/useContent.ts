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
      const url = path ? `/api/markdown/${path}` : '/api/markdown/mdts-welcome-markdown.md';
      const data = await fetchData<string>(url, 'text');

      setContent(data || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
