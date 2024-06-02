"use client";
import axios from "@/lib/axiosPublic";
import { setAuthorizationToken } from "@/lib/axiosPrivate";
import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useAccount } from "@/context/accountContext";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "./ui/GoogleSignInButton";

const Login = () => {
	const { setUser } = useAccount();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values, setUser, router) => {
		setLoading(true);
		try {
			const response = await axios.post("api/auth/login/", values);
			const { user, accessToken } = response.data;

			localStorage.setItem("user", JSON.stringify(user));

			setAuthorizationToken(accessToken);

			// console.log("user: ", response.data);

			setUser(user);

			if (user.role == "admin" || user.role == "staff") {
				router.push("/staff"); // Redirect to the admin page
			} else if (user.role == "invigilator") {
				router.push("/invigilator"); // Redirect to the staff page
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					message.error(
						"Unauthorized user. Please check your credentials.",
					);
				}
			} else {
				console.error("An error occurred:", error);
				message.error("An error occurred!");
			}
		}
		setLoading(false);
	};

	return (
		<>
			<div className="grid mt-24 place-items-center">
				<div className="border-3 border-black p-8 shadow-xl rounded-md">
					<div className="h-36 w-36 m-auto  ">
						<img src="Admin-logo.png" alt="" className="h-full w-full" />
					</div>
					<GoogleSignInButton />
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
						}}
						style={{
							maxWidth: 600,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={(value) => onFinish(value, setUser, router)}
						autoComplete="off"
					>
						<h1 className="text-4xl text-center mb-10 ">Login</h1>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{
									required: true,
									message: "Please input your Mail!",
									type: "email",
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item
							name="remember"
							valuePropName="checked"
							wrapperCol={{
								offset: 8,
								span: 16,
							}}
						>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<Form.Item
							wrapperCol={{
								offset: 8,
								span: 16,
							}}
						>
							<Button type="primary" htmlType="submit" loading={loading}>
								Login
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
};

export default Login;
