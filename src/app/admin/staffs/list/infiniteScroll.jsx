'use client';
'use strict';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider, Skeleton } from 'antd';
import Table from './table'
import axios from '@/axiosInstance';
const App = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [studentCount, setStudentCount] = useState(1);
    const [query, setQuery] = useState('');
    const [dataIndex, setDataIndex] = useState('id');
    const [sorterField, setSorterField] = useState('');
    const [sorterOrder, setSorterOrder] = useState('');

    const getStaffCount = async () => {
        const result = await axios.get('/api/admin/staff/count');
        setStudentCount(result.data);
    };

    useEffect(() => {
        console.log('useEffect : ', sorterOrder);
    //  loadMoreData()
    }, [sorterOrder])
    

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        console.log('sorterOrder: ', sorterOrder);
        const resultsPerPage = 10;
        setLoading(true);
        axios
            .get(
                `/api/admin/staff/list/`,
                {
                    params: {
                        query: query,
                        column: dataIndex,
                        sortField: sorterField,
                        sortOrder: sorterOrder,
                        limit: resultsPerPage,
                        offset: startIndex,
                    },
                }
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




    return (
        <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < studentCount}
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
                dataSource={data}
                pagination={false}
                loading={loading}
                setDataSource={setData}
                setLoading={setLoading}
                setStartIndex={setStartIndex}
                setQuery={setQuery}
                setDataIndex={setDataIndex}
                sorterField={sorterField}
                setSorterField={setSorterField}
                sorterOrder={sorterOrder}
                setSorterOrder={setSorterOrder}
                loadData={loadMoreData}
                startIndex={startIndex}
            />
        </InfiniteScroll>
    );
};
export default App;
