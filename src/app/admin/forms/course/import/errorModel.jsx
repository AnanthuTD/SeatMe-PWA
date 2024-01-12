import React from "react";
import { Button, Modal, Row, Col, Card, Typography } from "antd";
import * as XLSX from "xlsx";

const { Text, Title } = Typography;

const CoursesModel = ({ failedRecords = [], setFailedRecords = () => { }, fileName }) => {
    const handleOk = async () => {
        setFailedRecords([]);
    };

    const handleCancel = () => {
        setFailedRecords([]);
    };

    const downloadToXLSX = () => {
        const data = failedRecords.map((record) => ({
            ID: record?.id,
            Name: record?.name,
            ProgramId: record?.programId,
            Semester: record?.semester,
            Type: record?.type,
            error: record?.error
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "FailedRecords");

        // Use the correct bookType value "blob"
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
                                    <p className="font-bold mb-1">Course Info:</p>
                                    <p>Course ID: {failedRecord?.id}</p>
                                    <p>Course Name: {failedRecord?.name}</p>
                                    <p>Course Name: {failedRecord?.programId}</p>
                                    <p>Semester: {failedRecord?.semester}</p>
                                    <p>Type: {failedRecord?.type}</p>
                                    <Text type="danger">{failedRecord?.error}</Text>
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
