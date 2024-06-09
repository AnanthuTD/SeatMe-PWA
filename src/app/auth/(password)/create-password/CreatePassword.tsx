"use client";
import React from "react";
import { Form, Input, Button, Alert } from "antd";
import { setPassword } from "../../actions/createPassword";
import Link from "next/link";

function CreatePassword({ email, token }) {
	const [form] = Form.useForm();
	const [message, setMessage] = React.useState("");

	const validatePassword = (_: any, value: string) => {
		const minLength = 8;
		const hasNumber = /\d/;
		const hasLetter = /[a-zA-Z]/;
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

		if (!value) {
			return Promise.reject(new Error("Please input your password!"));
		}
		if (value.length < minLength) {
			return Promise.reject(
				new Error("Password must be at least 8 characters long."),
			);
		}
		if (!hasNumber.test(value)) {
			return Promise.reject(
				new Error("Password must contain at least one number."),
			);
		}
		if (!hasLetter.test(value)) {
			return Promise.reject(
				new Error("Password must contain at least one letter."),
			);
		}
		if (!hasSpecialChar.test(value)) {
			return Promise.reject(
				new Error("Password must contain at least one special character."),
			);
		}
		if (value === email) {
			return Promise.reject(
				new Error("Password must not be same as email."),
			);
		}
		return Promise.resolve();
	};

	const onFinish = async ({
		password,
		confirmPassword,
	}: {
		password: string;
		confirmPassword: string;
	}) => {
		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}

		try {
			await setPassword(token, password);
			setMessage("Password successfully created!");
		} catch (error) {
			setMessage(error.message);
		}
	};

	return message === "Password successfully created!" ? (
		<Alert
			message={message}
			type={"success"}
			showIcon
			className="mb-4"
			action={
				<Link href={"/auth/sign-in"}>
					<Button size="small" type="primary">
						Sign-in
					</Button>
				</Link>
			}
		/>
	) : (
		<Form
			form={form}
			name="create-password"
			onFinish={onFinish}
			layout="vertical"
		>
			<Form.Item label="Email Address">
				<Input value={email} disabled className="bg-gray-100" />
			</Form.Item>
			<Form.Item
				label="New Password"
				name="password"
				rules={[{ validator: validatePassword }]}
			>
				<Input.Password />
			</Form.Item>
			<Form.Item
				label="Confirm Password"
				name="confirmPassword"
				dependencies={["password"]}
				rules={[
					{ required: true, message: "Please confirm your password!" },
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue("password") === value) {
								return Promise.resolve();
							}
							return Promise.reject(
								new Error(
									"The two passwords that you entered do not match!",
								),
							);
						},
					}),
				]}
			>
				<Input.Password />
			</Form.Item>
			<div className="mb-4 text-sm text-gray-600">
				Your password must be at least 8 characters long and contain a mix
				of letters, numbers, and symbols.
			</div>
			{message && (
				<Alert
					message={message}
					type={
						message === "Password successfully created!"
							? "success"
							: "error"
					}
					showIcon
					className="mb-4"
				/>
			)}
			<Form.Item>
				<Button type="primary" htmlType="submit" className="w-full">
					Create Password
				</Button>
			</Form.Item>
		</Form>
	);
}

export default CreatePassword;
