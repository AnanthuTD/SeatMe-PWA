"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber, Checkbox, Row, Space, Col } from "antd";
import Segment from "./segment";
import axios from "@/lib/axiosPublic";

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

const App = () => {
	const [form] = Form.useForm();
	const [seatingInfo, setSeatingInfo] = useState(undefined);
	const [upcomingExams, setUpcomingExams] = useState([]);

	const storeUpcomingExamsInLocalStorage = (examsData) => {
		const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day in milliseconds
		const storageData = {
			expirationTime,
			examsData,
		};

		localStorage.setItem('upcomingExams', JSON.stringify(storageData));
	};

	const getUpcomingExamsFromLocalStorage = () => {
		const storedData = localStorage.getItem('upcomingExams');
		if (!storedData) {
			return null;
		}

		const { expirationTime, examsData } = JSON.parse(storedData);

		if (expirationTime && new Date().getTime() > expirationTime) {
			localStorage.removeItem('upcomingExams');
			return null;
		}

		return examsData;
	};

	const onFinish = async (values) => {
		const studentId = values.studentId.toString();
		localStorage.setItem('rememberedRegisterId', studentId);

		try {
			const response = await axios.get("api/", {
				params: { studentId: values.studentId },
			});

			const { data } = response;
			const { seatingInfo } = data;

			setSeatingInfo(seatingInfo);

			const { programId, semester, openCourseId } = seatingInfo || {};
			const userObject = { programId, semester, openCourseId, studentId };
			localStorage.setItem('user', JSON.stringify(userObject));

			const cachedExams = getUpcomingExamsFromLocalStorage();
			if (cachedExams) {
				const examsResponse = await axios.get("api/exams", {
					params: { programId, semester, openCourseId },
				});

				const examsData = examsResponse.data;
				console.log(examsData);
				setUpcomingExams(examsData);
			}
		} catch (error) {
			setSeatingInfo(undefined);
			const storedUser = localStorage.getItem('user');
			const userObject = JSON.parse(storedUser);
			if (userObject) {
				const { programId, semester, openCourseId, studentId: existingStudentId } = userObject
				if (studentId === existingStudentId) {
					if (!upcomingExams.length) {
						const examsResponse = await axios.get("api/exams", {
							params: { programId, semester, openCourseId },
						});

						const examsData = examsResponse.data;
						console.log(examsData);
						setUpcomingExams(examsData);
					}
					return;
				}
			}
			axios.get(`api/exams/${values.studentId}`).then((response) => {
				const { data } = response;
				console.log(data);
				setUpcomingExams(data);
			});
		}
	}

	useEffect(() => {
		if (upcomingExams) {
			storeUpcomingExamsInLocalStorage(upcomingExams);
		}
	}, [upcomingExams]);

	useEffect(() => {
		try {
			const cachedExams = getUpcomingExamsFromLocalStorage();
			if (cachedExams) {
				setUpcomingExams(cachedExams);
			}
		} catch (error) {
			console.error('Error retrieving cached exams from localStorage:', error);
		}
	}, []);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		const userObject = JSON.parse(storedUser);
		const { studentId } = userObject;

		if (studentId) {
			form.setFieldsValue({ studentId: parseInt(studentId) });
		}
	}, [form]);

	const onReset = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('upcomingExams');
		form.resetFields();
	};
	return (
		<div className="flex h-screen flex-col w-full p-5 overflow-hidden">
			<section className="h-[40%] flex justify-center items-center w-full">
				<div className="min-w-[50%]">
					<Form
						{...layout}
						form={form}
						name="control-hooks"
						onFinish={onFinish}
						style={{ maxWidth: 600 }}
					>
						<Form.Item
							name="studentId"
							label="Register Number"
							rules={[
								{
									required: true,
									type: "number",
									min: 100000000000,
									max: 999999999999,
									message: "Invalid Register number",
								},
							]}
						>
							<InputNumber style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item {...tailLayout}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
							<Button
								htmlType="button"
								onClick={onReset}
								className="m-1"
							>
								Reset
							</Button>
						</Form.Item>

					</Form>
				</div>
			</section >
			<section className="w-full h-[60%]">
				<div className="mx-auto w-full h-full">
					<Segment seatingInfo={seatingInfo} upcomingExams={upcomingExams} />
				</div>
			</section>
		</div >
	);
};

export default App;
