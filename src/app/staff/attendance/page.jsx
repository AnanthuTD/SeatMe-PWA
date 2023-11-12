"use client";
"use strict";

import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { Button } from "antd";
import Absentstds from "./absentstds";
import Link from "next/link";
import axios from "@/lib/axiosPrivate";

import Stdlist from "./stdlist";
const onDuty = localStorage.getItem("variableonDuty");
const examinfo = localStorage.getItem("examdetails");

function page() {
	const [isAbsent, setIsAbsent] = useState(false);
	const [data, setData] = useState([]);
	const [conform, setConform] = useState(false);
	const examdetails = JSON.parse(examinfo);
	console.log(examdetails);

	const roomid = examdetails[0].roomId;
	const dateid = examdetails[0].dateTime.id;
	console.log(roomid, dateid);
	useEffect(() => {
		axios
			.get(`/api/staff/attendance/${roomid}/${dateid}`)
			.then((response) => {
				let std = response.data;
				console.log(std);
				setData(std);
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

	const confirmpage = () => {
		setConform(!conform);
	};

	return (
		<>
			<Navbar />
			{conform ? (
				<>
					<h1 className="text-center text-2xl text-gray-700  mt-5 ">
						Check and click{" "}
						<span className="text-blue-500">finish</span>
					</h1>
					<Absentstds
						data={data}
						conform={conform}
						setConform={setConform}
					/>
				</>
			) : (
				<>
					<Stdlist data={data} setData={setData} />
					<button
						className=" ml-36 mt-5 mb-4  px-4 py-3 bg-blue-600 border-blue-600  rounded-3xl border-4 "
						onClick={() => confirmpage()}
					>
						<p className="text-lg  text-white  "> Submit</p>
					</button>
				</>
			)}
		</>
	);
}

export default page;
