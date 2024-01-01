'use client'

import React, { useEffect, useState } from 'react'
import TeacherAssignment from './teacherAssignment'
import axios from "@/lib/axiosPrivate";
import { useSearchParams } from 'next/navigation';
import { Select, Spin } from 'antd';
import DatePicker from '@/app/admin/components/datePicker';

const timeOptions = ['AN', 'FN'];

function Page() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const queryDate = useSearchParams().get('date') || new Date()
    const queryTimeCode = useSearchParams().get('timeCode')
    const [date, setDate] = useState(new Date(queryDate))
    const [timeCode, setTimeCode] = useState(queryTimeCode || 'AN')


    const loadRooms = async () => {
        const response = await axios.get(`/api/admin/exams/${new Date(date)}/${timeCode}/rooms`);
        setRooms(response.data);
        setLoading(false);
    }

    useEffect(() => {
        loadRooms();
    }, [date])

    return (
        <div>
            <div className='flex gap-3 mt-3 ml-4'>
                <DatePicker defaultValue={date} onChange={(newDate) => {
                    setDate(newDate.toDate())
                }} />
                <Select placeholder="Select AN or FN" onSelect={setTimeCode} defaultValue={timeCode}>
                    {timeOptions.map((option) => (
                        <Select.Option key={option} value={option}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            {
                loading ? <Spin /> : rooms.length
                    ? <TeacherAssignment
                        rooms={rooms}
                        date = {date}
                        timeCode={timeCode}
                    />
                    : <h1>No rooms to assign staffs!. Make sure examinees has been assigned before assigning staffs.</h1>
            }
        </div>
    )
}

export default Page