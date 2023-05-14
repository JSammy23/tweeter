import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [activeFilter, setActiveFilter] = useState(null);
    const [viewedUser, setViewedUser] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [user, setUser] = useState(null);

    const contextValue = {
        activeFilter,
        setActiveFilter,
        viewedUser,
        setViewedUser,
        isUserLoaded,
        setIsUserLoaded,
        user,
        setUser,
    }


    return (
        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>
    );
};