"use client";

import React, { useState } from "react";
import { Button, Modal, Row, Col, Card, message } from "antd";
import axios from "@/lib/axiosPrivate";

const App = ({ data, setData }) => {
	const [loading, setLoading] = useState(false);
	const [singleLoadings, setSingleLoadings] = useState(
		new Array(data.length).fill(false),
	);
	const [open, setOpen] = useState(true);

	const showModal = () => {
		setOpen(true);
	};
	const handleOk = async () => {
		setLoading(true);

		try {
			const result = await axios.patch("/api/admin/student", data);
			if (result.data.length) {
				message.warning("unable to update some records");
				setData(result.data);
			} else {
				message.success("updated successfully");
				setData([]);
			}
		} catch (error) {
			message.error("update failed");
		}
		setLoading(false);
	};
	const handleCancel = () => {
		setOpen(false);
	};

	const updateSingle = async (record, index) => {
		const updatedLoadings = [...singleLoadings];
		updatedLoadings[index] = true;

		setSingleLoadings(updatedLoadings);

		try {
			const result = await axios.patch("/api/admin/student", [record]);
			if (result.data) {
				message.success("Single record updated successfully");
				const newData = [...data];
				newData.splice(index, 1);
				setData(newData);
			} else message.error("Single record update failed");
		} catch (error) {
			message.error("unknown error occurred");
		}

		updatedLoadings[index] = false;
		setSingleLoadings(updatedLoadings);
	};
	return (
		<>
			<Modal
				open={open}
				title="Title"
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="skip" onClick={handleCancel}>
						Skip
					</Button>,
					<Button
						key="update"
						type="primary"
						loading={loading}
						onClick={handleOk}
					>
						Update
					</Button>,
				]}
				closable={true}
			>
				{data.map((record, index) => (
					<Card key={index} className="my-4">
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<p className="font-bold mb-1">Found Student:</p>

								<p>ID: {record.foundStudent.id}</p>
								<p>
									Roll Number:{" "}
									{record.foundStudent.rollNumber}
								</p>
								<p>Semester: {record.foundStudent.semester}</p>
								<p>Name: {record.foundStudent.name}</p>
								<p>Email: {record.foundStudent.email}</p>
								<p>Phone: {record.foundStudent.phone}</p>
								<p>
									Program ID: {record.foundStudent.programId}
								</p>
								<p>
									Created At: {record.foundStudent.createdAt}
								</p>
								<p>
									Updated At: {record.foundStudent.updatedAt}
								</p>
							</Col>
							<Col span={12}>
								<p className="font-bold mb-1">Student:</p>

								<p>ID: {record.student.id}</p>
								<p>Roll Number: {record.student.rollNumber}</p>
								<p>Semester: {record.student.semester}</p>
								<p>Name: {record.student.name}</p>
								<p>Email: {record.student.email}</p>
								<p>Phone: {record.student.phone}</p>
								<p>Program ID: {record.student.programId}</p>
								<p>Created At: {record.student.createdAt}</p>
								<p>Updated At: {record.student.updatedAt}</p>
							</Col>
						</Row>
						<Button
							type="primary"
							ghost
							loading={singleLoadings[index]}
							onClick={() => updateSingle(record, index)} 
						>
							Update
						</Button>
					</Card>
				))}
			</Modal>
		</>
	);
};
export default App;
