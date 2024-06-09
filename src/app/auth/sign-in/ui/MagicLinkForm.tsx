"use client";
import React from "react";
import { Form, Input, Alert } from "antd";
import { authenticate } from "../../actions/authenticate";
import SubmitButton from "./SubmitButton";

function MagicLinkForm() {
	const [loading, setLoading] = React.useState(false);
	const [message, setMessage] = React.useState("");

	return (
		<Form
			layout="vertical"
			onFinish={async (formData) => {
				setLoading(true);
				formData.provider = "nodemailer";
				try {
					const result = await authenticate(undefined, formData);
					setMessage(result);
				} catch (error) {
					setMessage("An error occurred while sending the magic link.");
				}
				setLoading(false);
			}}
		>
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
			>
				<Input id="magic-email" style={{ padding: "0.5rem" }} />
			</Form.Item>

			{message && (
				<Alert
					message={message}
					type={message.includes("successfully") ? "success" : "error"}
					showIcon
					className="mb-4"
				/>
			)}

			<SubmitButton
				value={"Send Magic Link"}
				key={"magic-link-submit"}
				loading={loading}
			/>
		</Form>
	);
}

export default MagicLinkForm;
