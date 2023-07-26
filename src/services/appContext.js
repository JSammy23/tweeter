import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [activeFilter, setActiveFilter] = useState(null);
    const [viewedUser, setViewedUser] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [followingList, setFollowingList] = useState([]);
    

    const contextValue = {
        activeFilter,
        setActiveFilter,
        viewedUser,
        setViewedUser,
        isUserLoaded,
        setIsUserLoaded,
        currentUser,
        setCurrentUser,
        followingList,
        setFollowingList,
    }


    return (
        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>
    );
};