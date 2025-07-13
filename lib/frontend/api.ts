export const fetchFileTree = async () => {
  try {
    const response = await fetch('http://localhost:8521/filetree');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching file tree:", error);
    return [];
  }
};

export const fetchContent = async (path: string) => {
  try {
    const response = await fetch(`http://localhost:8521/content/${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error fetching content for ${path}:`, error);
    return "";
  }
};
