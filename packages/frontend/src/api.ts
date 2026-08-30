export const fetchData = async <T>(
  url: string,
  responseType: 'json' | 'text',
  signal?: AbortSignal,
): Promise<T | null> => {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (responseType === 'json') {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};
