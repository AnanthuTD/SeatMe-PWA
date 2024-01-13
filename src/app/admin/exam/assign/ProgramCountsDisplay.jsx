import React from 'react';
import { Table } from 'antd';

const columns = [
    {
        title: 'Program ID',
        dataIndex: 'programId',
        key: 'programId',
    },
    {
        title: 'Regular',
        dataIndex: 'regular',
        key: 'regular',
    },
    {
        title: 'Supply',
        dataIndex: 'supply',
        key: 'supply',
    },
];

const ProgramCountsDisplay = ({ data }) => {
    return (
        <Table
            dataSource={data}
            columns={columns}
            bordered
            title={() => 'Program Counts'}
            pagination={false} // Optional: Disable pagination if not needed
        />
    );
};

export default ProgramCountsDisplay;
