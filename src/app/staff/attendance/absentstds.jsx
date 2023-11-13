'use client'

import React from "react";
import { message } from "antd";
import axios from "@/lib/axiosPrivate";
import { useEffect , useState } from "react";

function absentstds({ data, conform, setConform }) {
	const [submitted, setSubmitted] = useState(null)
	const absentees = data.filter((std) => !std.isPresent);
	const confirmpage = () => {
		setConform(!conform);
	};

	const success = () => {
		message.loading({
			content: 'Action in progress..',
			duration: 2.5,
		});

		setTimeout(() => {
			message.success('Loading finished', 2.5);
			message.info('Attendance Updated', 2.5);
		}, 2500);
	};

	useEffect(() => {
		try {
			if (typeof window !== 'undefined') {
				const submitted = localStorage.getItem("Submitted") || false;
				setSubmitted(submitted);
			}
		} catch (error) {
			setSubmitted(false);
		}
	}, []);

	const finished = async (absentstd) => {
		try {
			const result = await axios.post("/api/staff/attendance", absentstd);
			if (result.status === 200 || result.status === 201 || result.status === 204) {
				success();
				if (typeof window !== 'undefined') {
					localStorage.setItem("Submitted", true);
				}
			} else {
				message.error("Failed Updation ")
				return false;
			}
		} catch (error) {
			message.error("Error while making the request:", error.message);
		}
		return false;
	};

	return (
		<>
			<div>
				{absentees.length ? (
					absentees.map((student, index) => (
						<div
							className={` m-4 p-2 rounded-lg ${student.isPresent
								? "bg-green-800"
								: "bg-red-800"
								}`}
							key={index}
						>
							<div className="text-white font-serif ">
								<p>RegNo: {student.student.id}</p>
								<p>RollNo: {student.student.roll_number}</p>
								<p>Name: {student.student.name}</p>
								<p>SeatNumber: {student.seatNumber}</p>
								<p>
									Program:{" "}
									{
										student.exam.course.programCourses[0]
											.program.name
									}
								</p>
								<p> Course: {student.exam.course.name} </p>
							</div>
						</div>
					))
				) : (
					<div className="text-center text-green-800 text-3xl  mt-10 font-mono ">
						{" "}
						All are Present !!{" "}
					</div>
				)}
			</div>

			{
				submitted ? (<>
					<h1 className="text-2xl text-center font-bold  "   >Attendance marked and Submitted Succesfully  !!  </h1>



				</>) : (

					<>
						<div className="flex flex-row justify-between m-8 ">
							<button onClick={() => confirmpage()}> back</button>
							<button onClick={() => finished(absentees)}> Finish </button>
						</div>

					</>)
			}




		</>
	);
}

export default absentstds;
