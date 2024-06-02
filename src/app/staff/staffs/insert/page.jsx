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
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Select from "../../components/selectDepartment";
import { FileExcelOutlined } from "@ant-design/icons";
import Link from "next/link";

const DynamicStudentForm = () => {
	const [form] = Form.useForm();
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [departments, setDepartments] = useState([]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/staff/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	useEffect(() => {
		loadDepartments();
	}, []);

	const handleSubmission = async (values) => {
		const staffs = values.staffs.map((student) => {
			student.department = values.department;
			return student;
		});
		// console.log(staffs);

		try {
			const result = await axios.post("/api/staff/staff", {
				staffs: staffs,
			});

			const { data } = result;

			if (result.status >= 200 && result.status < 300) {
				message.success(data.message);
			} else message.error("Submit failed");
		} catch (error) {
			console.error(error);
			if (error.response.status === 400) {
				message.error(
					`Record with register number '${data.value}' already exists`,
				);
			} else message.error(data.message || "Something went wrong");
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
		// // console.log(values);
		form.setFieldsValue({ department: selectedDepartment });
	}, [selectedDepartment]);

	return (
		<div className="p-3">
			<Link href={"/staff/staffs/insert/import"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			<Row gutter={16} align="middle">
				<Col xs={24} sm={12} md={12} lg={8} xl={7}>
					<label className="block text-lg font-semibold mb-2">
						Department:
					</label>
					<Select
						options={departments}
						onChange={setSelectedDepartment}
						placeholder="Select Department"
					/>
				</Col>
			</Row>
			<Divider />
			<Form
				name="main"
				onFinish={handleSubmission}
				form={form}
				initialValues={{
					staffs: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.Item name={"department"} hidden rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.List name="staffs">
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
														type: "string",
														required: true,
														message:
															"Please enter a valid register number",
													},
												]}
											>
												<Input
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
												name={[field.name, "password"]}
												label="Password"
											>
												<Input type="password" />
											</Form.Item>
										</Col>
										<Col>
											<Form.Item
												name={[field.name, "designation"]}
												label="Designation"
												rules={[{ type: "string" }]}
											>
												<Input />
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
