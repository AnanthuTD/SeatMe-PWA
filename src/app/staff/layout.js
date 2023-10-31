import React from "react";
import { LoadingProvider } from "@/context/auth";

const RootLayout = ({ children }) => {
	const authApi = "/api/staff";

	return <LoadingProvider api={authApi}>{children}</LoadingProvider>;
};

export default RootLayout;
