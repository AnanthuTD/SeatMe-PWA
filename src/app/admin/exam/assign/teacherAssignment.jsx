import React, { useEffect, useState } from "react";
import { Collapse, Button, message, Divider } from "antd";
import axios from "@/lib/axiosPrivate";
import RoomPanel from "./roomPanel";
import DownloadButton from "./download";

function TeacherAssignment({
	rooms = [],
	roomTeachers = {},
	setRoomTeachers = () => {},
	dateTime = { date: new Date(), timeCode: "AN" },
}) {
	const [departments, setDepartments] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateTimeId, setDateTimeId] = useState(false);
	const [failedAssignments, setFailedAssignments] = useState([]);
	const [visibleDownloadButton, setVisibleDownloadButton] = useState(false);

	const pdfFileName = `${dateTime.date.toISOString().split("T")[0]}-${
		dateTime.timeCode
	}.pdf`;

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/admin/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	const getDateTimeId = async (dateTime) => {
		try {
			const result = await axios.get("/api/admin/date-time-id/", {
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
		setDateTimeId(getDateTimeId(dateTime));
	}, []);

	useEffect(() => {
		console.log(JSON.stringify(roomTeachers, null, 2));
	}, [roomTeachers]);

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
			const response = await axios.post(
				"/api/admin/exams/assign-teacher",
				reqData,
			);
			if (response.data.error && response.data.failedAssignments) {
				// Handle failed assignments
				const { error, failedAssignments } = response.data;
				setFailedAssignments(failedAssignments);
				console.error("Error assigning teachers: ", error);
				message.error("Failed to assign some teachers.");
				console.log("Failed Assignments:", failedAssignments);
			} else {
				message.success("Teachers assigned successfully!");
			}
			setVisibleDownloadButton(true);
		} catch (error) {
			console.error("Error assigning teachers: ", error);
			message.error("Failed to assign teachers.");
		}

		setIsSubmitting(false);
	};

	const Items = rooms.map((room) =>
		RoomPanel({
			room,
			departments,
			roomTeachers,
			handleTeacherSelect,
			isFailed: failedAssignments.length
				? failedAssignments.includes(room.id)
				: false,
		}),
	);

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Teacher Assignment</h2>
			<Collapse accordion collapsible="icon" items={Items} />
			<Divider />
			<Button
				type="primary"
				onClick={handleAssign}
				loading={isSubmitting}
			>
				Assign
			</Button>
			{visibleDownloadButton ? (
				<DownloadButton fileName={pdfFileName} />
			) : null}
		</div>
	);
}

export default TeacherAssignment;
