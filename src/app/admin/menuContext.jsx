'use client';
import { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(null);

    const setMenu = (menuName) => {
        setActiveMenu(menuName);
    };

    return (
        <MenuContext.Provider value={{ activeMenu, setMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenuContext must be used within a MenuProvider');
    }
    return context;
};
