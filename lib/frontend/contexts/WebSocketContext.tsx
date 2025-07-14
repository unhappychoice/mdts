import React, { createContext, useContext } from 'react';

interface WebSocketContextType {
  refresh: boolean;
  refreshTree: boolean;
  changedFilePath: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  refresh: boolean;
  refreshTree: boolean;
  changedFilePath: string | null;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, refresh, refreshTree, changedFilePath }) => {
  return (
    <WebSocketContext.Provider value={{ refresh, refreshTree, changedFilePath }}>
      {children}
    </WebSocketContext.Provider>
  );
};
