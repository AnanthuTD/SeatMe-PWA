"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Button, message, Divider, Descriptions } from "antd";
import axios from "@/lib/axiosPrivate";
import DownloadButton from "../../../components/downloadReport";
import RoomPanel from "./roomPanel";

function TeacherAssignment({ rooms = [], date = new Date(), timeCode = "AN" }) {
	const [departments, setDepartments] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateTimeId, setDateTimeId] = useState(false);
	const [failedAssignments, setFailedAssignments] = useState([]);
	const [visibleDownloadButton, setVisibleDownloadButton] = useState(false);
	const [roomTeachers, setRoomTeachers] = useState({});
	const [fileName, setFileName] = useState(undefined);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/staff/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	const getDateTimeId = async (dateTime) => {
		try {
			const result = await axios.get("/api/staff/date-time-id/", {
				params: dateTime,
			});
			if (result.data) setDateTimeId(result.data.dateTimeId);
		} catch (error) {
			console.error(error);
			message.error("something went wrong while fetching dateTimeId!");
		}
	};

	useEffect(() => {
		loadDepartments();
		setDateTimeId(getDateTimeId({ date, timeCode }));
	}, []);

	const handleTeacherSelect = (roomId, teacherId) => {
		setRoomTeachers({
			...roomTeachers,
			[roomId]: teacherId,
		});
	};

	const handleAssign = async () => {
		if (Object.keys(roomTeachers).length === 0) {
			message.warning("No teachers to assign");
			return;
		}

		setIsSubmitting(true);

		try {
			const reqData = {
				...roomTeachers,
				dateTimeId: dateTimeId,
			};

			const response = await axios.post("/api/staff/staff/assign", reqData);

			if (response.data.error && response.data.failedAssignments) {
				// Handle failed assignments
				const { error, failedAssignments } = response.data;
				setFailedAssignments(failedAssignments);
				console.error("Error assigning teachers: ", error);
				message.error("Failed to assign some teachers.");
				// console.log("Failed Assignments:", failedAssignments);
			} else {
				message.success("Teachers assigned successfully!");
			}

			const { fileName } = response.data;

			setFileName(fileName);

			setVisibleDownloadButton(true);
		} catch (error) {
			console.error("Error assigning teachers: ", error);
			message.error("Failed to assign teachers.");
		}

		setIsSubmitting(false);
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Teacher Assignment</h2>
			<Collapse
				accordion
				collapsible="icon"
				items={rooms.map((room) => {
					return {
						key: room.id,
						label: (
							<RoomPanel
								room={room}
								departments={departments}
								handleTeacherSelect={handleTeacherSelect}
								roomTeachers={roomTeachers}
								isFailed={
									failedAssignments.length
										? failedAssignments.includes(room.id)
										: false
								}
							/>
						),
						children: (
							<div className="mb-4 p-4 border rounded-lg shadow">
								<Descriptions bordered column={1}>
									<Descriptions.Item label="Block ID">
										{room.blockId}
									</Descriptions.Item>
									<Descriptions.Item label="Floor">
										{room.floor}
									</Descriptions.Item>
								</Descriptions>
							</div>
						),
					};
				})}
			/>
			<Divider />
			<div className="flex gap-3">
				<Button
					type="primary"
					onClick={handleAssign}
					loading={isSubmitting}
				>
					Assign
				</Button>
				{visibleDownloadButton ? (
					<DownloadButton fileName={fileName} />
				) : null}
			</div>
		</div>
	);
}

export default TeacherAssignment;
