"use client";

import React, { useState, useEffect } from "react";
import {
	Input,
	Button,
	InputNumber,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	FloatButton,
} from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import DepProSemCouSelect from "../../components/depProSemCouSelect";
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/axiosInstance";
import Link from "next/link";

const DynamicStudentForm = () => {
	const [form] = Form.useForm();
	const [values, setValues] = useState({
		department: "",
		program: "",
		semester: "",
	});

	const handleSubmission = async (values) => {
		const students = values.students.map((student) => {
			(student.department = values.department),
				(student.program = values.program),
				(student.semester = values.semester);
			return student;
		});
		console.log(students);

		try {
			const result = await axios.post("/api/admin/student", { students });
			if (result.status === 200) {
				message.success(result.message);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with register number '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	const onFinishFailed = (errorInfo) => {
		const requiredFields = ["department", "program", "semester"];

		let error = false;

		requiredFields.forEach((field) => {
			const errorField = errorInfo.errorFields.find(
				(error) => error.name[0] === field,
			);
			if (errorField && !error) {
				message.warning("Department, program, semester are required");
				error = true;
			}
		});
	};

	useEffect(() => {
		// console.log(values);
		form.setFieldsValue(values);
	}, [values]);

	return (
		<div className="p-3">
			<Link href={"/admin/student/insert/xlsx"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			<DepProSemCouSelect
				value={setValues}
				courseMode=""
				courseField={false}
			/>
			<Divider />
			<Form
				name="main"
				onFinish={handleSubmission}
				form={form}
				initialValues={{
					students: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.Item
					name={"department"}
					hidden
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item name={"program"} hidden rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name={"semester"}
					rules={[{ required: true }]}
					hidden
					// initialValue={{}}
				>
					<Input />
				</Form.Item>
				<Form.List name="students">
					{(fields, { add, remove }) => (
						<div
							style={{
								display: "flex",
								rowGap: 16,
								flexDirection: "column",
							}}
						>
							{fields.map((field) => (
								<Card
									size="small"
									title={`Item ${field.name + 1}`}
									key={field.key}
									extra={
										<CloseOutlined
											onClick={() => {
												remove(field.name);
											}}
										/>
									}
								>
									<Row gutter={16}>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "id"]}
												label="Registration No"
												rules={[
													{
														type: "number",
														required: true,
														message:
															"Please enter a valid register number",
														/* max: 999999999999,
														min: 100000000000, */
													},
												]}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{
														width: "100%",
													}}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[
													field.name,
													"rollNumber",
												]}
												label="Roll No"
												rules={[
													{
														required: true,
														type: "number",
														message:
															"Please enter a valid Roll number",
														max: 999999,
														min: 100000,
													},
												]}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{
														width: "100%",
													}}
												/>
											</Form.Item>
										</Col>

										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "name"]}
												label="Name"
												rules={[
													{
														required: true,
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={16}>
										<Col>
											<Form.Item
												name={[field.name, "email"]}
												label="Email"
											>
												<Input type="email" />
											</Form.Item>
										</Col>
										<Col>
											<Form.Item
												name={[field.name, "phone"]}
												label="Phone"
												rules={[
													{
														max: 9999999999,
														min: 1000000000,
														type: "number",
													},
												]}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{
														width: "100%",
													}}
												/>
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Item
							</Button>
						</div>
					)}
				</Form.List>
				<Divider />
				<Row gutter={16}>
					<Col sm={24} md={5}>
						<Button ghost type="primary" htmlType="submit">
							Submit All
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default DynamicStudentForm;
