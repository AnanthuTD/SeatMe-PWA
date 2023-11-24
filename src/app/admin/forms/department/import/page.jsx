"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import Model from "./model";
import {FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Department ID" },
	{ key: "code", value: "Department Code" },
	{ key: "name", value: "Department Name" },
];

function DepartmentPage() {
	const [data, setData] = useState([]);

	const handleSubmission = async (departments) => {
		setData([]);
		const missingDepartments = departments.filter((department) => {
			// Check if any of the required fields are missing for a department
			return !(
				department.hasOwnProperty("id") &&
				department.hasOwnProperty("code") &&
				department.hasOwnProperty("name")
			);
		});

		if (missingDepartments.length > 0) {
			message.error(
				`The following fields are required (Department ID, Department Name)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/departmententry/department", {
				departments,
			});
			if (result.status === 200) {
				message.success("Successfully submitted");
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Department ID '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<Link href={"/admin/forms/department"}>
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

export default DepartmentPage;
