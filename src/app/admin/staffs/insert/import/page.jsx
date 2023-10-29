"use client";

import React, { useState } from "react";
import DragDrop from "../../../components/dragDropXLSX";
import { message, FloatButton, List, Modal, Divider } from "antd";
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
	const [uncreatedStaffs, setUncreatedStaffs] = useState([]);
	const [duplicateStaffs, setDuplicateStaffs] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);

	const showModal = () => {
		setModalVisible(true);
	};

	const handleSubmission = async (staffs) => {
		setData([]);
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
			const response = await axios.post("/api/admin/staff", { staffs });

			if (response.status === 200) {
				const result = response.data;
				if (result.status === 201) {
					message.success("Successfully submitted");
				}
			}
		} catch (error) {
			const { data, status } = error.response;
			
			console.log('data received : ' , data);
			const { uncreatedStaffs, duplicateStaffs } = data;


			if (status === 400) {
				message.error(data.message);
			} else if (status === 409) {
				message.error(data.message);
				setUncreatedStaffs(uncreatedStaffs);
				setDuplicateStaffs(duplicateStaffs);
				showModal();
			} else {
				message.error("Something went wrong.");
				console.error(error);
			}
		}
	};

	const modalContent = (
		<>
			<List
				header={<div>Duplicate Staffs :</div>}
				dataSource={duplicateStaffs}
				renderItem={(record) => (
					<List.Item>
						{/* Display the record data as needed */}
						<div>{record.id}</div>
						<div>{record.name}</div>
						<div>{record.email}</div>
						<div>{record.department}</div>
						<div>{record.phone}</div>
						{/* Add more fields as needed */}
					</List.Item>
				)}
			/>
			<Divider />
			<List
				header={<div>unCreated Staffs (due to some error on insert) :</div>}
				dataSource={uncreatedStaffs}
				renderItem={(record) => (
					<List.Item>
						{/* Display the record data as needed */}
						<div>{record.id}</div>
						<div>{record.name}</div>
						<div>{record.email}</div>
						<div>{record.department}</div>
						<div>{record.phone}</div>
						{/* Add more fields as needed */}
					</List.Item>
				)}
			/>
		</>
	);

	return (
		<>
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
				{data.length ? <Model data={data} setData={setData} /> : null}
			</div>
			<Modal
				title="Duplicate or Uninserted Records"
				open={modalVisible}
				onOk={() => setModalVisible(false)}
				onCancel={() => setModalVisible(false)}
				footer={null}
			>
				{modalContent}
			</Modal>
		</>
	);
}

export default Page;
