import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Row, Col } from "antd";
import { UserOutlined, TeamOutlined, SafetyOutlined } from "@ant-design/icons";
import "./styles.css"; // Ensure the path is correct

const NavigationPage = () => {
	return (
		<div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex flex-col justify-center items-center p-4">
			<div className="mb-8">
				<Image
					src="/seatme.svg"
					alt="SeatMe Logo"
					width={100}
					height={100}
				/>
			</div>
			<div className="w-fit mb-10">
				<h1 className="text-5xl font-extrabold text-center text-black drop-shadow-lg typing-text">
					Welcome to SeatMe
				</h1>
			</div>
			<Row gutter={[24, 24]} justify="center" className="w-full max-w-2xl">
				<Col xs={24} sm={8}>
					<Link href="/">
						<Button
							type="primary"
							size="large"
							block
							className="bg-blue-600 hover:bg-blue-800 text-white flex items-center justify-center"
						>
							<UserOutlined className="mr-2" />
							Student
						</Button>
					</Link>
				</Col>
				<Col xs={24} sm={8}>
					<Link href="/staff">
						<Button
							type="primary"
							size="large"
							block
							className="bg-green-600 hover:bg-green-800 text-white flex items-center justify-center"
						>
							<TeamOutlined className="mr-2" />
							Staff / Admin
						</Button>
					</Link>
				</Col>
				<Col xs={24} sm={8}>
					<Link href="/invigilator">
						<Button
							type="primary"
							size="large"
							block
							className="bg-yellow-600 hover:bg-yellow-800 text-white flex items-center justify-center"
						>
							<SafetyOutlined className="mr-2" />
							Invigilator
						</Button>
					</Link>
				</Col>
			</Row>
		</div>
	);
};

export default NavigationPage;
