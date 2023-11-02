import React from "react";
import theme from "./themeConfig";
import { ConfigProvider } from "antd";
import Layout from "./layoutProvider";
// import { MenuProvider } from "./(menu)/menuContext";
import { AuthProvider } from "@/context/auth";

const RootLayout = ({ children }) => {
	const authApi = "/api/admin";
	return (
		<AuthProvider api={authApi}>
			<ConfigProvider theme={theme}>
				{/* <MenuProvider> */}
				<Layout>{children}</Layout>
				{/* </MenuProvider> */}
			</ConfigProvider>
		</AuthProvider>
	);
};

export default RootLayout;
