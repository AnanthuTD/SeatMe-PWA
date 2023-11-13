"use client";
"use strict";

import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import Absentstds from "./absentstds";
import axios from "@/lib/axiosPrivate";
import Offduty from "../offduty";
import Stdlist from "./stdlist";

const onDuty = typeof window !== "undefined" ? localStorage.getItem("variableonDuty") : null;
const examinfo = typeof window !== "undefined" ? localStorage.getItem("examdetails") : null;
let roomid, dateid;

if (examinfo && examinfo.length > 0) {
	const examdetails = JSON.parse(examinfo);

	if (examdetails && examdetails[0]) {
		roomid = examdetails[0].roomId;
		dateid = examdetails[0].dateTime.id;
	}
}

function Page() {
	const [isAbsent, setIsAbsent] = useState(false);
	const [data, setData] = useState([]);
	const [conform, setConform] = useState(false);

	useEffect(() => {
		if (onDuty) {
			axios
				.get(`/api/staff/attendance/${roomid}/${dateid}`)
				.then((response) => {
					let std = response.data;
					setData(std);
				})
				.catch((error) => {
					if (error.response) {
						console.error("Server responded with status code:", error.response.status);
						console.error("Server response data:", error.response.data);
					} else {
						console.error("Request failed:", error.message);
					}
				});
		}
	}, [onDuty]);

	const confirmpage = () => {
		setConform(!conform);
	};

	if (onDuty) {
		if (conform) {
			return (
				<>
					<Navbar />
					<h1 className="text-center text-2xl text-gray-700 mt-5 ">
						Check and click <span className="text-blue-500">finish</span>
					</h1>
					<Absentstds data={data} conform={conform} setConform={setConform} />
				</>
			);
		} else {
			return (
				<>
					<Navbar />
					<Stdlist data={data} setData={setData} />
					<button
						className="ml-36 mt-5 mb-4 px-4 py-3 bg-blue-600 border-blue-600 rounded-3xl border-4"
						onClick={() => confirmpage()}
					>
						<p className="text-lg text-white">Submit</p>
					</button>
				</>
			);
		}
	} else {
		return (
			<>
				<Navbar />
				<Offduty />
			</>
		);
	}
}

export default Page;
