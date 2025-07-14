import React from 'react';
import ReactDOM from 'react-dom/client';
import { FileTreeProvider } from './contexts/FileTreeContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FileTreeProvider>
      <App />
    </FileTreeProvider>
  </React.StrictMode>
);
