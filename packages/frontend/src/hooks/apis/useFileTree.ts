import { useEffect, useState } from 'react';
import { fetchData } from '../../api';
import { useWebSocket } from '../useWebSocket';

interface FileTreeItem {
  [key: string]: (FileTreeItem | string)[];
}

export const useFileTree = (): { fileTree: (FileTreeItem | string)[], loading: boolean, error: string | null } => {
  const [fileTree, setFileTree] = useState<FileTreeItem[] | string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const event = useWebSocket();

  const getFileTree = async () => {
    try {
      const data = await fetchData<FileTreeItem[]>('/api/filetree', 'json');
      setFileTree(data || []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getFileTree();
  }, []);

  useEffect(() => {
    if (event?.type === 'reload-tree') {
      getFileTree();
    }
  }, [event]);

  return { fileTree, loading, error  };
};
