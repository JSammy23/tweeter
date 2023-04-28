import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [activeFilter, setActiveFilter] = useState(null);



    return (
        <AppContext.Provider value={{ activeFilter, setActiveFilter }} >
            {children}
        </AppContext.Provider>
    );
};