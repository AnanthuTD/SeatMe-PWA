'use client'
import React, { useState, useEffect } from 'react';
import RoomDetail from './roomDetails';
import axios from "@/lib/axiosPrivate";
import { Spin } from 'antd';

const Page = ({ params }) => {
    const [rooms, setRooms] = useState([]);
    const [examType, examinesCount] = params.details || [];
    const [loading, setLoading] = useState(false);

    const loadRooms = async (examType) => {
        setLoading(true);
        const result = await axios.get(`/api/admin/rooms/${examType}`);
        setRooms(result.data);
        setLoading(false);
    };

    useEffect(() => {
        loadRooms(examType);
    }, []);

    return (
        <>
            {
                loading
                    ? <Spin />
                    : <RoomDetail data={rooms} examinesCount={examinesCount} />
            }
        </>
    );
};

export default Page;
