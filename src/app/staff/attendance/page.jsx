"use client";
"use strict";

import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import Absentees from "./absentees";
import axios from "@/lib/axiosPrivate";
import OffDuty from "../offDuty";
import StudentsList from "./studentsList";

function Page() {
	const [data, setData] = useState([]);
	const [teacherSeatId, setTeacherSeatId] = useState(undefined);
	const [conform, setConform] = useState(false);
	const [examDetails, setExamDetails] = useState(undefined);

	useEffect(() => {
		const onDuty =
			typeof window !== "undefined"
				? localStorage.getItem("onDuty")
				: null;
		const examInfo =
			typeof window !== "undefined"
				? localStorage.getItem("examDetails")
				: null;
		console.log(onDuty, examInfo);

		if (!onDuty || !examInfo || !examInfo.length) return;

		let roomId, dateId;

		try {
			const examDetails = JSON.parse(examInfo);
			setExamDetails(examDetails);

			if (examDetails) {
				roomId = examDetails.roomId;
				dateId = examDetails.dateTime.id;
				setTeacherSeatId(examDetails?.id);
			}
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return;
		}

		try {
			axios
				.get(`/api/staff/attendance/${roomId}/${dateId}`)
				.then((response) => {
					let std = response.data;
					setData(std);
				})
				.catch((error) => {
					if (error.response) {
						console.error(
							"Server responded with status code:",
							error.response.status,
						);
						console.error(
							"Server response data:",
							error.response.data,
						);
					} else {
						console.error("Request failed:", error.message);
					}
				});
		} catch (error) {
			console.error("Something went wrong!", error);
		}
	}, []);

	const confirmPage = () => {
		setConform(!conform);
	};

	if (data.length) {
		if (conform) {
			return (
				<>
					<Navbar attendance={!examDetails?.attendanceSubmitted} />
					<h1 className="text-center text-2xl text-gray-700 mt-5 ">
						Check and click{" "}
						<span className="text-blue-500">finish</span>
					</h1>
					<Absentees
						data={data}
						conform={conform}
						setConform={setConform}
						teacherSeatId={teacherSeatId}
						submitted={examDetails.attendanceSubmitted}
					/>
				</>
			);
		} else {
			return (
				<>
					<Navbar attendance={!examDetails?.attendanceSubmitted} />
					<StudentsList
						data={data}
						setData={setData}
						submitted={examDetails.attendanceSubmitted}
					/>
					<button
						className="ml-36 mt-5 mb-4 px-4 py-3 bg-blue-600 border-blue-600 rounded-3xl border-4"
						onClick={() => confirmPage()}
					>
						<p className="text-lg text-white">Submit</p>
					</button>
				</>
			);
		}
	} else {
		return (
			<>
				<Navbar attendance={!examDetails?.attendanceSubmitted} />
				<OffDuty />
			</>
		);
	}
}

export default Page;
