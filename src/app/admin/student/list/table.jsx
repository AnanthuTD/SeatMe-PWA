import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import axios from '@/axiosInstance';

const App = ({
    setDataSource,
    dataSource,
    pagination,
    loading,
    setLoading,
    setQuery,
    setDataIndex,
}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = async (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);

        setDataSource([])

        const query = selectedKeys[0]

        setQuery(query)
        setDataIndex(dataIndex)
        try {

            const result = await axios.get(`/api/admin/student/search/?query=${query}&column=${dataIndex}`);
            const newStudents = result.data
            setDataSource(newStudents);
            setLoading(false);

        } catch (err) {
            console.error('Error on searching : ', err);
        }

    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const textColumnSorter = (a, b) => {
        return a.localeCompare(b);
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
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id, // Example sorting for numeric column
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => textColumnSorter(a.name, b.name),
        },
        {
            title: 'Roll Number',
            dataIndex: 'rollNumber',
            key: 'rollNumber',
            ...getColumnSearchProps('rollNumber'),
            sorter: (a, b) => a.rollNumber - b.rollNumber,
        },
        {
            title: 'Semester',
            dataIndex: 'semester',
            key: 'semester',
            sorter: (a, b) => a.semester - b.semester,
        },
        /*   {
              title: 'ProgramId',
              dataIndex: 'programId',
              key: 'programId',
              sorter: (a, b) => a.programId - b.programId,
          }, */
        {
            title: 'Program',
            dataIndex: 'program.name',
            key: 'programName',
            sorter: (a, b) => a.programName - b.programName,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'phone',
            key: 'contact',
        },
    ];

    return <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        rowKey={(record) => record.id} />;
};
export default App;