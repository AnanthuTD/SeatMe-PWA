"use client";

import React, { useState } from "react";
import { message, Modal } from "antd";
import ImportErrorModel from "./errorModel";
import DragDrop from "../../components/dragDropXLSX";

const requiredFields = [{ key: "id", value: "register number" }];

function ImportModel({ setDisplayImport = () => {}, onFinish = () => {} }) {
	const [failedRecords, setFailedRecords] = useState([]);
	const [fileName, setFileName] = useState("supplementary");

	const handleSubmission = async (studentIds) => {
		const missingStudents = studentIds.filter((student) => {
			return !student.hasOwnProperty("id");
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (register number)`,
			);
			return;
		}

		onFinish(studentIds);

		setDisplayImport(false);
	};

	return (
		<div>
			<Modal
				title="Import Students"
				open={true}
				onCancel={() => setDisplayImport(false)}
				footer={null}
				width={1000}
			>
				<DragDrop
					requiredFields={requiredFields}
					records={handleSubmission}
					fileName={setFileName}
				/>
			</Modal>
			{failedRecords.length ? (
				<ImportErrorModel
					failedRecords={failedRecords}
					setFailedRecords={setFailedRecords}
					fileName={fileName}
				/>
			) : null}
		</div>
	);
}

export default ImportModel;
