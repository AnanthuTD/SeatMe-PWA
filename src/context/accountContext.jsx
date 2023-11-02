"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem("user")) || null);
	}, []);

	return (
		<AccountContext.Provider value={{ user, setUser }}>
			{children}
		</AccountContext.Provider>
	);
};

export const useAccount = () => {
	return useContext(AccountContext);
};
