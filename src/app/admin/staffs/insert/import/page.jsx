"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/axiosInstance";
import Model from "./model";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";


const requiredFields = [
	{ key: "departmentId", value: "Department id" },
	{ key: "designation", value: "Designation" },
	{ key: "id", value: "Register Number" },
	{ key: "name", value: "Name" },
	{ key: "phone", value: "Phone" },
	{ key: "email", value: "Email" },
];

function Page() {
	const [data, setData] = useState([]);

	const handleSubmission = async (staffs) => {
		setData([])
		const missingStudents = staffs.filter((staff) => {
			// Check if any of the required fields are missing for a student
			return !(
				staff.hasOwnProperty("departmentId") &&
				staff.hasOwnProperty("id") &&
				staff.hasOwnProperty("name")
			);
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (Department Id, Register Number, Name)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/staff", { staffs });
			if (result.status === 200) {
				message.success('successfully submitted');
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with register number '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<Link href={"/admin/staffs/insert"}>
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
			{data.length ? <Model data={data} setData={setData}/> : null}
		</div>
	);
}

export default Page;
