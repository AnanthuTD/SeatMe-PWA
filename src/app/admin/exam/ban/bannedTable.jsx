import React from 'react'
import {Table, Button, message} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons';

function BannedTable({bannedStudents, setBannedStudents}) {
    const unbanStudent = async (studentId) => {
        try {
            const response = await axios.patch(`/api/admin/student/unban/${studentId}`);
            message.success(response.data.message);
            let newList = bannedStudents.filter((value) => value !== studentId)
            setBannedStudents(newList)
        } catch (error) {
            message.error('Failed to unban student');
        }
    };
    const columns = [
        { title: 'Student ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Program', dataIndex: 'program.abbreviation', key: 'program.abbreviation' },
        { title: 'Semester', dataIndex: 'semester', key: 'semester' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (_, record) => (
                <Button type="link" icon={<CheckCircleOutlined style={{ color: 'green' }} />} onClick={() => unbanStudent(record.studentId)}>
                    Unban
                </Button>
            ),
        },
    ];
  return (
    <Table dataSource={bannedStudents} columns={columns} />

  )
}

export default BannedTable