"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, message, Descriptions } from "antd";
import TeacherSelector from "./teacherSelector";
import axios from "axios";
import DepartmentSelector from "../../../components/selectDepartment";

function RoomPanel({
	room,
	departments,
	roomTeachers,
	handleTeacherSelect,
	isFailed = false,
}) {
	const [teacherList, setTeacherList] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(undefined);

	const panelStyle = {
		border: isFailed ? "2px solid #ff8080" : "",
		borderRadius: isFailed ? "5px" : "",
	};

	useEffect(() => {
		if (selectedDepartment) {
			loadTeachers(selectedDepartment);
		}
	}, [selectedDepartment]);

	const handleDepartmentChange = (departmentCode) => {
		setSelectedDepartment(departmentCode);
		handleTeacherSelect(room.id, null);
	};

	const loadTeachers = async (selectedDepartment) => {
		try {
			const result = await axios.get(
				`/api/staff/staff/${selectedDepartment}`,
			);
			const { data } = result;
			if (!data.error) {
				// console.log(roomTeachers);

				const teachers = data.staffs.filter((teacher) => {
					return !Object.values(roomTeachers).includes(teacher.id);
				});

				// console.log(teachers);
				setTeacherList(teachers);
				return;
			}
			message.error(data.message);
		} catch (error) {
			// console.log(error);
			const { data } = error?.response || { data: {} };
			const errorMessage =
				data.message || "Something went wrong on the server side.";
			message.error(errorMessage);
		}
	};

	return (
		<Row gutter={8} style={panelStyle}>
			<Col xs={24} sm={24} md={6} lg={6} xl={6}>
				<h4 className="text-md font-semibold mb-2">Room ID: {room.id}</h4>
			</Col>
			<Col xs={24} sm={24} md={8} lg={8} xl={8}>
				<DepartmentSelector
					options={departments}
					onChange={handleDepartmentChange}
					defaultValue={room?.departmentName}
				/>
			</Col>
			<Col xs={24} sm={24} md={10} lg={10} xl={10}>
				<TeacherSelector
					options={teacherList}
					onChange={(value) => handleTeacherSelect(room.id, value)}
					defaultValue={room?.name}
				/>
			</Col>
		</Row>
	);
}

export default RoomPanel;
