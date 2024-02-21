import React from "react";
import Link from "next/link";
import { Button, Row, Col } from "antd";

const NavigationPage = () => {
	return (
		<div className="bg-blue-200 min-h-screen flex flex-col justify-center items-center">
			<h1 className="text-4xl font-extrabold mb-8 text-center">
				Welcome to the Exam Seating Arrangement
			</h1>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={8}>
					<Link href="/">
						<Button
							type="primary"
							size="large"
							block
							className="bg-blue-500 hover:bg-blue-700 text-white"
						>
							Student
						</Button>
					</Link>
				</Col>
				<Col xs={24} sm={8}>
					<Link href="/admin">
						<Button
							type="primary"
							size="large"
							block
							className="bg-green-500 hover:bg-green-700 text-white"
						>
							Admin
						</Button>
					</Link>
				</Col>
				<Col xs={24} sm={8}>
					<Link href="/staff">
						<Button
							type="primary"
							size="large"
							block
							className="bg-yellow-500 hover:bg-yellow-700 text-white"
						>
							Staff
						</Button>
					</Link>
				</Col>
			</Row>
		</div>
	);
};

export default NavigationPage;
