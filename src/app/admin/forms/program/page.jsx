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
	Select,
	FloatButton,
	Table,
	Typography,
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import SelectDepartment from "../../components/selectDepartment";
import Link from "next/link";

const { Title } = Typography;
const DynamicProgramForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [departments, setDepartments] = useState([]); // State to store department data
	const [selectedDepartmentCode, setSelectedDepartmentCode] = useState(null);
	const handleDelete = async (record) => {
		try {
			// Make an API call or perform the necessary logic to delete the program
			// You can use axios or any other method for API calls
			const result = await axios.delete(
				`/api/staff/program-entry/program/${record.id}`,
			);
			if (result.status === 200) {
				const msg = "Program with id " + record.id + " deleted";
				message.success(msg);
				// Reload the programs after deletion
				loadPrograms();
			} else {
				message.error("Delete failed");
			}
		} catch (error) {
			console.error(error);
			message.error("Something went wrong. Please try again.");
		}
	};
	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/staff/departments");
			// console.log("departments data", result.data);
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	useEffect(() => {
		loadDepartments();
	}, []);

	const handleSubmission = async (values) => {
		// console.log("Submitted values:", values);

		try {
			const result = await axios.post(
				"/api/staff/program-entry/program",
				{
					programs: values.programs,
				},
			);
			if (result.status === 200) {
				message.success(result.message);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			// console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Program with ID '${error.response.data.value}' already exists`,
				);
			} else {
				setError("Something went wrong. Please try again."); // Set the error message
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.warning(
			"ID, Name, Department, Duration, and Level are required",
		);
	};

	const handleAlertClose = () => {
		setError(null);
	};

	const [programs, setPrograms] = useState([]);

	const loadPrograms = async () => {
		try {
			const result = await axios.get("/api/staff/programs");
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	useEffect(() => {
		loadPrograms();
	}, []);

	useEffect(() => {
		form.setFieldsValue({ programs: [{}] });
	}, [form]);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Duration",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Level",
			dataIndex: "level",
			key: "level",
		},
		{
			title: "Department",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Abbreviation",
			dataIndex: "abbreviation",
			key: "abbreviation",
		},
		{
			title: "Is Aided",
			dataIndex: "isAided",
			key: "isAided",
			render: (text) => (
				<span style={{ color: text ? "green" : "red" }}>
					{text ? "Yes" : "No"}
				</span>
			),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Button type="link" danger onClick={() => handleDelete(record)}>
					Delete
				</Button>
			),
		},
	];

	return (
		<div className="p-3">
			<Link href={"/admin/forms/program/import"}>
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
					programs: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="programs">
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
									title={`Program ${field.name + 1}`}
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
												label="Program ID"
												rules={[
													{
														required: true,
														message:
															"Please enter the program ID",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "name"]}
												label="Program Name"
												rules={[
													{
														required: true,
														message:
															"Please enter the program name",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[
													field.name,
													"abbreviation",
												]}
												label="Name abbreviation"
												rules={[
													{
														required: true,
														message:
															"Please enter the program name abbreviation",
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
												name={[
													field.name,
													"departmentCode",
												]}
												label="Department"
												rules={[
													{
														required: true,
														message:
															"Please select the department",
													},
												]}
											>
												<SelectDepartment
													options={departments}
													placeholder="Select Department"
												/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "duration"]}
												label="Duration (Years)"
												rules={[
													{
														required: true,
														message:
															"Please enter the duration in years",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "level"]}
												label="Level"
												rules={[
													{
														required: true,
														message:
															"Please enter the level (UG or PG)",
													},
												]}
											>
												<Select
													defaultValue={"UG"}
													options={[
														{
															key: "ug",
															value: "UG",
														},
														{
															key: "pg",
															value: "PG",
														},
													]}
													placeholder="Select Department"
												/>
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Program
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
			<div>
				<Title
					level={4}
					style={{
						color: "black",
						fontWeight: "bold",
						marginTop: "20px",
					}}
				>
					Programs
				</Title>
				<Select
					style={{ width: 200, marginBottom: 16 }}
					placeholder="Select Department"
					onChange={(value) => setSelectedDepartmentCode(value)}
				>
					<Select.Option value={null}>All Departments</Select.Option>
					{departments.map((dept) => (
						<Select.Option key={dept.code} value={dept.code}>
							{dept.name}
						</Select.Option>
					))}
				</Select>
				<Table
					dataSource={programs.filter((program) => {
						/* console.log(
							"Program Department Code:",
							program.departmentCode,
						);
						console.log(
							"Selected Department Code:",
							selectedDepartmentCode,
						); */

						return selectedDepartmentCode
							? program.departmentCode.toLowerCase() ===
									selectedDepartmentCode.toLowerCase()
							: true;
					})}
					columns={columns}
					pagination={false}
				/>
			</div>
		</div>
	);
};

export default DynamicProgramForm;
