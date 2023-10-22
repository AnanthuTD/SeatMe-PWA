"use client";

import React, { useState } from "react";
import { Button, Modal, Row, Col, Card } from "antd";

const App = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(true);
    
	const showModal = () => {
		setOpen(true);
	};
	const handleOk = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setOpen(false);
		}, 3000);
	};
	const handleCancel = () => {
		setOpen(false);
	};
	return (
		<>
			<Modal
				open={open}
				title="Title"
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
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
					</Card>
				))}
			</Modal>
		</>
	);
};
export default App;
