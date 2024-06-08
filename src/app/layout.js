import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StyledComponentsRegistry from "@/lib/AntdRegistry";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "SeatMe",
	description: "Examination Seating Arrangement",
	manifest: "/manifest.json",
	keywords: [
		"MES College Marampally",
		"SeatMe",
		"SeatMe MES",
		"MES SeatMe",
		"Seating arrangement",
		"Seating arrangement MES",
		"Classroom management",
		"Student seating",
		"Academic seating",
		"College seating",
		"Seat allocation",
		"Seating plan",
		"Educational technology",
		"Classroom organization",
		"Campus seating",
		"Student management system",
		"Classroom layout",
		"Seat assignment",
		"Digital seating chart",
		"College administration",
		"Education technology solution",
		"Academic scheduling",
		"Student seating solution",
	],
	icons: [
		{ rel: "apple-touch-icon", href: "/seatme.svg" },
		{ rel: "icon", href: "/seatme.svg", type: "image/svg+xml" },
	],
	orientation: "portrait",
	lang: "en-US",
	categories: ["Education", "Productivity"],
	developers: [
		{
			name: "Ananthu TD",
			email: "ananthutd@gmai.com",
			url: "https://github.com/AnanthuTD",
		},
	],
};


const RootLayout = ({ children }) => {
	return (
		<html lang="en">
			<Script src="https://www.googletagmanager.com/gtag/js?id=G-4Z973J09EJ" />
			<Script id="google-analytics">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-4Z973J09EJ');
        `}
			</Script>
			{/* <link rel="manifest" href="/manifest.json" /> */}
			<link rel="apple-touch-icon" href="/seatme.svg"></link>
			<link rel="icon" href="/seatme.svg" />
			<meta name="theme-color" content="#fff" />
			<body className={[inter.className, "h-screen"].join(" ")}>
				<StyledComponentsRegistry>
						{children} <Analytics />
				</StyledComponentsRegistry>
				<SpeedInsights />
			</body>
		</html>
	);
};

export default RootLayout;
