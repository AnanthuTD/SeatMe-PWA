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
	Table,
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";

const DynamicDepartmentForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [departments, setDepartments] = useState([]);

	const handleDelete = async (departmentId) => {
		try {
			const result = await axios.delete(
				`/api/staff/department-entry/department/${departmentId}`,
			);
			if (result.status === 200) {
				message.success(result.data.message);
				// Reload departments after deletion
				loadDepartments();
			} else {
				message.error("Delete failed");
			}
		} catch (error) {
			console.error(error);
			message.error("Something went wrong. Please try again.");
		}
	};

	const handleUpdate = async (updatedDepartment) => {
		try {
			const result = await axios.patch(
				"/api/staff/department-entry/departmentupdate/",
				[updatedDepartment],
			);
			if (result.status === 200) {
				message.success(result.data.message);
				// Optionally, reload departments or update state with the new data
				loadDepartments();
			} else {
				message.error("Update failed");
			}
		} catch (error) {
			console.error("Error updating department:", error);
			message.error("Something went wrong. Please try again.");
		}
	};

	const handleSubmission = async (values) => {
		try {
			const result = await axios.post(
				"/api/staff/department-entry/department",
				{
					departments: values.departments,
				},
			);
			if (result.status === 200) {
				message.success(result.data.message);
				setError(null); // Clear any previous errors
				// Reload departments after submission
				loadDepartments();
			} else message.error("Submit failed");
		} catch (error) {
			if (error.response.status === 400) {
				message.error(
					`Department with ID '${error.response.data.value}' already exists`,
				);
			} else {
				setError("Something went wrong. Please try again."); // Set the error message
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.warning("Department Name and ID are required");
	};

	const handleAlertClose = () => {
		setError(null); // Clear the error message
	};

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/staff/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	useEffect(() => {
		// Load departments when the component mounts
		loadDepartments();
	}, []);

	useEffect(() => {
		form.setFieldsValue({ departments: [{}] });
	}, [form]);

	const handleTableChange = (record, field, value) => {
		const newDepartments = [...departments];
		const index = newDepartments.findIndex(
			(department) => department.id === record.id,
		);
		if (index !== -1) {
			newDepartments[index][field] = value;
			setDepartments(newDepartments);
			// Call the update function when the input loses focus
			handleUpdate(newDepartments[index]);
		}
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Code",
			dataIndex: "code",
			key: "code",
			render: (text, record) => (
				<Input
					value={text}
					onChange={(e) =>
						handleTableChange(record, "code", e.target.value)
					}
					onBlur={() => handleUpdate(record)}
				/>
			),
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text, record) => (
				<Input
					value={text}
					onChange={(e) =>
						handleTableChange(record, "name", e.target.value)
					}
					onBlur={() => handleUpdate(record)}
				/>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Button
					type="link"
					onClick={() => handleDelete(record.id)}
					style={{ color: "red" }}
				>
					Delete
				</Button>
			),
		},
	];

	return (
		<div className="p-3">
			<Link href={"/staff/forms/department/import"}>
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
					departments: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="departments">
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
									title={`Department ${field.name + 1}`}
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
										<Col xs={24} md={24} lg={8} xxl={8}>
											<Form.Item
												name={[field.name, "id"]}
												label="Department ID"
												rules={[
													{
														required: true,
														message:
															"Please enter the department ID",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={8} xxl={8}>
											<Form.Item
												name={[field.name, "code"]}
												label="Department Code"
												rules={[
													{
														required: true,
														message:
															"Please enter the department Code",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={8} xxl={8}>
											<Form.Item
												name={[field.name, "name"]}
												label="Department Name"
												rules={[
													{
														required: true,
														message:
															"Please enter the department name",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Department
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
			<Card size="small" title="Departments" style={{ marginTop: 16 }}>
				<Table
					dataSource={departments}
					columns={columns}
					pagination={false}
					rowKey="id"
				/>
			</Card>
		</div>
	);
};

export default DynamicDepartmentForm;
