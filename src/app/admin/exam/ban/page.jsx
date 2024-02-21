'use client'

import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Table } from 'antd';
import axios from 'axios';
import { StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

const BanUnbanStudents = () => {
    const [form] = Form.useForm();
    const [bannedStudents, setBannedStudents] = useState([]);

    const banStudent = async (values) => {
        try {
            const response = await axios.patch(`/api/admin/student/ban/${values.studentId}`);
            message.success(response.data.message);
            form.resetFields();
            fetchBannedStudents();
        } catch (error) {
            message.error('Failed to ban student');
        }
    };

    const unbanStudent = async (studentId) => {
        try {
            const response = await axios.patch(`/api/admin/student/unban/${studentId}`);
            message.success(response.data.message);
            fetchBannedStudents();
        } catch (error) {
            message.error('Failed to unban student');
        }
    };

    const fetchBannedStudents = async () => {
        try {
            const response = await axios.get('/api/admin/student/banned');
            setBannedStudents(response.data);
        } catch (error) {
            console.error('Error fetching banned students:', error);
            message.error('Failed to fetch banned students');
        }
    };

    useEffect(() => {
     fetchBannedStudents()
    }, [])
    

    const columns = [
        { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (_, record) => (
                <div>
                        <Button type="link" icon={<CheckCircleOutlined style={{color:'green'}}/>} onClick={() => unbanStudent(record.studentId)}>
                            Unban
                        </Button>
                </div>
            ),
        },
    ];

    return (
        <div className='pt-3'>
            <Form form={form} onFinish={banStudent}>
                <Form.Item name="studentId" label="Student ID" rules={[{ required: true, message: 'Please enter student ID' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" danger icon={<StopOutlined/>}>
                        Ban Student
                    </Button>
                </Form.Item>
            </Form>
            <Table dataSource={bannedStudents} columns={columns} />
        </div>
    );
};

export default BanUnbanStudents;
