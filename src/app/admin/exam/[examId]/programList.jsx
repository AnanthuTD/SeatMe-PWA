'use client'
import React, { useState } from 'react';
import axios from "@/lib/axiosPrivate";
import { message, Collapse, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from "xlsx";
import StudentList from './studentList';

const ProgramList = ({ data, examId }) => {
    const { programs, semester, courseName, courseId } = data;

    const [expandedPanel, setExpandedPanel] = useState(null);
    const [studentData, setStudentData] = useState({});

    const fetchStudentData = async (programId) => {
        try {
            const result = await axios.get(`/api/admin/exams/attendance/${examId}/${programId}`);
            return result.data || [];
        } catch (error) {
            console.log(error);
            message.error('Error fetching student data');
            return [];
        }
    };

    const fetchAndSetStudentData = async (programId) => {
        const students = await fetchStudentData(programId);
        setStudentData((prevData) => ({
            ...prevData,
            [programId]: students,
        }));
        return { [programId]: students, };
    };

    const handlePanelChange = async (key) => {
        if (key && key.length > 0) {
            const programId = key[0]; // Assuming only one panel can be expanded at a time

            if (!studentData[programId]) {
                await fetchAndSetStudentData(programId);
            }
        }

        setExpandedPanel(key);
    };

    const items = programs.map((program) => {
        const programId = program.id;

        const handleDownload = async (e) => {
            e.stopPropagation();

            let newStudent = {}

            // Check if studentData for the current program is not defined
            if (!studentData[programId]) {
                newStudent = await fetchAndSetStudentData(programId);
            }
            else
                newStudent = studentData;

            const studentsData = [];

            // Collect the data for XLSX            
            studentsData.push(
                ...newStudent[programId].map((data) => {
                    return ({
                        id: data['student.id'],
                        name: data['student.name'],
                        rollNumber: data['student.rollNumber'],
                        isPresent: data['isPresent'],
                        seatNumber: data['seatNumber'],
                        roomId: data['roomId'],
                    })
                })
            );

            // Prepare the workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(studentsData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

            // Save the workbook as a buffer
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Create a download link and trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }));
            downloadLink.download = `${program.name}-sem-${semester}-${courseName}.xlsx`;
            downloadLink.click();
        };

        return {
            key: programId,
            label: (
                <span className='flex justify-between'>
                    <span className='flex gap-5 w-full'>
                        <p className="block mb-4 font-bold text-blue-500 hover:underline">
                            {program.name}
                        </p>
                        <p>Duration: {program.duration} years</p>
                        <p> Level: {program.level}</p>
                        <p>Semester: {data.semester}</p>
                        <p>{program.isAided ? 'Aided' : 'Unaided'}</p>
                        <p>Department ID: {program.departmentCode}</p>
                    </span>
                    <p>
                        <Button type="primary" shape="round" icon={<DownloadOutlined />}
                            onClick={handleDownload} />
                    </p>
                </span>
            ),
            children: studentData[programId] && <StudentList students={studentData[programId]} />,
        };
    });

    return (
        <Collapse accordion items={items} onChange={handlePanelChange} activeKey={expandedPanel} />
    );
};

export default ProgramList;