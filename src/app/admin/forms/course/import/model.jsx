import React from "react";
import { Button, Modal, Row, Col, Card, Typography } from "antd";

const { Text, Title } = Typography;

const CoursesModel = ({ failedRecords, setFailedRecords, loading, setLoading }) => {
	const handleOk = async () => {
		setFailedRecords([]);
	};

	const handleCancel = () => {
		setFailedRecords([]);
	};

	return (
		<>
			<Modal
				open={true}
				title={<Title level={3} type="danger">Some data have not been updated or inserted</Title>}
				onOk={handleOk}
				onCancel={handleCancel}
				closable={true}
				footer={[
					<Button key="ok" type="primary" loading={loading} onClick={handleOk}>
						OK
					</Button>,
				]}
				width={1000}
			>

				{failedRecords.map((failedRecord, index) => {
					const { record, error } = failedRecord;
					return (
						<Card key={index} className="my-4">
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<p className="font-bold mb-1">Course Info:</p>

									<p>Course ID: {record.id}</p>
									<p>Course Name: {record.name}</p>
									<p>Semester: {record.semester}</p>
									<p>Type: {record.type}</p>
									<Text type="danger">{error}</Text>
								</Col>
							</Row>
						</Card>
					);
				})}
			</Modal>
		</>
	);
};

export default CoursesModel;
