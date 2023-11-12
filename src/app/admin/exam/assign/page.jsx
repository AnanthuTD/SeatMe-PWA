"use client";
import React, { useState } from "react";
import RoomAssignmentForm from "./roomAssignmentForm";
import TeacherAssignment from "./teacherAssignment";

function Page() {
	const [dateTime, setDateTime] = useState(undefined);
	const [selectedRooms, setSelectedRooms] = useState([]);
	const [roomTeachers, setRoomTeachers] = useState({});
	const [assignTeachers, setAssignTeachers] = useState(false);

	return (
		<div>
			{/* date is set when students are assigned seats successfully. */}
			{assignTeachers ? (
				<TeacherAssignment
					rooms={selectedRooms}
					roomTeachers={roomTeachers}
					setRoomTeachers={setRoomTeachers}
					date={dateTime}
				/>
			) : (
				<RoomAssignmentForm
					setDateTime={setDateTime}
					setSelectedRooms={setSelectedRooms}
					setAssignTeachers={setAssignTeachers}
				/>
			)}
		</div>
	);
}

export default Page;
