import React from "react";
import { Form, Input } from "antd";
import { authenticate } from "../actions";
import SubmitButton from "./SubmitButton";

function MagicLinkForm() {
	return (
		<Form
			layout="vertical"
			onFinish={(formaData) => {
				formaData.provider = "nodemailer";
				authenticate(undefined, formaData);
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

			<SubmitButton value={"Send Magic Link"} key={"magic-link-submit"} />
		</Form>
	);
}

export default MagicLinkForm;
