import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

import './index.css';

// Helper to save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.appSetting);
    localStorage.setItem('appSetting', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

// Subscribe to store changes and save appSetting state
store.subscribe(() => {
  saveState(store.getState());
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
