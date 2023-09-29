import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';

const App = ({
    // columns,
    dataSource,
    pagination,
    loading, }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            // width: '30%',
            ...getColumnSearchProps('id'),
            sortDirections: ['descend', 'ascend'],

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // width: '20%',
            ...getColumnSearchProps('name'),
            sortDirections: ['descend', 'ascend'],

        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            // width: '20%',
            ...getColumnSearchProps('designation'),
            sortDirections: ['descend', 'ascend'],

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            // ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            // width: '20%',
        },
        {
            title: 'Aided/Unaided',
            dataIndex: 'aided/unaided',
            key: 'aided/unaided',
            // width: '20%',
            sortDirections: ['descend', 'ascend'],

        },
    ];
    return <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        rowKey={(record) => record.email} />;
};
export default App;