"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosPrivate";
import { Spin, Alert, Button } from "antd";

export const AuthProvider = ({ children, api }) => {
	const [loading, setLoading] = useState(true);

	const router = useRouter()

	useEffect(() => {
		axios
			.get(api)
			.then((response) => {
				setLoading(false);
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) {
					router.push('/login')
				} else {
					setLoading(false); // Set loading to false for non-401 errors.
					console.error("API call error:", error);
					setError('Unexpected error occurred'); // Set the error message.
				}
			});
	}, [api, router]);

	const [error, setError] = useState(null);

	return (
		<>
			{loading ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<Spin size="large" />
				</div>
			) : error ? (
				<div className="mx-auto mt-8 aspect-square flex justify-center items-center h-full">
					<div
						className="bg-white p-4 border border-gray-300 rounded shadow w-1/2"
						style={{ width: "50%"}}
					>
						<Alert
							message="Error"
							description={error}
							type="error"
							showIcon
							onClose={() => setError(null)}
						/>
						<div className="text-center mt-4 ">
							<Button type="primary" href="/login">
								Login
							</Button>
						</div>
					</div>
				</div>
			) : (
				children
			)}
		</>
	);
};
