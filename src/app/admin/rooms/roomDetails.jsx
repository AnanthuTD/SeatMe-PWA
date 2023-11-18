// RoomDetail.js
import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';

const { Option } = Select

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const RoomDetail = ({ data }) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            editable: false,
        },
        {
            title: 'Internal Rows',
            dataIndex: 'internalRows',
            key: 'internal_rows',
            editable: true,
        },
        {
            title: 'Internal Columns',
            dataIndex: 'internalCols',
            key: 'internal_cols',
            editable: true,
        },
        {
            title: 'Final Rows',
            dataIndex: 'finalRows',
            key: 'final_rows',
            editable: true,
        },
        {
            title: 'Final Columns',
            dataIndex: 'finalCols',
            key: 'final_cols',
            editable: true,
        },
        {
            title: 'Is Available',
            dataIndex: 'isAvailable',
            key: 'is_available',
            editable: true,
            render: (_, record) => (
                <Select defaultValue={record.is_available} style={{ width: 120 }}>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                </Select>
            ),
        },
        {
            title: 'Floor',
            dataIndex: 'floor',
            key: 'floor',
            editable: true,
        },
        {
            title: 'Block ID',
            dataIndex: 'blockId',
            key: 'block_id',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                rowKey={(record) => record.id}
            />
        </Form>
    );
};

export default RoomDetail;
