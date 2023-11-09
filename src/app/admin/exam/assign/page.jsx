"use client";
import React, { useState } from "react";
import RoomAssignmentForm from "./roomAssignmentForm";
import TeacherAssignment from "./teacherAssignment";

function Page() {
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedRooms, setSelectedRooms] = useState([]);

	return (
		<div>
			{isSuccess ? (
				<TeacherAssignment rooms={selectedRooms} />
			) : (
				<RoomAssignmentForm
					setIsSuccess={setIsSuccess}
					setSelectedRooms={setSelectedRooms}
				/>
			)}
		</div>
	);
}

export default Page;
