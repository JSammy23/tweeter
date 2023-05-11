import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [activeFilter, setActiveFilter] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    const contextValue = {
        activeFilter,
        setActiveFilter,
        userInfo,
        setUserInfo,
        isUserLoaded,
        setIsUserLoaded,
    }


    return (
        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>
    );
};