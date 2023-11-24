'use client'
import React, { useState, useEffect } from 'react';
import RoomDetail from './roomDetails';
import axios from "@/lib/axiosPrivate";

const Page = () => {
    const [rooms, setRooms] = useState([]);

    const loadRooms = async () => {
            const result = await axios.get(`/api/admin/rooms`);
            setRooms(result.data);
    };

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <div>
            <h1>Room Details</h1>
            <RoomDetail data={rooms} />
        </div>
    );
};

export default Page;
