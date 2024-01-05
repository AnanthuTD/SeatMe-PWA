"use client";

import React, { useState, useEffect } from "react";
import SelectDepartment from "./selectDepartment";
import Select from "./select";
import axios from "@/lib/axiosPrivate";
import CourseSelect from "./courseSelect";
import { Row, Col, Divider } from "antd";

function DepProSemCouSelect({ value = (values) => { }, courseField = true, reset = false }) {
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		loadDepartments();
	}, []);

	useEffect(() => {
		const params = {
			department: selectedDepartment,
			program: selectedProgram,
			courses: selectedCourse,
			semester: selectedSemester,
		};
		value(params);
	}, [selectedDepartment, selectedCourse, selectedProgram]);

	useEffect(() => {
		if (selectedDepartment) {
			loadPrograms(selectedDepartment);
		}
	}, [selectedDepartment]);

	useEffect(() => {
		if (selectedSemester && selectedProgram && courseField) {
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

	const loadPrograms = async (departmentCode) => {
		try {
			const result = await axios.get("/api/admin/programs", {
				params: { departmentCode },
			});
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	const loadSemesters = (programId, option) => {
		const totalSemesters = 7;
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

	const handleDepartmentChange = (departmentCode) => {
		setSelectedDepartment(departmentCode);
		setSelectedProgram(null);
		setSelectedSemester(null);
		setSelectedCourse([]);
	};

	const handleProgramChange = (programId, option) => {
		setSelectedProgram(programId);
		loadSemesters(programId, option);
		setSelectedSemester(null);
		setSelectedCourse([]);
	};

	const handleSemesterChange = (semester) => {
		setSelectedSemester(semester);
		setSelectedCourse([]);
	};

	const handleCourseChange = (courseId) => {
		setSelectedCourse([...selectedCourse, courseId]);
	};

	const handleProgramClick = () => {
		if (programs.length === 0) loadPrograms();
	};

	const handleCourseClick = () => {
		if (courses.length === 0) loadCourses();
	};

	const handleReset = () => {
		setDepartments([]);
		setPrograms([]);
		setCourses([]);
		setSelectedCourse([]);
		setSelectedDepartment([]);
		setSelectedProgram([]);
		setSelectedSemester([]);
		setSemesters([]);
		loadDepartments();
	};

	useEffect(() => {
		handleReset();
	}, [reset])

	return (
		<>
			<Row gutter={16} align="middle">
				<Col xs={24} sm={12} md={12} lg={8} xl={7}>
					<label className="block text-lg font-semibold mb-2">
						Department:
					</label>
					<SelectDepartment
						options={departments}
						onChange={handleDepartmentChange}
						placeholder="Select Department"
					/>
				</Col>
				<Col xs={24} sm={12} md={12} lg={8} xl={7}>
					<label className="block text-lg font-semibold mb-2">
						Program:
					</label>
					<Select
						options={programs}
						onChange={handleProgramChange}
						onClick={handleProgramClick}
						placeholder="Select Program"
						sortByValue
					/>
				</Col>
				<Col xs={24} sm={12} md={12} lg={8} xl={7}>
					<label className="block text-lg font-semibold mb-2">
						Semester:
					</label>
					<Select
						options={semesters}
						onChange={handleSemesterChange}
						placeholder="Select Semester"
					/>
				</Col>
			</Row>
			{courseField ? (
				<>
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
								selectedCourses={selectedCourse}
								onClick={handleCourseClick}
								setSelectedCourses={setSelectedCourse}
								className="w-full"
							/>
						</Col>
					</Row>
				</>
			) : null}
		</>
	);
}

export default DepProSemCouSelect;
