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
	{ key: "cols", value: "Columns" },
	{ key: "rows", value: "Rows" },
	{ key: "isOpenAvailable", value: "Is Available" },
	{ key: "floor", value: "Floor" },
	{ key: "blockId", value: "Block" },
];

function RoomsPage() {
	const [data, setData] = useState([]);

	const handleSubmission = async (rooms) => {
		setData([]);
		const missingRooms = rooms.filter((room) => {
			// Check if any of the required fields are missing for a room
			return !(
				room.hasOwnProperty("id") &&
				room.hasOwnProperty("cols") &&
				room.hasOwnProperty("rows") &&
				room.hasOwnProperty("isAvailable") &&
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
			const result = await axios.post("/api/admin/rooms", { rooms });
			if (result.status === 200) {
				message.success("Successfully submitted");
				setData(result.data);
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
			{data.length ? <Model data={data} setData={setData} /> : null}
		</div>
	);
}

export default RoomsPage;
