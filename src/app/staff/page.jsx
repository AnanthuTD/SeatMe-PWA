"use client";

import React from "react";
import Navbar from "./navbar";
import Calendar from "./calender";
import RoomDetails from "./roomDetails";
import Offduty from "./offduty";
import axios from "@/lib/axiosPrivate";
import { useState, useEffect } from "react";

function page() {
	const [onDuty, setOnDuty] = useState();
	const [examdetails, setExamDetails] = useState();

	useEffect(() => {
		localStorage.setItem("variableonDuty", onDuty);
		localStorage.setItem("examdetails", JSON.stringify(examdetails));

		axios
			.get("/api/staff")
			.then((response) => {
				let tchr = response.data;
				console.log(tchr);
				setExamDetails(tchr.examDetails);
				const onDutyValue = tchr.onDuty;
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

	return (
		<div>
			<Navbar />

			{onDuty ? (
				<div className="lg:flex flex-row gap-3 justify-center align-middle">
					<Calendar examdetails={examdetails} />
					<RoomDetails examdetails={examdetails} />
				</div>
			) : (
				<Offduty />
			)}
		</div>
	);
}

export default page;
