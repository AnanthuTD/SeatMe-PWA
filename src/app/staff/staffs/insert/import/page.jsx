"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton, List, Modal, Divider } from "antd";
import axios from "@/lib/axiosPrivate";
import ErrorModel from "@/app/staff/components/errorModel";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "departmentCode", value: "Department Code" },
	{ key: "designation", value: "Designation" },
	{ key: "id", value: "Staff Code" },
	{ key: "name", value: "Name" },
	{ key: "phone", value: "Phone" },
	{ key: "email", value: "Email" },
	{ key: "password", value: "Password" },
];

function Page() {
	const [failedRecords, setFailedRecords] = useState([]);
	const [loading, setLoading] = useState(false);
	const [fileName, setFileName] = useState("staffs");

	const handleSubmission = async (staffs) => {
		setLoading(true);
		const missingStudents = staffs.filter((staff) => {
			// Check if any of the required fields are missing for a student
			return !(
				staff.hasOwnProperty("departmentCode") &&
				staff.hasOwnProperty("id") &&
				staff.hasOwnProperty("password") &&
				staff.hasOwnProperty("name")
			);
		});

		if (missingStudents.length > 0) {
			setLoading(false);
			message.error(
				`The following fields are required (Department Id, Register Number, Name)`,
			);
			return;
		}

		try {
			const response = await axios.post("/api/staff/staff", { staffs });

			if (response.status === 200) {
				const result = response.data;
				if (result.status === 201) {
					message.success("Successfully submitted");
				}
			}
		} catch (error) {
			const { data, status } = error.response;

			const { uncreatedStaffs } = data;
			setFailedRecords(uncreatedStaffs);

			if (status === 400) {
				message.error(data.message);
			} else if (status === 409) {
				message.error(data.message);
			} else {
				message.error("Something went wrong.");
				console.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div>
				<Link href={"/staff/staffs/insert"}>
					<FloatButton
						tooltip={<div>Form</div>}
						icon={<FormOutlined />}
						type="primary"
					/>
				</Link>
				<DragDrop
					requiredFields={requiredFields}
					records={handleSubmission}
					loading={loading}
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
		</>
	);
}

export default Page;
