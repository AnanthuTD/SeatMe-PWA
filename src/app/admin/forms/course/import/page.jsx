"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/axiosInstance";
import Model from "./model";
import { FileExcelOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Course ID" },
	{ key: "name", value: "Course Name" },
	{ key: "semester", value: "Semester" },
	{ key: "isOpenCourse", value: "Is Open Course" },
];

function CoursesPage() {
	const [data, setData] = useState([]);

	const handleSubmission = async (courses) => {
		setData([]);
		const missingCourses = courses.filter((course) => {
			// Check if any of the required fields are missing for a course
			return !(
				course.hasOwnProperty("id") &&
				course.hasOwnProperty("name") &&
				course.hasOwnProperty("semester") &&
				course.hasOwnProperty("isOpenCourse")
			);
		});

		if (missingCourses.length > 0) {
			message.error(
				`The following fields are required (Course ID, Course Name, Semester, Is Open Course)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/courses", { courses });
			if (result.status === 200) {
				message.success("Successfully submitted");
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Course ID '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<Link href={"/admin/courses"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			<DragDrop
				requiredFields={requiredFields}
				records={handleSubmission}
			/>
			{data.length ? <Model data={data} setData={setData} /> : null}
		</div>
	);
}

export default CoursesPage;
