"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import Model from "./model";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Program ID" },
	{ key: "name", value: "Program Name" },
	{ key: "isAided", value: "Aided" },
	{ key: "departmentCode", value: "Department Code" },
	{ key: "duration", value: "Duration (years)" },
	{ key: "level", value: "Level (UG/PG)" },
	{ key: "abbreviation", value: "Abbreviation" },
];

function ProgramsPage() {
	const [failedRecords, setFailedRecords] = useState([]);
	const [fileName, setFileName] = useState('program')

	const handleSubmission = async (programs) => {
		const missingPrograms = programs.filter((program) => {
			// Check if any of the required fields are missing for a program
			return !(
				program.hasOwnProperty("id") &&
				program.hasOwnProperty("name") &&
				program.hasOwnProperty("isAided") &&
				program.hasOwnProperty("departmentCode") &&
				program.hasOwnProperty("duration") &&
				program.hasOwnProperty("abbreviation") &&
				program.hasOwnProperty("level")
			);
		});

		if (missingPrograms.length > 0) {
			message.error(
				`The following fields are required (Program ID, Program Name, Aided, Department, Duration,Abbreviation, Level)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/programentry/program", { programs });
			if (result.status === 200) {
				message.success("Import Success");
				setFailedRecords(result.data.failedRecords);
				console.error(result.data.failedRecords);
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
			<Link href={"/admin/forms/program"}>
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
			{failedRecords.length ? <Model failedRecords={failedRecords} setFailedRecords={setFailedRecords} fileName={fileName}/> : null}
		</div>
	);
}

export default ProgramsPage;
