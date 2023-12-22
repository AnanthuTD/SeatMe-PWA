"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import ImportErrorModel from "./model";
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
];

function Page() {
	const [failedRecords, setFailedRecords] = useState([]);

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
			const result = await axios.post("/api/admin/student", { students });
			if (result.status === 200) {
				message.success("Import Success");
				setFailedRecords(result.data);
				console.error(result.data);
			} else {
				const { error } = result.data;
				message.error("Import Failed! ", error);
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
