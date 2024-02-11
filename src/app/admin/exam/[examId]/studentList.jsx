import React from "react";
import { Table } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const columns = [
	{
		title: "Reg.No",
		dataIndex: "student.id",
		key: "id",
	},
	{
		title: "Name",
		dataIndex: "student.name",
		key: "name",
	},
	{
		title: "Roll Number",
		dataIndex: "student.rollNumber",
		key: "rollNumber",
	},
	{
		title: "Room",
		dataIndex: "roomId",
		key: "roomId",
	},
	{
		title: "Seat.No",
		dataIndex: "seatNumber",
		key: "seatNumber",
	},
	{
		title: "Present",
		dataIndex: "isPresent",
		key: "present",
		render: (isPresent) =>
			isPresent === 1 ? (
				<CheckCircleTwoTone twoToneColor="#52c41a" />
			) : (
				<CloseCircleTwoTone twoToneColor="#f5222d" />
			),
	},
];

const StudentList = ({ students }) => {
	return (
		<Table
			dataSource={students}
			columns={columns}
			rowKey={(record) => record.id}
			pagination={false}
		/>
	);
};

export default StudentList;
