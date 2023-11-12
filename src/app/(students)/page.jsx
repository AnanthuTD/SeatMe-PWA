"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber, Checkbox, Row, Space, Col } from "antd";
import Segment from "./segment";
import axios from "@/lib/axiosPublic";

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

const App = () => {
	const [form] = Form.useForm();
	const [seatingInfo, setSeatingInfo] = useState(undefined);
	const [upcomingExams, setUpcomingExams] = useState([]);

	const onFinish = async (values) => {
		localStorage.setItem('rememberedRegisterId', values.studentId.toString());

		const result = await axios.get("api/", {
			params: { studentId: values.studentId },
		});

		setSeatingInfo(result.data || undefined);
	};

	useEffect(() => {
		const storedRegisterId = localStorage.getItem('rememberedRegisterId');

		if (storedRegisterId) {
			form.setFieldsValue({ studentId: parseInt(storedRegisterId) });
		}
	}, [form]);

	const onReset = () => {
		localStorage.removeItem('rememberedRegisterId');
		form.resetFields();
	};
	return (
		<div className="flex h-screen flex-col w-full p-5 overflow-hidden">
			<section className="h-[40%] flex justify-center items-center w-full">
				<div className="min-w-[50%]">
					<Form
						{...layout}
						form={form}
						name="control-hooks"
						onFinish={onFinish}
						style={{ maxWidth: 600 }}
					>
						<Form.Item
							name="studentId"
							label="Register Number"
							rules={[
								{
									required: true,
									type: "number",
									min: 100000000000,
									max: 999999999999,
									message: "Invalid Register number",
								},
							]}
						>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item {...tailLayout}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
							<Button
								htmlType="button"
								onClick={onReset}
								className="m-1"
							>
								Reset
							</Button>
						</Form.Item>

					</Form>
				</div>
			</section >
			<section className="w-full h-[60%]">
				<div className="mx-auto w-full h-full">
					<Segment seatingInfo={seatingInfo} />
				</div>
			</section>
		</div >
	);
};

export default App;
