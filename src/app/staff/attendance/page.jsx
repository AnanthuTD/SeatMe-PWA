"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import { Button } from "antd";

function page() {
	let std = [
		{
			id: 1,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 2,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 3,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 4,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 5,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 6,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 7,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 8,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 9,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 10,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
	];
	const [isAbsent, setIsAbsent] = useState(false);
	const [data, setData] = useState(std);

	const absent = (index) => {
		data[index].isPresent = !data[index].isPresent;
		setData([...data]);
	};

	return (
		<>
			<Navbar />
			<div className="flex lg:flex-row gap-4  sm:flex-col lg:mt-14 flex-wrap sm:mt-8">
				{data.map((student, index) => (
					<div
						className={` m-4 p-2 rounded-lg ${
							student.isPresent ? "bg-green-500" : "bg-red-500"
						}`}
					>
						<div className="flex flex-row items-center  justify-between">
							<div className="text-blue-800">
								<p>ID : {student.id} </p>
								<p>Name : {student.name}</p>
								<p>Program : {student.program}</p>
								<span>
									{" "}
									Row : {student.row} col:{student.column}{" "}
								</span>
							</div>
							<Button
								danger
								className=" hover:bg-red-600 hover:text-white "
								onClick={() => absent(index)}
							>
								Absent
							</Button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default page;
