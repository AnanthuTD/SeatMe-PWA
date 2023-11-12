import React from "react";
import { message } from "antd";
import axios from "@/lib/axiosPrivate";
import { useState } from "react";

function absentstds({ data, conform, setConform }) {
	const absentees = data.filter((std) => !std.isPresent);
	const confirmpage = () => {
		setConform(!conform);
	};
	const [Submited , setSubmited] = useState(false);

	const finished = async (absentstd) => {
		try {
			const result = await axios.post("/api/staff/attendance", absentstd);
			if (result.status == 200) {
				//	message.success(result.data);
				setSubmited(true);
			} else {
				//	message.error(result.data)
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
							className={` m-4 p-2 rounded-lg ${
								student.isPresent
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

			<div className="flex flex-row justify-between m-8 ">
				<button onClick={() => confirmpage()}> back</button>
				<button onClick={() => finished(absentees)}> Finish </button>
			</div>
		</>
	);
}

export default absentstds;
