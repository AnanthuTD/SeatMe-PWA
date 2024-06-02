import React from "react";
import { Table, Button, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";

function BannedTable({ bannedStudents, setBannedStudents }) {
	const unBanStudent = async (studentId) => {
		try {
			const response = await axios.patch(
				`/api/staff/student/unban/${studentId}`,
			);
			message.success(response.data.message);
			let newList = bannedStudents.filter((value) => value.id !== studentId);
			setBannedStudents(newList);
		} catch (error) {
			message.error("Failed to unban student");
		}
	};
	const columns = [
		{ title: "Student ID", dataIndex: "id", key: "id" },
		{ title: "Name", dataIndex: "name", key: "name" },
		{
			title: "Program",
			dataIndex: "program.abbreviation",
			key: "program.abbreviation",
		},
		{ title: "Semester", dataIndex: "semester", key: "semester" },
		{
			title: "Action",
			dataIndex: "",
			key: "action",
			render: (_, record) => (
				<Button
					type="link"
					icon={<CheckCircleOutlined style={{ color: "green" }} />}
					onClick={() => unBanStudent(record.id)}
				>
					Unban
				</Button>
			),
		},
	];
	return <Table dataSource={bannedStudents} columns={columns} />;
}

export default BannedTable;
