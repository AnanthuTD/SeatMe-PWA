'use client';
'use strict';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Divider, List, Skeleton } from 'antd';
import Table from './table'
import axios from '@/axiosInstance';
const App = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [staffCount, setStaffCount] = useState(1);

    const getStaffCount = async () => {
        const result = await axios.get('/api/admin/staffs/count');
        setStaffCount(result.data);
    };

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        const resultsPerPage = 10;
        setLoading(true);
        axios
            .get(
                `/api/admin/staffs/list/?results=${resultsPerPage}&start=${startIndex}`,
            )
            .then((response) => {
                const newStaffs = response.data;
                setData([...data, ...newStaffs]);
                setStartIndex(startIndex + resultsPerPage);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };
    useEffect(() => {
        getStaffCount();
        loadMoreData();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Aided/Unaided',
            dataIndex: 'aided/unaided',
            key: 'aided/unaided',
        },
    ];

    return (
        <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < staffCount}
            loader={
                <Skeleton
                    avatar
                    paragraph={{
                        rows: 1,
                    }}
                    active
                />
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
        >
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                loading={loading}
                rowKey={(record) => record.email}
            />
        </InfiniteScroll>
    );
};
export default App;
