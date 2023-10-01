"use client";

import React, { useState, useEffect } from "react";
import Select from "./select";
import axios from "@/axiosInstance";
import CourseSelect from "./courseSelect";
import CourseForm from "./courseForm";
import { Row, Col, Divider } from "antd";

function Page() {
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [programs, setPrograms] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		loadDepartments();
	}, []);

	useEffect(() => {
		if (selectedDepartment) {
			loadPrograms(selectedDepartment);
		}
	}, [selectedDepartment]);

	useEffect(() => {
		if (selectedProgram) {
			loadSemesters(selectedProgram);
		}
	}, [selectedProgram]);

	useEffect(() => {
		if (selectedSemester && selectedProgram) {
			loadCourses(selectedProgram, selectedSemester);
		}
	}, [selectedSemester, selectedProgram]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/admin/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	const loadPrograms = async (departmentId) => {
		try {
			const result = await axios.get("/api/admin/programs", {
				params: { departmentId },
			});
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	const loadSemesters = (programId) => {
		// Simulate loading semesters here based on programId
		const totalSemesters = programId ? 8 : 0; // You can adjust this logic as needed
		const semesterOptions = Array.from(
			{ length: totalSemesters },
			(_, index) => ({
				id: index + 1,
				name: `Semester ${index + 1}`,
			}),
		);
		setSemesters(semesterOptions);
	};

	const loadCourses = async (programId, semester) => {
		try {
			const result = await axios.get("/api/admin/courses", {
				params: { programId, semester },
			});
			setCourses(result.data);
		} catch (error) {
			console.error("Error fetching courses: ", error);
		}
	};

	const handleDepartmentChange = (departmentId) => {
		setSelectedDepartment(departmentId);
		setSelectedProgram(null);
		setSelectedSemester(null);
		setSelectedCourse(null);
	};

	const handleProgramChange = (programId) => {
		setSelectedProgram(programId);
		setSelectedSemester(null);
		setSelectedCourse(null);
	};

	const handleSemesterChange = (semester) => {
		setSelectedSemester(semester);
		setSelectedCourse(null);
	};

	const handleCourseChange = (courseId) => {
		setSelectedCourse(courseId);
	};

	const handleProgramClick = () => {
		if (programs.length === 0) loadPrograms();
	};

	const handleCourseClick = () => {
		if (courses.length === 0) loadCourses();
	};

	return (
		<div className="p-4 bg-white">
			<Row gutter={16} align="middle">
				<Col span={6}>
					<label className="block text-lg font-semibold mb-2">
						Department:
					</label>
					<Select
						options={departments}
						onChange={handleDepartmentChange}
						placeholder="Select Department"
						value={selectedDepartment}
						className="w-full"
					/>
				</Col>
				<Col span={6}>
					<label className="block text-lg font-semibold mb-2">
						Program:
					</label>
					<Select
						options={programs}
						onChange={handleProgramChange}
						onClick={handleProgramClick}
						placeholder="Select Program"
						value={selectedProgram}
						sortByValue
						className="w-full"
					/>
				</Col>
				<Col span={6}>
					<label className="block text-lg font-semibold mb-2">
						Semester:
					</label>
					<Select
						options={semesters}
						onChange={handleSemesterChange}
						placeholder="Select Semester"
						value={selectedSemester}
						className="w-full"
					/>
				</Col>
			</Row>
			<Divider />
			<Row gutter={16} align="middle">
				<Col span={24}>
					<label className="block text-lg font-semibold mb-2">
						Course:
					</label>
					<CourseSelect
						options={courses}
						onChange={handleCourseChange}
						placeholder="Select Course"
						value={selectedCourse}
						onClick={handleCourseClick}
						className="w-full"
					/>
				</Col>
			</Row>
			<Divider />
			<Row gutter={16} justify="center">
				<Col span={24}>
					<CourseForm />
				</Col>
			</Row>
		</div>
	);
}

export default Page;
