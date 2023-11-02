"use client";

import { createContext, useContext, useState } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))||null);

	return (
		<AccountContext.Provider value={{ user, setUser }}>
			{children}
		</AccountContext.Provider>
	);
};

export const useAccount = () => {
	return useContext(AccountContext);
};
