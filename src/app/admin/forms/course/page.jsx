"use client";

import React, { useState, useEffect } from "react";
import {
	Input,
	Button,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	Alert,
	FloatButton,
	Checkbox,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosInstance";
import SelectProgram from "../../components/select";
import Link from "next/link";
import { FileExcelOutlined } from "@ant-design/icons";

const DynamicCourseForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [programs, setPrograms] = useState([]); // State to store program data

	const loadPrograms = async () => {
		try {
			const result = await axios.get("/api/admin/programs");
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	useEffect(() => {
		loadPrograms();
	}, []);

	const handleSubmission = async (values) => {
		console.log("Submitted values:", values);

		try {
			const result = await axios.post("/api/admin/courses", {
				courses: values.courses,
			});
			if (result.status === 200) {
				message.success(result.message);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Course with ID '${error.response.data.value}' already exists`,
				);
			} else {
				setError("Something went wrong. Please try again."); // Set the error message
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.warning(
			"ID, Name, Semester, IsOpenCourse, and Program fields are required",
		);
	};

	const handleAlertClose = () => {
		setError(null); // Clear the error message
	};

	useEffect(() => {
		form.setFieldsValue({ courses: [{}] });
	}, [form]);

	return (
		<div className="p-3">
			<Link href={"/admin/forms/course/import"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			{error && (
				<Alert
					message="Error"
					description={error}
					type="error"
					closable
					onClose={handleAlertClose}
					style={{ marginBottom: 16 }}
				/>
			)}
			<Form
				name="main"
				onFinish={handleSubmission}
				form={form}
				initialValues={{
					courses: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="courses">
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
									title={`Course ${field.name + 1}`}
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
												label="Course ID"
												rules={[
													{
														required: true,
														message:
															"Please enter the course ID",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "name"]}
												label="Course Name"
												rules={[
													{
														required: true,
														message:
															"Please enter the course name",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={16}>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "semester"]}
												label="Semester"
												rules={[
													{
														required: true,
														message:
															"Please enter the semester",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[
													field.name,
													"isOpenCourse",
												]}
												label="Is Open Course"
												initialValue={false}
												valuePropName="checked"
											>
												<Checkbox defaultChecked={false}/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "program"]}
												label="Program"
												rules={[
													{
														required: true,
														message:
															"Please select the program",
													},
												]}
											>
												<SelectProgram
													options={programs}
													placeholder="Select Program"
												/>
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Course
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

export default DynamicCourseForm;
