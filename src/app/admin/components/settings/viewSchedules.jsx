import React, { useEffect, useState } from 'react';
import axios from "@/lib/axiosPrivate";
import { Table } from 'antd';

const ViewSchedules = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/config/seating-availability-schedule')
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error('Error fetching schedules:', error));
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: 'Time Code',
            dataIndex: 'timeCode',
            key: 'timeCode',
        },
    ];

    return (
        <div>
            <Table dataSource={schedules} columns={columns} pagination={false} />
        </div>
    );
};

export default ViewSchedules;
