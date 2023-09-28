import React from 'react';
import theme from './themeConfig';
import { ConfigProvider } from 'antd';
import Layout from './layoutProvider';

const RootLayout = ({ children }) => {
    return (
        <ConfigProvider theme={theme}>
            <Layout>{children}</Layout>
        </ConfigProvider>)  
};

export default RootLayout;
