'use client'

import React, { useEffect, useState } from 'react'
import axios from "@/lib/axiosPrivate"
import Link from 'next/link';
import { message } from 'antd';

const ProgramList = ({ data }) => {
    console.log(data);
    return (
        <div className="flex flex-wrap -mx-4">
            {data.programs.map((program) => (
                <div key={program.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                    <Link href={`/program/${program.id}`} passHref>
                        <div className="bg-white border p-6 rounded-md shadow-md hover:shadow-lg transition duration-300 flex flex-col">
                            <span className="block mb-4 font-bold text-blue-500 hover:underline">
                                {program.name}
                            </span>
                            <p className="text-gray-700 mb-2">
                                Duration: {program.duration} years, Level: {program.level}
                            </p>
                            <p className="text-gray-700 mb-2">
                                Semester: {data.semester}
                            </p>
                            <p className="text-gray-700">
                                {program.isAided ? 'Aided' : 'Unaided'}, Department ID: {program.departmentId}
                            </p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default function Page({ params }) {
    const [data, setData] = useState(undefined);

    const loadPrograms = async () => {
        try {
            const result = await axios.get(`/api/admin/exams/${params.examId}`);
            setData(result.data.course || []);
        } catch (error) {
            console.log(error);
            message.error('Something went wrong!');
        }
    };

    useEffect(() => {
        loadPrograms();
    }, []);

    return data ? <ProgramList data={data} /> : null
}