import React from "react";
import { Form, Input, Checkbox } from "antd";
import { authenticate } from "../actions";
import SubmitButton from "./SubmitButton";
import Link from "next/link";

function CredentialForm() {
	return (
		<Form
			layout="vertical"
			onFinish={(formaData) => {
				formaData.provider = "credentials";
				authenticate(undefined, formaData);
			}}
		>
			<Form.Item>
				<Form.Item
					label={<span className="font-medium">Email</span>}
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
							type: "email",
						},
					]}
					style={{
						display: "inline-block",
						width: "calc(50% - 8px)",
					}}
				>
					<Input style={{ padding: "0.5rem" }} />
				</Form.Item>

				<Form.Item
					label={<span className="font-medium">Password</span>}
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
					style={{
						display: "inline-block",
						width: "calc(50% - 8px)",
						margin: "0 8px",
					}}
				>
					<Input.Password style={{ padding: "0.5rem" }} />
				</Form.Item>
			</Form.Item>

			<div className="flex justify-between items-center mb-6">
				<Form.Item name="remember" valuePropName="checked" noStyle>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>
				<Link href="#" className="font-medium">
					Forget Password?
				</Link>
			</div>

			<SubmitButton
				value={"Sign in to your account"}
				key={"credential-sign-in-button"}
			/>
		</Form>
	);
}

export default CredentialForm;
