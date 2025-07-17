import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { FileTreeProvider } from './contexts/FileTreeContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <FileTreeProvider>
        <App />
      </FileTreeProvider>
    </Provider>
  </React.StrictMode>
);
