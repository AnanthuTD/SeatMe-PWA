"use client";
import React, { useEffect, useState } from "react";
import CoursesSelect from "../../components/courseSelect";
import { DatePicker, message, Row, Col, Statistic, Card } from "antd";
import dayjs from "dayjs";
import axios from "@/lib/axiosPrivate";
import StudentList from "./table";

function Page() {
	const [date, setdate] = useState(dayjs());
	const [courses, setCourses] = useState([]);
	const [students, setStudents] = useState([]);
	const [selectedCourses, setSelectedCourses] = useState([]);

	const loadCourses = async (date) => {
		try {
			const result = await axios.get("/api/staff/exams", {
				params: { query: date, column: "date" },
			});
			const { data } = result;
			// console.log(result.data.length);
			const courses = data.map((course) => {
				return {
					id: course["course.id"],
					name: course["course.name"],
				};
			});
			setCourses(courses);
		} catch (error) {
			if (error.response && error.response.status !== 403)
				console.error("Error fetching courses: ", error);
		}
	};

	useEffect(() => {
		// console.log(date);
		if (date) loadCourses(date);
	}, [date]);

	const handleDateChange = (value) => {
		setdate(value);
	};

	const handleCourseChange = (courseId) => {
		setSelectedCourses([...selectedCourses, courseId]);
	};

	const loadStudents = () => {
		const courseIds = selectedCourses.map((course) => course.id);

		axios
			.get("/api/staff/student/supplementary", {
				params: {
					date,
					courseIds,
				},
			})
			.then((res) => {
				// console.log(res.data);
				setStudents(res.data);
			})
			.catch((err) => message.error("Failed to load students!"));
	};

	useEffect(() => {
		if (!selectedCourses.length) return;
		loadStudents();
	}, [selectedCourses, date]);

	return (
		<>
			<Row gutter={[16, 16]} align={"middle"}>
				<Col xs={24} sm={12} md={6} lg={6}>
					<DatePicker
						onChange={handleDateChange}
						value={date}
						style={{ width: "100%" }}
					/>
				</Col>
				<Col
					xs={24}
					sm={12}
					md={6}
					lg={18}
					style={{ textAlign: "right" }}
				>
					<Card bordered={false} size="small">
						<Statistic
							title="Total Students"
							value={students.length}
							valueStyle={{ color: "#1677ff" }}
						/>
					</Card>
				</Col>
			</Row>
			<CoursesSelect
				options={courses}
				onChange={handleCourseChange}
				placeholder="Select Course"
				selectedCourses={selectedCourses}
				setSelectedCourses={setSelectedCourses}
				className="w-full"
			/>
			<StudentList dataSource={students} setDataSource={setStudents} />
		</>
	);
}

export default Page;
