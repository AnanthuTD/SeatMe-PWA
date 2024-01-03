import React from "react";
import { Button, Modal, Row, Col, Card, Typography } from "antd";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;

const ImportErrorModel = ({ failedRecords = [], setFailedRecords = () => { } }) => {
	const handleOk = async () => {
		setFailedRecords([]);
	};

	const handleCancel = () => {
		setFailedRecords([]);
	};

	const downloadToXLSX = () => {
		const data = failedRecords.map((record) => ({
			studentId: record?.studentId,
			courseId: record?.courseId,
			Error: record?.error
		}));

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "FailedRecords");

		XLSX.writeFile(wb, 'supplementary-failed-records.xlsx');

	};

	return (
		<>
			<Modal
				open={true}
				title={
					<Row justify="space-between" align="middle">
						<Col xs={24} sm={18}>
							<Title level={3} type="danger">
								Some data have not been updated or inserted
							</Title>
						</Col>
						<Col xs={24} sm={6}>
							<Button type="primary" onClick={downloadToXLSX}>
								Download XLSX
							</Button>
						</Col>
					</Row>
				}
				onOk={handleOk}
				onCancel={handleCancel}
				closable={true}
				footer={[
					<Button key="ok" type="primary" onClick={handleOk}>
						OK
					</Button>,
				]}
				width={1000}
			>
				{failedRecords.map((record, index) => {
					return (
						<Card key={index} className="my-4">
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<p>ID: {record?.id}</p>
									<p>Roll Number: {record?.rollNumber}</p>
									<p>Semester: {record?.semester}</p>
									<p>Name: {record?.name}</p>
									<p>Email: {record?.email}</p>
									<p>Phone: {record?.phone}</p>
									<p>Program ID: {record?.programId}</p>
									<Text type="danger">{record?.error}</Text>
								</Col>
							</Row>
						</Card>
					);
				})}
			</Modal>
		</>
	);
};

export default ImportErrorModel;
