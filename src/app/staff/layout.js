import React from "react";
import { AuthProvider } from "@/context/auth";

const RootLayout = ({ children }) => {
	const authApi = "/api/staff";

	return <AuthProvider api={authApi}>{children}</AuthProvider>;
};

export default RootLayout;
