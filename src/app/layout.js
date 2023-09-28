import React from 'react';
import { Inter } from 'next/font/google';

import StyledComponentsRegistry from '../lib/AntdRegistry';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Seating Arrangement',
};

import { AccountProvider } from '@/context/accountContext';

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className={[inter.className, 'h-screen'].join(' ')}>
                <StyledComponentsRegistry>
                    <AccountProvider>{children}</AccountProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
};

export default RootLayout;
