import React from "react";
import theme from "./themeConfig";
import { ConfigProvider } from "antd";
import Layout from "./layoutProvider";
import { MenuProvider } from "./(menu)/menuContext";
import { LoadingProvider } from "@/context/auth";

const RootLayout = ({ children }) => {
	const authApi = "/api/admin";
	return (
		<ConfigProvider theme={theme}>
			<LoadingProvider api={authApi}>
				<MenuProvider>
					<Layout>{children}</Layout>
				</MenuProvider>
			</LoadingProvider>
		</ConfigProvider>
	);
};

export default RootLayout;
