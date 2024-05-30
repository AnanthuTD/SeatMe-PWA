"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "@/lib/axiosPrivate";
import { StopOutlined } from "@ant-design/icons";
import BannedTable from "./bannedTable";
import { useAccount } from "@/context/accountContext";

const BanUnbanStudents = () => {
	const [form] = Form.useForm();
	const [bannedStudents, setBannedStudents] = useState([]);

	const { user } = useAccount();

	const banStudent = async (values) => {
		try {
			const response = await axios.patch(
				`/api/admin/student/ban/${values.studentId}`,
			);
			message.success(response.data.message);
			form.resetFields();
			fetchBannedStudents();
		} catch (error) {
			message.error("Failed to ban student");
		}
	};

	const fetchBannedStudents = async () => {
		try {
			const response = await axios.get("/api/admin/student/banned");
			setBannedStudents(response.data);
		} catch (error) {
			console.error("Error fetching banned students:", error);
			message.error("Failed to fetch banned students");
		}
	};

	useEffect(() => {
		fetchBannedStudents();
	}, []);

	return (
		<div className="pt-3">
			{user.role === "admin" ? (
				<Form form={form} onFinish={banStudent}>
					<Form.Item
						name="studentId"
						label="Student ID"
						rules={[
							{
								required: true,
								message: "Please enter student ID",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							danger
							icon={<StopOutlined />}
						>
							Ban Student
						</Button>
					</Form.Item>
				</Form>
			) : null}
			<BannedTable
				bannedStudents={bannedStudents}
				setBannedStudents={setBannedStudents}
			/>
		</div>
	);
};

export default BanUnbanStudents;
