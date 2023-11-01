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
	{ key: "aided", value: "Aided" },
	{ key: "department", value: "Department" },
	{ key: "duration", value: "Duration (years)" },
	{ key: "level", value: "Level (UG/PG)" },
];

function ProgramsPage() {
	const [data, setData] = useState([]);

	const handleSubmission = async (programs) => {
		setData([]);
		const missingPrograms = programs.filter((program) => {
			// Check if any of the required fields are missing for a program
			return !(
				program.hasOwnProperty("id") &&
				program.hasOwnProperty("name") &&
				program.hasOwnProperty("aided") &&
				program.hasOwnProperty("department") &&
				program.hasOwnProperty("duration") &&
				program.hasOwnProperty("level")
			);
		});

		if (missingPrograms.length > 0) {
			message.error(
				`The following fields are required (Program ID, Program Name, Aided, Department, Duration, Level)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/program", {
				programs,
			});
			if (result.status === 200) {
				message.success("Successfully submitted");
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Program ID '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
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
			/>
			{data.length ? <Model data={data} setData={setData} /> : null}
		</div>
	);
}

export default ProgramsPage;
