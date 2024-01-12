import React from "react";
import { Button, Modal, Row, Col, Card, Typography } from "antd";
import * as XLSX from "xlsx";

const { Text, Title } = Typography;

const ErrorModel = ({ failedRecords = [], setFailedRecords = () => { }, fileName }) => {
	const handleOk = async () => {
		setFailedRecords([]);
	};

	const handleCancel = () => {
		setFailedRecords([]);
	};

	const downloadToXLSX = () => {

		const ws = XLSX.utils.json_to_sheet(failedRecords);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "FailedRecords");

		XLSX.writeFile(wb, `${fileName}-failed-records.xlsx`);

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
				{failedRecords.map((failedRecord, index) => {
					return (
						<Card key={index} className="my-4">
							<Row gutter={[16, 16]}>
								<Col span={12}>
									{Object.entries(failedRecord).map(([key, value]) => (
										(key?.toLowerCase() === 'error') ? (
											<Text type="danger" key={key}>
												<strong>{key}:</strong> {value}
											</Text>
										) : (
											<p key={key}>
												<strong>{key}:</strong> {value}
											</p>
										)
									))}
								</Col>
							</Row>
						</Card>
					);
				})}

			</Modal>
		</>
	);
};

export default ErrorModel;
