import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [activeFilter, setActiveFilter] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [viewedUser, setViewedUser] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    
    const contextValue = {
        activeFilter,
        setActiveFilter,
        viewedUser,
        setViewedUser,
        isUserLoaded,
        setIsUserLoaded,
        currentUser,
        setCurrentUser,
    }

    return (
        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>
    );
};