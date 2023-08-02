import React, { createContext, useState } from 'react';

export const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
    const [activeThread, setActiveThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [localReplyCount, setLocalReplyCount] = useState(activeThread?.replies || replies.length);

    const contextValue = {
        activeThread,
        setActiveThread,
        localReplyCount,
        setLocalReplyCount,
        replies,
        setReplies
    };

  return (
    <ThreadContext.Provider value={contextValue} >
        {children}
    </ThreadContext.Provider>
  );
};



