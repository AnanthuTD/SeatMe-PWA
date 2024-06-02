"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axiosPrivate";
import { message } from "antd";
import ProgramList from "./programList";

export default function Page({ params }) {
	const [data, setData] = useState(undefined);
	const { examId } = params;

	const loadPrograms = async () => {
		try {
			const result = await axios.get(`/api/staff/exams/${params.examId}`);
			const { course } = result.data || {};
			const {
				programs,
				semester,
				name: courseName,
				id: courseId,
			} = course || { programs: [], semester: undefined };

			setData({ programs, semester, courseName, courseId });
		} catch (error) {
			if (error.response && error.response.status !== 403) {
				message.error("Something went wrong!");
			}
			console.error("API call failed:", error);
		}
	};

	useEffect(() => {
		loadPrograms();
	}, []);

	return data ? (
		<div className="py-4">
			<ProgramList data={data} examId={examId} />{" "}
		</div>
	) : null;
}
