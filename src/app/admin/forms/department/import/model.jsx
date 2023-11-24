import React, { useState } from "react";
import { Button, Modal, Row, Col, Card, message } from "antd";
import axios from "@/lib/axiosPrivate";

const DepartmentModel = ({ data, setData }) => {
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
			const result = await axios.patch("/api/admin/departmententry/departmentupdate", data);
			if (result.data.length) {
				message.warning("Unable to update some records");
				setData(result.data);
			} else {
				message.success("Updated successfully");
				setData([]);
			}
		} catch (error) {
			message.error("Update failed");
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
			const result = await axios.patch("/api/admin/department", [record]);
			if (result.data) {
				message.success("Single record updated successfully");
				const newData = [...data];
				newData.splice(index, 1);
				setData(newData);
			} else message.error("Single record update failed");
		} catch (error) {
			message.error("Unknown error occurred");
		}

		updatedLoadings[index] = false;
		setSingleLoadings(updatedLoadings);
	};

	return (
		<>
			<Modal
				open={open}
				title="Department Model"
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
								<p className="font-bold mb-1">
									Department Info:
								</p>

								<p>Department ID: {record.id}</p>
								<p>Department Name: {record.name}</p>
								{/* Add more fields as needed */}
							</Col>
							{/* You can add more columns as required */}
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

export default DepartmentModel;
