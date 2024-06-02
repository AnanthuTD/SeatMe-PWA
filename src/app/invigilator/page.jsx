"use client";

import React from "react";
import Navbar from "./navbar";
import Calendar from "./calender";
import RoomDetails from "./roomDetails";
import OffDuty from "./offDuty";
import axios from "@/lib/axiosPrivate";
import { useState, useEffect } from "react";

function page() {
	const [onDuty, setOnDuty] = useState();
	const [examDetails, setExamDetails] = useState(undefined);

	useEffect(() => {
		axios
			.get("/api/invigilator")
			.then((response) => {
				let staff = response.data;
				// console.log(staff);
				setExamDetails(staff.examDetails[0]);
				const onDutyValue = staff.onDuty;
				setOnDuty(onDutyValue);
			})
			.catch((error) => {
				if (error.response) {
					console.error(
						"Server responded with status code:",
						error.response.status,
					);
					console.error("Server response data:", error.response.data);
				} else {
					console.error("Request failed:", error.message);
				}
			});
	}, []);

	useEffect(() => {
		localStorage.setItem("onDuty", onDuty);
	}, [onDuty]);

	useEffect(() => {
		localStorage.setItem("examDetails", JSON.stringify(examDetails));
	}, [examDetails]);

	return (
		<div>
			<Navbar examinees={onDuty} />

			{onDuty ? (
				<div className="lg:flex flex-row gap-3 justify-center align-middle">
					<Calendar examDetails={examDetails} />
					<RoomDetails examDetails={examDetails} />
				</div>
			) : (
				<OffDuty />
			)}
		</div>
	);
}

export default page;
