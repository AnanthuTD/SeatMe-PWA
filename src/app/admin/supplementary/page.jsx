'use client'

import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    Row,
    Col,
    Form,
    Divider,
    Card,
    message,
    Alert,
    FloatButton,
    Table,
    Select
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Link from "next/link";

const Page = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);

    const handleSubmission = async (values) => {
        console.log("Submitted values:", values);

        /*   try {
              const result = await axios.post("/api/admin/blockentry/Student", {
                  blocks: values.blocks,
              });
              if (result.status === 200) {
                  message.success(result.message);
                  setError(null); // Clear any previous errors
              } else message.error("Submit failed");
          } catch (error) {
              console.log(error);
              if (error.response.status === 400) {
                  message.error(
                      `Student with ID '${error.response.data.value}' already exists`,
                  );
              } else {
                  setError("Something went wrong. Please try again."); // Set the error message
              }
          } */
    };

    /*  const loadCourses = (values) => {
     
         const { students } = values || { students: [] };
 
         const indexAndNonEmptyArray = students.reduce((acc, student, index) => {
             if (!acc.found && student && student.length > 0) {
                 acc.found = true;
                 acc.index = index;
                 acc.array = student;
             }
             return acc;
         }, { found: false, index: -1, array: null });
 
 
 
 
     }; */

    const loadCourses = async () => {
        try {
            const result = await axios.get("/api/admin/courses");
            console.log(result.data);
            setCourses(result.data);
        } catch (error) {
            console.error("Error fetching courses: ", error);
        }
    };

    useEffect(() => {
     loadCourses(); 
    }, [])
    

    const onFinishFailed = (errorInfo) => {
        message.warning("Student Name and ID are required");
    };

    const handleAlertClose = () => {
        setError(null);
    };

    return (
        <div className="p-3">
            {/*  <Link href={"/admin/forms/Student/import"}>
                <FloatButton
                    tooltip={<div>Import</div>}
                    icon={<FileExcelOutlined />}
                    type="primary"
                />
            </Link> */}
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    closable
                    onClose={handleAlertClose}
                    style={{ marginBottom: 16 }}
                />
            )}
            <Form
                name="students_form"
                onFinish={handleSubmission}
                form={form}
                initialValues={{ students: [{}] }}
                onFinishFailed={onFinishFailed}
                onValuesChange={loadCourses}
            >
                <Form.List name="students">
                    {(fields, { add, remove }) => (
                        <div
                            style={{
                                display: "flex",
                                rowGap: 16,
                                flexDirection: "column",
                            }}
                        >
                            {fields.map((field) => (
                                <Card
                                    size="small"
                                    title={`Student ${field.name + 1}`}
                                    key={field.key}
                                    extra={
                                        <CloseOutlined
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    }
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={24} lg={7} xxl={7}>
                                            <Form.Item
                                                name={[field.name, "id"]}
                                                label="Student ID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter the Student ID",
                                                    },
                                                ]}

                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={24} lg={10} xxl={10}>
                                            <Form.Item
                                                name={[field.name, "course"]}
                                                label="Course"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter the Course",
                                                    },
                                                ]}
                                            >
                                                <Select/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Button type="dashed" onClick={() => add()} Student>
                                + Add Student
                            </Button>
                        </div>
                    )}
                </Form.List>
                <Divider />
                <Row gutter={16}>
                    <Col sm={24} md={5}>
                        <Button ghost type="primary" htmlType="submit">
                            Submit All
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>

    );
};

export default Page;
