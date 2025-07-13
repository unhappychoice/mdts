export interface OutlineItem {
  level: number;
  content: string;
  id: string;
}

const fetchData = async <T>(url: string, responseType: 'json' | 'text'): Promise<T | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (responseType === 'json') {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
};

export const fetchFileTree = async () => {
  const data = await fetchData<any>('/api/filetree', 'json');
  return data || [];
};

export const fetchContent = async (path: string) => {
  const data = await fetchData<string>(`/content/${path}`, 'text');
  return data || "";
};

export const fetchOutline = async (filePath: string): Promise<OutlineItem[]> => {
  const data = await fetchData<OutlineItem[]>(`/api/outline?filePath=${encodeURIComponent(filePath)}`, 'json');
  return data || [];
};
