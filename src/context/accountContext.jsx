'use client'

import Admin from '@/app/admin/page';
import { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <AccountContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    return useContext(AccountContext);
};
