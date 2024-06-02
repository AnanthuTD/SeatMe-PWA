"use client";
import React, { useEffect, useState } from "react";
import {
	Input,
	Button,
	InputNumber,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	FloatButton,
	Radio,
} from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import Link from "next/link";
import ErrorModel from "@/app/staff/components/errorModel";

const DynamicStudentForm = () => {
	const [failedRecords, setFailedRecords] = useState([]);
	const [secondLangs, setSecondLangs] = useState([]);
	const [courseOptions, setCourseOptions] = useState([]);

	const handleSubmission = async (values) => {
		const { students } = values;
		// console.log("values: ", students);

		try {
			const result = await axios.post("/api/staff/student", { students });

			const { failedRecords } = result.data;

			setFailedRecords(failedRecords);

			const warnMessage = "Some records were failed to insert!";
			const successMessage = "Inserted successfully";

			failedRecords.length
				? message.warning(warnMessage)
				: message.success(successMessage);
		} catch (error) {
			// console.log(error);
			message.error("Something went wrong");
		}
	};

	const loadSecondLang = async () => {
		const res = await axios.get("/api/staff/course/common2");
		const { data } = res;
		// console.log(data);
		setSecondLangs(data);
	};

	useEffect(() => {
		loadSecondLang();
	}, []);

	const getCoursesForRollNumber = (rollNumber) => {
		const programId = rollNumber.toString().substring(2, 4);
		return secondLangs.filter(
			(course) => course.programId === parseInt(programId, 10),
		);
	};

	const handleRollNumberChange = (rollNumber, index) => {
		const courses = getCoursesForRollNumber(rollNumber);
		const semesterCourses = courses.reduce((acc, course) => {
			if (!acc[course.semester]) {
				acc[course.semester] = [];
			}
			acc[course.semester].push(course);
			return acc;
		}, {});
		setCourseOptions((prevOptions) => {
			const newOptions = [...prevOptions];
			newOptions[index] = Object.entries(semesterCourses).map(
				([semester, courses]) => ({
					label: `Semester ${semester}`,
					options: courses.map((course) => ({
						label: course.name,
						value: course.id,
					})),
				}),
			);
			return newOptions;
		});
	};

	return (
		<div className="p-3">
			<Link href={"/staff/student/insert/import"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			<Form
				name="main"
				onFinish={handleSubmission}
				initialValues={{
					students: [{}],
				}}
			>
				<Form.List name="students">
					{(fields, { add, remove }) => (
						<div
							style={{
								display: "flex",
								rowGap: 16,
								flexDirection: "column",
							}}
						>
							{fields.map((field) => (
								<Card
									size="small"
									title={`Item ${field.name + 1}`}
									key={field.key}
									extra={
										<CloseOutlined
											onClick={() => {
												remove(field.name);
											}}
										/>
									}
								>
									<Row gutter={16}>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "id"]}
												label="Registration No"
												rules={[
													{
														type: "number",
														required: true,
														message:
															"Please enter a valid register number",
														max: 999999999999,
														min: 100000000000,
													},
												]}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{ width: "100%" }}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "rollNumber"]}
												label="Roll No"
												rules={[
													{
														required: true,
														type: "number",
														message:
															"Please enter a valid Roll number",
														max: 999999,
														min: 100000,
													},
												]}
												onChange={(e) =>
													handleRollNumberChange(
														e.target.value,
														field.name,
													)
												}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{ width: "100%" }}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "name"]}
												label="Name"
												rules={[
													{
														required: true,
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={16}>
										<Col>
											<Form.Item
												name={[field.name, "semester"]}
												rules={[{ required: true }]}
												label="Semester"
											>
												<Input />
											</Form.Item>
										</Col>
										<Col>
											<Form.Item
												name={[field.name, "email"]}
												label="Email"
											>
												<Input type="email" />
											</Form.Item>
										</Col>
										<Col>
											<Form.Item
												name={[field.name, "phone"]}
												label="Phone"
												rules={[
													{
														max: 9999999999,
														min: 1000000000,
														type: "number",
													},
												]}
											>
												<InputNumber
													placeholder="Input a number"
													controls={false}
													style={{ width: "100%" }}
												/>
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={16}>
										{courseOptions[field.name]?.map(
											(section, index) => (
												<Col key={index}>
													<Form.Item label={section.label}>
														<Radio.Group
															options={section.options}
														/>
													</Form.Item>
												</Col>
											),
										)}
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Item
							</Button>
						</div>
					)}
				</Form.List>
				<Divider />
				<Row gutter={16}>
					<Col sm={24} md={5}>
						<Button ghost type="primary" htmlType="submit">
							Submit All
						</Button>
					</Col>
				</Row>
			</Form>
			{failedRecords.length ? (
				<ErrorModel
					failedRecords={failedRecords}
					setFailedRecords={setFailedRecords}
					fileName={"students"}
				/>
			) : null}
		</div>
	);
};

export default DynamicStudentForm;
