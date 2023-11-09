import React, { useState, useEffect } from "react";
import { Row, Col, message, Descriptions } from "antd";
import TeacherSelector from "./teacherSelector";
import axios from "@/lib/axiosPrivate";
import DepartmentSelector from "../../components/select";
import { radioClasses } from "@mui/material";

function RoomPanel({
	room,
	departments,
	roomTeachers,
	handleTeacherSelect,
	isFailed = false,
}) {
	const [selectedDepartment, setSelectedDepartment] = useState(undefined);
	const [teacherList, setTeacherList] = useState([]);

	const panelStyle = {
		border: isFailed ? "2px solid #ff8080" : "",
		borderRadius: isFailed ? "5px" : "",
	};

	useEffect(() => {
		if (selectedDepartment) {
			loadTeachers(selectedDepartment);
		}
	}, [selectedDepartment]);

	const handleDepartmentChange = (departmentId) => {
		setSelectedDepartment(departmentId);
		handleTeacherSelect(room.id, null);
	};

	const loadTeachers = async (selectedDepartment) => {
		try {
			const result = await axios.get(
				`/api/admin/staff/${selectedDepartment}`,
			);
			const { data } = result;
			if (!data.error) {
				console.log(roomTeachers);

				const teachers = data.staffs.filter((teacher) => {
					return !Object.values(roomTeachers).includes(teacher.id);
				});

				console.log(teachers);
				setTeacherList(teachers);
				return;
			}
			message.error(data.message);
		} catch (error) {
			console.log(error);
			const { data } = error?.response || { data: {} };
			const errorMessage =
				data.message || "Something went wrong on the server side.";
			message.error(errorMessage);
		}
	};
	const item = {
		key: room.id,
		label: (
			<Row gutter={8} style={panelStyle}>
				<Col xs={24} sm={24} md={6} lg={6} xl={6}>
					<h4 className="text-md font-semibold mb-2">
						Room ID: {room.id}
					</h4>
				</Col>
				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<DepartmentSelector
						options={departments}
						onChange={handleDepartmentChange}
					/>
				</Col>
				<Col xs={24} sm={24} md={10} lg={10} xl={10}>
					<TeacherSelector
						options={teacherList}
						onChange={(value) =>
							handleTeacherSelect(room.id, value)
						}
						value={roomTeachers[room.id]}
					/>
				</Col>
			</Row>
		),
		children: (
			<div className="mb-4 p-4 border rounded-lg shadow">
				<Descriptions bordered column={1}>
					<Descriptions.Item label="Rows">
						{room.rows}
					</Descriptions.Item>
					<Descriptions.Item label="Cols">
						{room.cols}
					</Descriptions.Item>
					<Descriptions.Item label="Block ID">
						{room.blockId}
					</Descriptions.Item>
					<Descriptions.Item label="Available">
						{room.isAvailable ? "Yes" : "No"}
					</Descriptions.Item>
					<Descriptions.Item label="Floor">
						{room.floor}
					</Descriptions.Item>
					<Descriptions.Item label="Seats">
						{room.seats}
					</Descriptions.Item>
					<Descriptions.Item label="Selected Teacher">
						{roomTeachers[room.id]
							? teacherList.find(
									(teacher) =>
										teacher.id === roomTeachers[room.id],
							  ).name
							: "Not selected"}
					</Descriptions.Item>
				</Descriptions>
			</div>
		),
	};

	return item;
}

export default RoomPanel;
