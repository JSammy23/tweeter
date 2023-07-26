import React, { createContext, useState } from 'react';

export const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
    const [activeThread, setActiveThread] = useState(null);

    const contextValue = {
        activeThread,
        setActiveThread,
    };

  return (
    <ThreadContext.Provider value={contextValue} >
        {children}
    </ThreadContext.Provider>
  );
};



