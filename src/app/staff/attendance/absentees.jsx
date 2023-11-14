'use client'

import React from "react";
import { message, Button } from "antd";
import axios from "@/lib/axiosPrivate";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Absentees({ data, conform, setConform, teacherSeatId }) {
	const absentees = data.filter((std) => !std.isPresent);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleConfirm = () => {
		setConform(!conform);
	};

	useEffect(() => {
		try {
			if (typeof window !== 'undefined') {
				const submitted = localStorage.getItem("Submitted") || false;
				console.log(submitted);
			}
		} catch (error) {
		}
	}, []);

	const finished = async (absentees) => {
		setLoading(true);
		try {
			const result = await axios.post(`/api/staff/attendance/${teacherSeatId}`, absentees);
			
			if (result.status === 200 || result.status === 201 || result.status === 204) {
				if (typeof window !== 'undefined') {
					localStorage.setItem("Submitted", true);
				}
				setLoading(false);
				message.success('Attendance submitted successfully!');
				router.replace('/staff/');
			} else {
				message.error('Failed Updation');
			}
		} catch (error) {
			message.error(`Error while making the request: ${error.message}`);
		}
		setLoading(false);
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

			{false ? (<>
				<h1 className="text-2xl text-center font-bold  "   >Attendance marked and Submitted Succesfully  !!  </h1>
			</>) : (
				<>
					<div className="flex flex-row justify-between m-8 ">
						<Button onClick={() => handleConfirm()}> back</Button>
						<Button loading={loading} onClick={() => finished(absentees)}> Finish </Button>
					</div>
				</>)
			}
		</>
	);
}

export default Absentees;
