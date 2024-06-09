"use client";
import React, { useState } from "react";
import { Form, Input, Checkbox, Alert, Typography, Modal } from "antd";
import { authenticate } from "../../actions/authenticate";
import SubmitButton from "./SubmitButton";
import ResetPasswordModal from "./ResetPasswordModel";

function CredentialForm() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [emailModalVisible, setEmailModalVisible] = useState(false);

	return (
		<>
			<Form
				layout="vertical"
				onFinish={async (formData) => {
					setLoading(true);
					formData.provider = "credentials";
					try {
						const result = await authenticate(undefined, formData);
						setMessage(result);
					} catch (error) {
						setMessage("An error occurred while sending the magic link.");
					}
					setLoading(false);
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

				<div className="flex justify-end items-center mb-6">
					<Typography.Link
						style={{ fontWeight: "500" }}
						onClick={() => setEmailModalVisible(true)}
					>
						Forget Password?
					</Typography.Link>
				</div>

				{message && (
					<Alert
						message={message}
						type={message.includes("successfully") ? "success" : "error"}
						showIcon
						className="mb-4"
					/>
				)}

				<SubmitButton
					value={"Sign in to your account"}
					key={"credential-sign-in-button"}
					loading={loading}
				/>
			</Form>
			<ResetPasswordModal
				open={emailModalVisible}
				onClose={() => setEmailModalVisible(false)}
			/>
		</>
	);
}

export default CredentialForm;
