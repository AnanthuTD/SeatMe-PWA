"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "axios";
import ErrorModel from "@/app/staff/components/errorModel";
import Link from "next/link";
import { FormOutlined } from "@ant-design/icons";

const requiredFields = [
	{ key: "programId", value: "program id" },
	{ key: "semester", value: "semester" },
	{ key: "id", value: "register number" },
	{ key: "rollNumber", value: "roll number" },
	{ key: "name", value: "name" },
	{ key: "phone", value: "phone" },
	{ key: "email", value: "email" },
	{ key: "secondLang_1", value: "Second Language Sem 1" },
	{ key: "secondLang_2", value: "Second Language Sem 2" },
];

function Page() {
	const [failedRecords, setFailedRecords] = useState([]);
	const [fileName, setFileName] = useState("students");

	const handleSubmission = async (students) => {
		const missingStudents = students.filter((student) => {
			return !(
				student.hasOwnProperty("semester") &&
				student.hasOwnProperty("id") &&
				student.hasOwnProperty("rollNumber") &&
				student.hasOwnProperty("name")
			);
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (program, semester, id, rollNumber, name)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/staff/student", { students });
			if (result.status === 200) {
				message.success("Import Success");
				console.error("failedRecords: ", result.data);
				const { failedRecords } = result.data;
				setFailedRecords(failedRecords);
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

export default Page;
