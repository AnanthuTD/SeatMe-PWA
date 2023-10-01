"use client";

import React, { useState, useEffect } from "react";
import Form from "./form";
import SelectCourses from "./selectCourse";
import Select from "./select";
import axios from "@/axiosInstance";

function Page() {
	const [departments, setDepartment] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [courses, setCourses] = useState([]);
	const [semesters, setSemester] = useState([]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/admin/departments");
			// console.log(result.data);
			setDepartment(result.data);
		} catch (e) {
			console.error("error : ", e);
		}
	};
	const loadPrograms = async (departmentId) => {
		try {
			const result = await axios.get("/api/admin/programs", {
				params: { departmentId },
			});
			// console.log(result.data);
			setPrograms(result.data);
		} catch (e) {
			console.error("error : ", e);
		}
	};
	const loadCourses = async (programId, semester) => {
		try {
			const result = await axios.get("/api/admin/courses", {
				params: { programId, semester },
			});
			// console.log(result.data);
			setCourses(result.data);
		} catch (e) {
			console.error("error : ", e);
		}
	};

	const handleDepartmentChange = (departmentId) => {
		loadPrograms(departmentId);
	};

	const handleProgramChange = (programId, option) => {
		// console.log("option: ", option);
		const totalSem = option.duration * 2;
		const arrayOfObjects = Array.from({ length: totalSem }, (_, index) => ({
			id: index + 1,
			name: `Semester ${index + 1}`,
			programId: programId,
		}));
		// console.log(arrayOfObjects);
		setSemester(arrayOfObjects);
	};

	const handleSemChange = (sem, option) => {
		const programId = option.programId;
		loadCourses(programId, sem);
	};

	const handleCourseChange = (programId) => {
		// loadPrograms(programId);
	};

	const handleProgramClick = () => {
		if (programs.length === 0) loadPrograms();
	};
	const handleCourseClick = () => {
		if (courses.length === 0) loadCourses();
	};
	const handleSemClick = () => {
		// loadCourses();
	};

	useEffect(() => {
		loadDepartments();
	}, []);

	return (
		<div>
			<Select options={departments} onChange={handleDepartmentChange} />
			<Select
				options={programs}
				onChange={handleProgramChange}
				onClick={handleProgramClick}
				sortByValue={true}
			/>
			<Select options={semesters} onChange={handleSemChange} />
			<SelectCourses
				options={courses}
				onChange={handleCourseChange}
				onClick={handleCourseClick}
			/>
			<Form/>
		</div>
	);
}

export default Page;
