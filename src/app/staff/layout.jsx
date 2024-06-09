import React from "react";
import Layout from "./layoutProvider";

const RootLayout = ({ children }) => {
	return <Layout>{children}</Layout>;
};

export default RootLayout;
