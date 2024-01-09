'use client'
import React, { useEffect, useState } from "react";
import CoursesSelect from "../../components/courseSelect";
import { DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import axios from "@/lib/axiosPrivate";
import StudentList from "./table";

function Page() {
	const [date, setdate] = useState(dayjs())
	const [courses, setCourses] = useState([])
	const [students, setStudents] = useState([])
	const [selectedCourses, setSelectedCourses] = useState([])

	const loadCourses = async (date) => {
		try {
			const result = await axios.get("/api/admin/exams", {
				params: { query: date, column: 'date' },
			});
			const { data } = result;
			console.log(result.data);
			const courses = data.map(course => {
				return {
					id: course['course.id'],
					name: course['course.name']
				}
			})
			setCourses(courses);
		} catch (error) {
			console.error("Error fetching courses: ", error);
		}
	};

	useEffect(() => {
		console.log(date);
		if (date)
			loadCourses(date);
	}, [date])


	const handleDateChange = (value) => {
		setdate(value);
	}

	const handleCourseChange = (courseId) => {
		setSelectedCourses([...selectedCourses, courseId]);
	};

	const loadStudents = () => {
		const courseIds = selectedCourses.map(course => course.id)

		axios.get('/api/admin/student/supplementary', {
			params: {
				date, courseIds
			}
		}).then((res) => {
			console.log(res.data);
			setStudents(res.data)
		}).catch(err => message.error('Failed to load students!'))
	}

	useEffect(() => {
		if (!selectedCourses.length) return
		loadStudents()
	}, [selectedCourses, date])


	return (
		<>
			<DatePicker onChange={handleDateChange} value={date} />
			<CoursesSelect
				options={courses}
				onChange={handleCourseChange}
				placeholder="Select Course"
				selectedCourses={selectedCourses}
				setSelectedCourses={setSelectedCourses}
				className="w-full"
			/>
			<StudentList dataSource={students} setDataSource={setStudents}/>
		</>
	)
}

export default Page;
