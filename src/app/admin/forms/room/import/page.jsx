"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import ErrorModel from "@/app/admin/components/errorModel";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Room ID" },
	{ key: "internalCols", value: "Internal Columns" },
	{ key: "internalRows", value: "Internal Rows" },
	{ key: "finalCols", value: "Final Columns" },
	{ key: "finalRows", value: "Final Rows" },
	{ key: "isAvailable", value: "Is Available" },
	{ key: "floor", value: "Floor" },
	{ key: "blockId", value: "Block" },
	{ key: "description", value: "Description" },
];

function RoomsPage() {
	const [failedRecords, setFailedRecords] = useState([]);
	const [fileName, setFileName] = useState('room')

	const handleSubmission = async (rooms) => {
		const missingRooms = rooms.filter((room) => {
			// Check if any of the required fields are missing for a room
			return !(
				room.hasOwnProperty("id") &&
				room.hasOwnProperty("internalCols") &&
				room.hasOwnProperty("internalRows") &&
				room.hasOwnProperty("finalCols") &&
				room.hasOwnProperty("finalRows") &&
				room.hasOwnProperty("floor") &&
				room.hasOwnProperty("blockId")
			);
		});

		if (missingRooms.length > 0) {
			message.error(
				`The following fields are required (Room ID, Columns, Rows, Is Available, Floor, Block)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/rooms", rooms);
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
			<Link href={"/admin/forms/room"}>
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
			{failedRecords.length ? <ErrorModel failedRecords={failedRecords} setFailedRecords={setFailedRecords} fileName={setFileName}/> : null}
		</div>
	);
}

export default RoomsPage;
