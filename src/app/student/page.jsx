"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber } from "antd";
import Segment from "./segment";
import Studentnav from "./studentnav";
import Instruction from "./instruction";
import axios from "";
import { deleteCookie, getCookie } from "cookies-next";
import Container from "./container";

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
		const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
		const storageData = {
			expirationTime,
			examsData,
		};

		localStorage.setItem("upcomingExams", JSON.stringify(storageData));
	};

	const getUpcomingExamsFromLocalStorage = () => {
		const storedData = localStorage.getItem("upcomingExams");
		if (!storedData) {
			return null;
		}

		const { expirationTime, examsData } = JSON.parse(storedData);

		if (expirationTime && new Date().getTime() > expirationTime) {
			localStorage.removeItem("upcomingExams");
			return null;
		}

		return examsData;
	};

	const fetchSeatingInfo = async (studentId) => {
		try {
			const response = await axios.get("/api", {
				params: { studentId },
			});

			if (response.status === 204) return undefined;

			const { data } = response;
			const { seatingInfo } = data;

			return seatingInfo;
		} catch (error) {
			console.error("Error fetching seating info:", error);
			return undefined;
		}
	};

	const fetchUpcomingExams = async () => {
		try {
			const examsResponse = await axios.get("api/exams");

			const examsData = examsResponse.data;
			const sortedExams = examsData
				.slice()
				.sort((a, b) => new Date(a.date) - new Date(b.date));
			return sortedExams;
		} catch (error) {
			console.error("Error fetching upcoming exams:", error);
			return [];
		}
	};

	const onFinish = async (values) => {
		const studentId = values.studentId;
		const existingStudentId = parseInt(getCookie("studentId"));
		let upcomingExamLength = upcomingExams.length;

		if (studentId !== existingStudentId) {
			localStorage.removeItem("upcomingExams");
			setUpcomingExams([]);
			upcomingExamLength = 0;
		}

		try {
			const seatingInfo = await fetchSeatingInfo(studentId);
			setSeatingInfo(seatingInfo);
		} catch (error) {
			setSeatingInfo(undefined);
		}

		if (!upcomingExamLength) {
			const examsData = await fetchUpcomingExams();
			setUpcomingExams(examsData);
		}
	};

	useEffect(() => {
		if (upcomingExams.length) {
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
			console.error(
				"Error retrieving cached exams from localStorage:",
				error,
			);
		}
	}, []);

	useEffect(() => {
		try {
			const studentId = getCookie("studentId");

			if (studentId) {
				form.setFieldsValue({ studentId: parseInt(studentId) });
				form.submit();
			}
		} catch (error) {
			console.error("Error in useEffect:", error.message);
		}
	}, [form]);

	const onReset = () => {
		deleteCookie("studentId");
		localStorage.removeItem("upcomingExams");
		form.resetFields();
		setSeatingInfo(undefined);
		setUpcomingExams([]);
	};

	const validateStudentId = (_, value) => {
		if (
			!value ||
			(value.toString().length !== 6 && value.toString().length !== 12)
		) {
			return Promise.reject(
				new Error(
					"Invalid Register number. It must be either 6 or 12 digits long.",
				),
			);
		}
		return Promise.resolve();
	};

	return (
		<>
			<Container>
				<div
					className="flex h-screen flex-col w-full overflow-hidden" /* style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} */
				>
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
											validator: validateStudentId, // Custom validator function
										},
									]}
								>
									<InputNumber style={{ width: "100%" }} />
								</Form.Item>
								<Form.Item {...tailLayout}>
									<Button
										type="primary"
										htmlType="submit"
										style={{ backgroundColor: "brown" }}
									>
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
					</section>
					<section className="w-full h-[60%]">
						<div className="mx-auto w-full h-full">
							{seatingInfo || upcomingExams.length ? (
								<Segment
									seatingInfo={seatingInfo}
									upcomingExams={upcomingExams}
								/>
							) : null}
						</div>
					</section>
				</div>
			</Container>
		</>
	);
};

export default App;
