import { useState, useEffect } from 'react';
import { fetchData } from '../api';
import { useWebSocket } from './useWebSocket';

export const useFileTree = () => {
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  useEffect(() => {
    if (event && event.type !== 'reload-tree') return

    const getFileTree = async () => {
      try {
        setLoading(true);
        const data = await fetchData<any[]>('/api/filetree', 'json');
        setFileTree(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getFileTree();
  }, [event]);

  return { fileTree, loading, error };
};
