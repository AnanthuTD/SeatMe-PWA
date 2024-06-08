"use client";

import React, { useState, useEffect } from "react";
import { Layout, theme } from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";
import Image from "next/image";
import InstructionModel from "./instructionModel";

const { Header, Content } = Layout;

const Container = ({ children }) => {
	const [showInstruction, setShowInstruction] = useState(false);
	const [layoutRendered, setLayoutRendered] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	useEffect(() => {
		setLayoutRendered(true);
	}, []);

	useEffect(() => {
		// Apply blur effect after layout has been rendered
		if (layoutRendered) {
			const backgroundElement = document.getElementById("backgroundImage");
			if (backgroundElement) {
				/*  backgroundElement.style.filter = 'blur(1px)';
                backgroundElement.style.WebkitFilter = 'blur(1px)'; */
			}
		}
	}, [layoutRendered]);

	return (
		<Layout className="h-full">
			<Header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "10px 20px", // consistent padding
					background: "linear-gradient(to bottom right, #4E54C8, #8F94FB)", // simplified gradient
					borderBottom: "1px solid #ccc",
					color: "white",
					fontFamily: "Arial, sans-serif",
				}}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Image
							src={"/seatme.svg"}
							width={40}
							height={40}
							className="border border-solid border-white rounded-full mr-2"
						/>
						<span className="text-white text-lg font-bold">SeatMe</span>
					</div>
				</div>

				<div>
					<InfoCircleTwoTone
						style={{ fontSize: "20px" }}
						twoToneColor="#8F94FB"
						onClick={() => setShowInstruction(!showInstruction)}
					/>
				</div>
			</Header>

			<Content
				style={{
					padding: 24,
					minHeight: 280,
					// background: colorBgContainer, // Remove or comment out this line
					/*  backgroundSize: 'auto 100%',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center', */
					overflow: "hidden",
					padding: "0 16px",
					border: "1px solid rgba(140, 140, 140, 0.35)",
					position: "relative", // Add position relative to allow absolute positioning of the background
				}}
				className="flex-grow"
				id="scrollableDiv"
			>
				<div
					id="backgroundImage"
					style={{
						/* Apply the background image */
						backgroundImage: `url("/35020247_8262064.svg")`,
						backgroundSize: "auto 100%",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						/* Add the blur effect */
						/*  filter: 'blur(5px)',
                         WebkitFilter: 'blur(5px)', */

						/* Full height and width */
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 0,
					}}
				></div>

				<div style={{ position: "relative", zIndex: 1 }}>
					{layoutRendered && children}
				</div>
			</Content>
			<InstructionModel
				onClose={() => setShowInstruction(false)}
				showInstruction={showInstruction}
			/>
		</Layout>
	);
};
export default Container;
