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
	Checkbox
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import SelectBlock from "../../components/select";
import Link from "next/link";
import { FileExcelOutlined } from "@ant-design/icons";

const DynamicRoomForm = () => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [blocks, setBlocks] = useState([]); // State to store program data

	const loadBlocks = async () => {
		try {
			const result = await axios.get("/api/admin/blocks");
			setBlocks(result.data);
		} catch (error) {
			console.error("Error fetching blocks: ", error);
		}
	};

	useEffect(() => {
		loadBlocks();
	}, []);

	const handleSubmission = async (values) => {
		console.log("Submitted values:", values);

		try {
			const result = await axios.post("/api/admin/roomentry/room", {
				rooms: values.rooms,
			});
			if (result.status === 200) {
				message.success(result.message);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Room with ID '${error.response.data.value}' already exists`,
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
	const [rooms, setRooms] = useState([]);
	const loadRooms = async () => {
		try {
			const result = await axios.get("/api/admin/rooms", {
				params: {  },
			});
			setRooms(result.data);
		} catch (error) {
			console.error("Error fetching rooms: ", error);
		}
	};

	useEffect(() => {
		form.setFieldsValue({ rooms: [{}] });
	}, [form]);
	  useEffect(() => {
		loadRooms(); // Load rooms initially with a null programId
	  }, []);
	  
	  useEffect(() => {
		console.log("Semester Options:", );
	  }, []);
	  const columns = [
					{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
					},
					{
					title: 'Rows',
					dataIndex: 'rows',
					key: 'rows',
					},
					{
					title: 'Column',
					dataIndex: 'cols',
					key: 'cols',
					},
					{
					title: 'Floor',
					dataIndex: 'floor',
					key: 'floor',
					},
					{
					title: 'Block',
					dataIndex: 'blockId',
					key: 'blockId',
					render: (text, record) => {
						const block = blocks.find((b) => b.id === text);
						return block ? block.name : text;
					  },
					
					},
					{
					title: "Available",
					dataIndex: "isAvailable",
					key: "isAvailable",
					render: (text, record) => (
						<Checkbox checked={text} 
							disabled 
							style={{ color: text ? 'blue' : 'red' }}/>
					),
					},
		// ... (other columns)
	  ];
	
	return (
		<div className="p-3">
			<Link href={"/admin/forms/room/import"}>
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
					rooms: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="rooms">
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
									title={`Room ${field.name + 1}`}
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
												label="Room ID"
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
												name={[field.name, "cols"]}
												label="Columns"
												rules={[
													{
														required: true,
														message:
															"Please enter number of columns",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "rows"]}
												label="Rows"
												rules={[
													{
														required: true,
														message:
															"Please enter number of rows",
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
													"isAvailable",
												]}
												label="Is Available"
												initialValue={false}
												valuePropName="checked"
											>
												<Checkbox defaultChecked={false}/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "floor"]}
												label="Floor"
												rules={[
													{
														required: true,
														message:
															"Please enter the Floor",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "block"]}
												label="Block"
												rules={[
													{
														required: true,
														message:
															"Please select the block",
													},
												]}
											>
												<SelectBlock
													options={blocks}
													placeholder="Select Block"
												/>
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Room
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
			<Card size="small" title="Rooms" style={{ marginTop: 16 }}>

				<Table
				dataSource={rooms}
				columns={columns}
				pagination={false}
				style={{ width: '100%' }}
				/>
			</Card>
		</div>
	);
};

export default DynamicRoomForm;
