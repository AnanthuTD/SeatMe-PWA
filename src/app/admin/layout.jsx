import React from 'react';
import theme from './themeConfig';
import { ConfigProvider } from 'antd';
import Layout from './layoutProvider';
import { MenuProvider } from './menuContext';

const RootLayout = ({ children }) => {
    return (
        <ConfigProvider theme={theme}>
            <MenuProvider>
                <Layout>{children}</Layout>
            </MenuProvider>
        </ConfigProvider>)
};

export default RootLayout;
