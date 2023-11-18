import React from 'react'
import { Table, Typography } from 'antd';

function Rooms({ data }) {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Seats',
            dataIndex: 'seats',
            key: 'seats',
        },
        {
            title: 'Rows',
            dataIndex: 'rows',
            key: 'rows',
        },
        {
            title: 'Columns',
            dataIndex: 'cols',
            key: 'cols',
        },
        {
            title: 'Floor',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Block ID',
            dataIndex: 'blockId',
            key: 'block_id',
        },
    ];
    return (
        <div>
            <Typography.Title level={4}>Selected Rooms</Typography.Title>
            <Table
                bordered
                dataSource={data}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(record) => record.id}
                pagination={false}
            />
        </div>
    );
}

export default Rooms