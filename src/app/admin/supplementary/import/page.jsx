"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import ImportErrorModel from "./model";
import Link from "next/link";
import { FormOutlined } from "@ant-design/icons";

const requiredFields = [
	{ key: "studentId", value: "register number" },
	{ key: "courseId", value: "Course ID" },
];

function Page() {
	const [failedRecords, setFailedRecords] = useState([]);

	const handleSubmission = async (students) => {
		const missingStudents = students.filter((student) => {
			return !(
				student.hasOwnProperty("id") &&
				student.hasOwnProperty("studentId")
			);
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (studentId and CourseId)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/student/supplementary", { students });
			if (result.status === 200) {
				const { failedRecords } = result.data;
				if (failedRecords.length > 0) message.warning("Failed to import some records!")
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
			<Link href={"/admin/student/insert"}>
				<FloatButton
					tooltip={<div>Form</div>}
					icon={<FormOutlined />}
					type="primary"
				/>
			</Link>
			<DragDrop
				requiredFields={requiredFields}
				records={handleSubmission}
			/>
			{failedRecords.length ? <ImportErrorModel failedRecords={failedRecords} setFailedRecords={setFailedRecords} /> : null}
		</div>
	);
}

export default Page;
