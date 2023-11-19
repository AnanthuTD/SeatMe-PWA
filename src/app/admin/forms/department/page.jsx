'use client'

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
	Table
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Link from "next/link";

const DynamicDepartmentForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages

	const handleSubmission = async (values) => {
		console.log("Submitted values:", values);

		try {
			const result = await axios.post("/api/admin/departmententry/department", {
				departments: values.departments,
			});
			if (result.status === 200) {
				message.success(result.message);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
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
	const [departments, setDepartments] = useState([]);

	const loadDepartments = async () => {
		try {
		const result = await axios.get("/api/admin/departments");
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


	return (
		<div className="p-3">
            <Link href={"/admin/forms/department/import"}>
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
				columns={[
					{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
					},
					{
					title: 'Code',
					dataIndex: 'code',
					key: 'code',
					},
					{
					title: 'Name',
					dataIndex: 'name',
					key: 'name',
					},
				]}
				pagination={false}
				style={{ width: '100%' }}
				/>
			</Card>

		</div>
		
	);
};

export default DynamicDepartmentForm;


