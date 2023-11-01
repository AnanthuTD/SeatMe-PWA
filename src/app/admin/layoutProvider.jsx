"use client";

import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme } from "antd";
import Menu from "./(menu)/menu";
import SettingsButton from "./components/settings";
const { Header, Sider, Content } = Layout;

const App = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout className="h-screen">
			<Sider
				className="flex-grow overflow-auto"
				trigger={null}
				collapsible
				collapsed={collapsed}
				theme="light"
			>
				<div className="demo-logo-vertical">Logo</div>
				<Menu />
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={
							collapsed ? (
								<MenuUnfoldOutlined />
							) : (
								<MenuFoldOutlined />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
					<SettingsButton />
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						overflow: "auto",
						padding: "0 16px",
						border: "1px solid rgba(140, 140, 140, 0.35)",
					}}
					className="flex-grow"
					id="scrollableDiv"
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};
export default App;
