"use client";

import React, { useState, useEffect } from "react";
import Select from "./select";
import axios from "@/axiosInstance";
import CourseSelect from "./courseSelect";
import CourseForm from "./courseForm";
import { Row, Col, Divider, FloatButton } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

function Page() {
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [courses, setCourses] = useState([]);
	const [courseForms, setCourseForms] = useState([]);

	useEffect(() => {
		loadDepartments();
	}, []);

	useEffect(() => {
		const updatedCourseForms = selectedCourse.map((selectedCourse) => {
			const existingCourseForm = courseForms.find(
				(course) => selectedCourse.id === course.courseId,
			);

			if (existingCourseForm) {
				return existingCourseForm;
			} else {
				// Create a new form if one doesn't exist
				return {
					courseId: selectedCourse.id,
					date: "",
					timeCode: "",
				};
			}
		});

		setCourseForms(updatedCourseForms);
	}, [selectedCourse]);

	useEffect(() => {
		if (selectedDepartment) {
			loadPrograms(selectedDepartment);
		}
	}, [selectedDepartment]);

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

	const loadSemesters = (programId, option) => {
		const totalSemesters = option.duration * 2;
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
		setCourseForms([]);
		setSelectedCourse([]);
		setSelectedDepartment([]);
		setSelectedProgram([]);
		setSelectedSemester([]);
		setSemesters([]);
		loadDepartments();
	};

	const onFinish = async (formData) => {
		const indexToUpdate = courseForms.findIndex(
			(courseForm) => courseForm.courseId === formData.courseId,
		);

		if (indexToUpdate !== -1) {
			const updatedCourseForms = [...courseForms];
			updatedCourseForms[indexToUpdate] = formData;
			setCourseForms(updatedCourseForms);
		}

		try {
			const result = await axios.post("/api/admin/timetable", formData);
			console.log(result);
			return true;
		} catch (error) {
			console.error("error on posting timetable: ", error);
			return false;
		}
	};

	const formUpdate = async (formData) => {
		const indexToUpdate = courseForms.findIndex(
			(courseForm) => courseForm.courseId === formData.courseId,
		);

		if (indexToUpdate !== -1) {
			const updatedCourseForms = [...courseForms];
			updatedCourseForms[indexToUpdate] = formData;
			setCourseForms(updatedCourseForms);
		}
	};

	return (
		<div className="p-4 bg-white">
			<Row gutter={16} align="middle">
				{/* On extra-small screens (<= 575px), use full width for each column */}
				<Col xs={24} sm={12} md={12} lg={8} xl={7}>
					<label className="block text-lg font-semibold mb-2">
						Department:
					</label>
					<Select
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
			{courseForms.map((courseForm, index) => (
				<div key={courseForm.id}>
					<Divider />
					<Row gutter={16} justify="center" key={courseForm.id}>
						<Col span={24}>
							<CourseForm
								onFinish={onFinish}
								formData={courseForm}
								formUpdate={formUpdate}
							/>
						</Col>
					</Row>
				</div>
			))}
			<FloatButton
				onClick={handleReset}
				type="default"
				style={{
					backgroundColor: "#ffe6e6",
					border: "solid #ff8080",
				}}
				icon={<ReloadOutlined style={{ color: "#ff8080" }} />}
			/>
		</div>
	);
}

export default Page;
