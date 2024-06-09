"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Button, Alert } from "antd";
import { handlePasswordCreation } from "../../actions/createPassword";

const ResetPasswordModal = ({ open, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleReset = async (values: { email: string }) => {
		setLoading(true);
		try {
			await handlePasswordCreation({ email: values.email });
			setMessage("Password reset link sent successfully!");
		} catch (error) {
			setMessage("Failed to send password reset link.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			open={open}
			title="Reset Password"
			footer={null}
			onCancel={onClose}
		>
			<Form layout="vertical" onFinish={handleReset}>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
							type: "email",
						},
					]}
				>
					<Input />
				</Form.Item>
				{message && (
					<Alert
						message={message}
						type={message.includes("successfully") ? "success" : "error"}
						showIcon
						className="mb-4"
					/>
				)}
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						Reset Password
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ResetPasswordModal;
