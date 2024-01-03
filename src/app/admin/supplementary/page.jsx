'use client';
import React, { useState } from 'react';
import { Form, InputNumber, Button, Space, Divider, ConfigProvider, Row, Col, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DepProSemCouSelect from '../components/depProSemCouSelect';
import axios from '@/lib/axiosPrivate';
import DepProSemExaSelect from '../components/depProSemExaSelect';
import ErrorModel from './errorModel';

const Page = () => {

    return (<ConfigProvider
        theme={{
            components: {
                InputNumber: {
                    controlWidth: 140
                },
            },
        }}
    >
        <DynamicForm />
    </ConfigProvider>)
}

const DynamicForm = () => {
    const [form] = Form.useForm();
    const [courseIds, setCourseIds] = useState([])
    const [failedRecords, setFailedRecords] = useState([])

    const handleCourseId = (values) => {
        const courseIds = values.courses.map(c => c.id);
        setCourseIds(courseIds);
    }

    return (
        <>
            <DepProSemExaSelect value={handleCourseId} />
            <Divider />
            <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                autoComplete="off"
                onValuesChange={handleValuesChange}
                initialValues={{ studentIds: [{}] }}
                form={form}
            >
                <Form.List name="studentIds">
                    {(fields, { add, remove }) => (
                        <>
                            <Row gutter={[16, 16]}>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={key}>
                                        <Space align="baseline" style={{ marginBottom: 8 }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'id']}
                                            >
                                                <InputNumber
                                                    min={100000000000}
                                                    max={999999999999}
                                                    formatter={value => `${value}`}
                                                    parser={value => value.replace(/\D/g, '')}
                                                />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    </Col>
                                ))}
                            </Row>
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                >
                                    Add Students
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            {failedRecords.length ? <ErrorModel failedRecords={failedRecords} setFailedRecords={setFailedRecords} /> : null}
        </>
    );

    async function onFinish(values) {
        const studentIds = values.studentIds.map(studentId => studentId.id)
        try {
            const response = await axios.post('/api/admin/student/supplementary', { courseIds, studentIds });
            const { failedRecords } = response.data;
            if (failedRecords.length > 0) message.warning("Failed to import some records!")
            else message.success("Import Success");
            setFailedRecords(failedRecords);
        } catch (error) {
            console.error(error);
            message.error('An error occurred at the server!')
        }
    }

    function handleValuesChange(changedValues, allValues) {
        const lastFieldIndex = allValues.studentIds.length - 1;
        const lastField = allValues.studentIds[lastFieldIndex];

        if (lastField?.id && changedValues.studentIds[lastFieldIndex]) {
            // const idLength = String(lastField.id).length;
            // if (idLength === 12)
            addField();
        }
    }

    function addField() {
        const { setFieldsValue, getFieldValue } = form;
        const newFields = [...getFieldValue('studentIds')];
        newFields.push({ id: '' });
        setFieldsValue({
            studentIds: newFields,
        });
    }
};

export default Page;
