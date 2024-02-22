"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton } from "antd";
import axios from "@/lib/axiosPrivate";
import ErrorModel from "@/app/admin/components/errorModel";
import { FormOutlined } from "@ant-design/icons";
import Link from "next/link";

const requiredFields = [
	{ key: "id", value: "Block ID" },
	{ key: "name", value: "Block Name" },
];

function BlockPage() {
	const [data, setData] = useState([]);
	const [fileName, setFileName] = useState("courses");

	const handleSubmission = async (blocks) => {
		setData([]);
		const missingBlocks = blocks.filter((block) => {
			// Check if any of the required fields are missing for a block
			return !block.hasOwnProperty("name");
		});

		if (missingBlocks.length > 0) {
			message.error(`The following fields are required (Block Name)`);
			return;
		}

		try {
			const result = await axios.post("/api/admin/blockentry/block", {
				blocks,
			});
			if (result.status === 200) {
				message.success("Successfully submitted");
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			// console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with Block Id '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<Link href={"/admin/forms/block"}>
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
			{data.length ? (
				<ErrorModel data={data} setData={setData} fileName={fileName} />
			) : null}
		</div>
	);
}

export default BlockPage;
