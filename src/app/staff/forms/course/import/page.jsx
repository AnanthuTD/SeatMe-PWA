"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import ErrorModel from "@/app/staff/components/errorModel";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Course Code" },
	{ key: "name", value: "Course" },
	{ key: "semester", value: "Semester" },
	{ key: "type", value: "Type" },
	{ key: "programId", value: "Program Id" },
];

function CoursesPage() {
	const [failedRecords, setFailedRecords] = useState([]);
	const [fileName, setFileName] = useState("courses");

	const handleSubmission = async (courses) => {
		const missingCourses = courses.filter((course) => {
			// Check if any of the required fields are missing for a course
			return !(
				course.hasOwnProperty("id") &&
				course.hasOwnProperty("name") &&
				course.hasOwnProperty("semester") &&
				course.hasOwnProperty("programId")
			);
		});

		if (missingCourses.length > 0) {
			message.error(
				`The following fields are required (Course ID, Course Name, Semester, Is Open Course)`,
			);
			return;
		}

		const processedCourses = courses.map((course) => {
			if (course.hasOwnProperty("type")) {
				const typeWords = course.type.split(" ");
				const modifiedType = typeWords[0];
				return {
					...course,
					type: modifiedType || null,
				};
			}
			return course || null;
		});

		// console.log(processedCourses);

		try {
			const result = await axios.post("/api/staff/course-entry/course", {
				courses: processedCourses,
			});
			if (result.status === 200) {
				message.success("Successfully submitted");
				// console.log(result.data);
				setFailedRecords(result.data.failedRecords);
			} else message.error("Submit failed");
		} catch (error) {
			// console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Course ID '${error.response.data.value}' already exists`,
				);
			} else if (error.response.status === 500) {
				message.error(
					`Record with Course ID '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<Link href={"/staff/forms/course"}>
				<FloatButton
					tooltip={<div>Form</div>}
					icon={<FormOutlined />}
					type="primary"
				/>
			</Link>
			<DragDrop
				requiredFields={requiredFields}
				records={handleSubmission}
				fileName={setFileName}
			/>
			{failedRecords.length ? (
				<ErrorModel
					failedRecords={failedRecords}
					setFailedRecords={setFailedRecords}
					fileName={fileName}
				/>
			) : null}
		</div>
	);
}

export default CoursesPage;
