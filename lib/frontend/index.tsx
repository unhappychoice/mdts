import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css'; // This will be our Tailwind CSS entry point
import Layout from './components/Layout';
import FileTree from './components/FileTree';
import Content from './components/Content';

const App = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  useEffect(() => {
    // Function to get file path from URL
    const getFilePathFromUrl = () => {
      const path = window.location.pathname.substring(1); // Remove leading slash
      return path === '' ? null : decodeURIComponent(path); // If path is empty, no file is selected
    };

    // Set initial file path from URL
    setSelectedFilePath(getFilePathFromUrl());

    // Handle browser back/forward buttons
    const handlePopState = () => {
      setSelectedFilePath(getFilePathFromUrl());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleFileSelect = (path: string) => {
    setSelectedFilePath(path);
    // Update browser history
    window.history.pushState({ path: path }, '', `/${path}`);
  };

  return (
    <Layout>
      <FileTree onFileSelect={handleFileSelect} />
      <Content selectedFilePath={selectedFilePath} />
    </Layout>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
