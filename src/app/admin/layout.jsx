import React from "react";
import Layout from "./layoutProvider";
import { AuthProvider } from "@/context/auth";

const RootLayout = ({ children }) => {
	const authApi = "/api/admin";
	return (
		<AuthProvider api={authApi}>
			<Layout>{children}</Layout>
		</AuthProvider>
	);
};

export default RootLayout;
