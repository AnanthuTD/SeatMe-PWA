"use client";
import React, { useState } from "react";
import { Form, Input, Button, Space, message, Alert, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";

const LinkCourseProgram = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null);

	const onFinish = async (values) => {
		try {
			const response = await axios.post("/api/staff/course/link", values);
			if (response.status === 200) {
				message.success("Successfully linked courses to programs");
				form.resetFields();
				setError(null);
			}
		} catch (error) {
			setError(
				error.response ? error.response.data : "Something went wrong!",
			);
		}
	};

	return (
		<div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
			<h1>Link Course to Program</h1>
			{error && (
				<Alert
					message="Error"
					description={JSON.stringify(error)}
					type="error"
					showIcon
				/>
			)}
			<Form
				form={form}
				name="dynamic_form_nest_item"
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.List name="links">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Space
									key={key}
									style={{ display: "flex", marginBottom: 8 }}
									align="baseline"
								>
									<Form.Item
										{...restField}
										name={[name, "programId"]}
										rules={[
											{
												required: true,
												message: "Missing program ID",
											},
										]}
									>
										<InputNumber placeholder="Program ID" />
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, "courseId"]}
										rules={[
											{
												required: true,
												message: "Missing course ID",
											},
										]}
									>
										<Input placeholder="Course ID" />
									</Form.Item>
									<MinusCircleOutlined onClick={() => remove(name)} />
								</Space>
							))}
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									Add Program-Course Pair
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LinkCourseProgram;
