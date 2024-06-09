"use client";

import React, { useState } from "react";
import { message, FloatButton } from "antd";
import axios from "axios";
import ErrorModel from "@/app/staff/components/errorModel";
import Link from "next/link";
import { FormOutlined } from "@ant-design/icons";
import DragDrop from "../../components/dragDropXLSX";

const requiredFields = [
	{ key: "studentId", value: "register number" },
	{ key: "courseId", value: "Course ID" },
];

function Page() {
	const [failedRecords, setFailedRecords] = useState([]);

	const handleSubmission = async (students) => {
		const missingStudents = students.filter((student) => {
			return !(
				student.hasOwnProperty("id") && student.hasOwnProperty("studentId")
			);
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (studentId and CourseId)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/staff/student/supplementary", {
				students,
			});
			if (result.status === 200) {
				const { failedRecords } = result.data;
				if (failedRecords.length > 0)
					message.warning("Failed to import some records!");
				else message.success("Import Success");
				setFailedRecords(result.data.failedRecords);
			}
		} catch (error) {
			console.error(error.response.data);
			message.error("Something went wrong at the server! ");
		}
	};

	return (
		<div>
			<Link href={"/staff/student/insert"}>
				<FloatButton
					tooltip={<div>Form</div>}
					icon={<FormOutlined />}
					type="primary"
				/>
			</Link>
			<DragDrop requiredFields={requiredFields} records={handleSubmission} />
			{failedRecords.length ? (
				<ErrorModel
					failedRecords={failedRecords}
					setFailedRecords={setFailedRecords}
				/>
			) : null}
		</div>
	);
}

export default Page;
