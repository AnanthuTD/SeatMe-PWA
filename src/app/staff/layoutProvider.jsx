"use client";

import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme } from "antd";
import Menu from "./(menu)/menu";
import SettingsButton from "./components/settings/settings";
const { Header, Sider, Content } = Layout;

const App = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const [layoutRendered, setLayoutRendered] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	useEffect(() => {
		setLayoutRendered(true);
	}, []);

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
				<Header
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: 0,
						background: colorBgContainer,
					}}
				>
					<div>
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
					</div>
					<div style={{ marginInline: "1rem" }}>
						<SettingsButton />
					</div>
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
					{layoutRendered && children}
				</Content>
			</Layout>
		</Layout>
	);
};
export default App;
