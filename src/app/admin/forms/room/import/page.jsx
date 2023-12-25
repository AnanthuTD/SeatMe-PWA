"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import Model from "./model";
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

	const handleSubmission = async (rooms) => {
		setFailedRecords([]);
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
				const { failedRecords } = result.data;
				message.success("Successfully submitted");
				setFailedRecords(failedRecords);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Room ID '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
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
			/>
			{failedRecords.length ? <Model failedRecords={failedRecords} setFailedRecords={setFailedRecords} /> : null}
		</div>
	);
}

export default RoomsPage;
