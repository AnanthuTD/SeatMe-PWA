import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Script from "next/script";

import StyledComponentsRegistry from "@/lib/AntdRegistry";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Seating Arrangement",
};

import { AccountProvider } from "@/context/accountContext";

const RootLayout = ({ children }) => {
	return (
		<html lang="en">
			<Script
				async
				src="https://www.googletagmanager.com/gtag/js?id=G-4Z973J09EJ"
			></Script>
			<Script>
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-4Z973J09EJ');
        `}
			</Script>
			{/* <link rel="manifest" href="/manifest.json" /> */}
			<link rel="apple-touch-icon" href="/next.svg"></link>
			<meta name="theme-color" content="#fff" />
			<body className={[inter.className, "h-screen"].join(" ")}>
				<StyledComponentsRegistry>
					<AccountProvider>
						{children} <Analytics />
					</AccountProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
};

export default RootLayout;
