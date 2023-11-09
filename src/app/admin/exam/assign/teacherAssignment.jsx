import React, { useEffect, useState } from "react";
import { Select, Descriptions, Collapse, Row, Col } from "antd";
import axios from "@/lib/axiosPrivate";
import SelectDepartment from "../../components/select";

const { Option } = Select;
const { Panel } = Collapse;

function TeacherAssignment({ rooms = [], teachers = [] }) {
	const [roomTeachers, setRoomTeachers] = useState({});
	const [teacherList, setTeacherList] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState([]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/admin/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	useEffect(() => {
		loadDepartments();
	}, []);

	const handleTeacherSelect = (roomId, teacherId) => {
		setRoomTeachers({
			...roomTeachers,
			[roomId]: teacherId,
		});
	};

	const handleDepartmentChange = (departmentId) => {
		setSelectedDepartment(departmentId);
	};

    const loadTeachers = ()=>{}

    useEffect(() => {
		if (selectedDepartment) {
			loadTeachers(selectedDepartment);
		}
	}, [selectedDepartment]);

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Teacher Assignment</h2>
			<Collapse accordion>
				{rooms.map((room) => (
					<Panel
						key={room.id}
						header={
							<Row gutter={8}>
								<Col xs={24} sm={24} md={12} lg={12} xl={12}>
									<h4 className="text-md font-semibold mb-2">
										Room ID: {room.id}
									</h4>
								</Col>
								<SelectDepartment
									options={departments}
									onChange={handleDepartmentChange}
									placeholder="Select Department"
								/>
								<Col xs={24} sm={24} md={12} lg={12} xl={12}>
									<Select
										id={`teacherSelect-${room.id}`}
										showSearch
										style={{ width: "100%" }}
										placeholder="Select a teacher"
										optionFilterProp="children"
										onChange={(value) =>
											handleTeacherSelect(room.id, value)
										}
										value={roomTeachers[room.id]}
									>
										{teacherList.map((teacher) => (
											<Option
												key={teacher.id}
												value={teacher.id}
											>
												{teacher.name}
											</Option>
										))}
									</Select>
								</Col>
							</Row>
						}
					>
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
													teacher.id ===
													roomTeachers[room.id],
										  ).name
										: "Not selected"}
								</Descriptions.Item>
							</Descriptions>
						</div>
					</Panel>
				))}
			</Collapse>
		</div>
	);
}

export default TeacherAssignment;
