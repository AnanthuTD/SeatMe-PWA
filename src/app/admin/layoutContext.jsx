'use client'

import React, { createContext, useContext, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, theme, Button } from 'antd';

import Menu from './menu';

const { Header, Content, Footer, Sider } = Layout;

// Create a context to manage the layout theme
const LayoutContext = createContext();

// Create a custom hook to access the layout context
const useLayoutContext = () => {
    return useContext(LayoutContext);
};

const LayoutContextProvider = ({ children }) => {

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '250px'
                }}
                trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer, // Use the context state for background color
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export { LayoutContextProvider, useLayoutContext };
