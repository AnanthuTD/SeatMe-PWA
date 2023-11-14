import React, { useEffect, useState } from "react";
import {
	Form,
	DatePicker,
	Select,
	Button,
	Tooltip,
	Row,
	Col,
	message,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "@/lib/axiosPrivate";

import "./style.css";

const CourseForm = ({
	onFinish = () => {},
	formData = { courseId: "", courseName: "", timeCode: "AN", date: "" },
	formUpdate = () => {},
}) => {
	const [form] = Form.useForm();
	const [submitStatus, setSubmitStatus] = useState("idle"); // idle, success, error
	// const [currentData, setCurrentData] = useState({timeCode: "AN", date: ""})

	useEffect(() => {
		const fetchExamInfo = async () => {
			try {
				const result = await axios.get("/api/admin/exam/", {
					params: {
						courseId: formData.courseId,
					},
				});
				if (result.status === 204) return;
				const { date, timeCode } = result.data;
				updateFields({
					date,
					timeCode,
					courseId: formData.courseId,
					courseName: formData.courseName,
				});
			} catch (error) {
				message.warning(
					"something went wrong while fetching exam details",
				);
			}
		};
		fetchExamInfo();
	}, []);

	const updateFields = (formData) => {
		if (formData.date) formData.date = dayjs(formData.date);
		form.setFieldsValue(formData);
	};

	useEffect(() => {
		if (!formData.timeCode) formData.timeCode = "AN";
		updateFields(formData);
	}, [formData]);

	const handleFormValueChange = (changedValue, values) => {
		formUpdate(values);
	};

	const handleFormFinish = async (values) => {
		if (values.date) values.date = values.date.format("YYYY-MM-DD");
		const status = await onFinish(values);
		setSubmitStatus(status ? "success" : "error");
	};

	const handleFormReset = () => {
		const newFormData = {
			courseId: formData.courseId,
			courseName: formData.courseName,
			timeCode: "AN",
			date: "",
		};
		formUpdate(newFormData);
	};

	return (
		<div
			className={[
				"border rounded-lg shadow-md w-11/12 mx-auto p-6",
				submitStatus,
			].join(" ")}
		>
			<Form
				form={form}
				onValuesChange={handleFormValueChange}
				onFinish={handleFormFinish}
				onReset={handleFormReset}
			>
				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course ID:</span>
					<span className="text-blue-500">{formData.courseId}</span>
				</div>

				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course Name:</span>
					<span className="text-blue-500">{formData.courseName}</span>
				</div>

				<Form.Item name={"courseId"} hidden={true} />
				<Form.Item name={"courseName"} hidden={true} />

				<Form.Item
					allowClear
					label="Date"
					name="date"
					rules={[
						{
							required: true,
							message: "Please select a date",
						},
					]}
				>
					<DatePicker
						format={"YYYY-MM-DD"}
						className="w-full"
						allowClear
					/>
				</Form.Item>

				<Form.Item
					name={"timeCode"}
					label={"Time Code"}
					rules={[
						{
							required: true,
							message: "Please select a time code",
						},
					]}
				>
					<Select
						className="w-full"
						allowClear
						options={[
							{
								value: "AN",
								label: "AN",
							},
							{
								value: "FN",
								label: "FN",
							},
						]}
					/>
				</Form.Item>

				<Form.Item>
					<Row gutter={16} align="middle">
						<Col xs={24} sm={15} md={18} lg={20} xl={21}>
							<Button
								type="primary"
								danger={submitStatus === "error" ? true : false}
								htmlType="submit"
								className="w-full text-white submit-button"
							>
								{submitStatus === "idle"
									? "Submit"
									: "Re-Submit"}
							</Button>
						</Col>
						<Col xs={24} sm={9} md={4} lg={4} xl={3}>
							<Tooltip title="Reset">
								<Button
									type="primary"
									htmlType="reset"
									ghost
									icon={
										<ReloadOutlined
											style={{ color: "#d48806" }}
										/>
									}
									style={{
										backgroundColor: "#fffbe6",
										border: "solid #ffe58f",
										color: "#d48806",
									}}
								>
									Reset
								</Button>
							</Tooltip>
						</Col>
					</Row>
				</Form.Item>
			</Form>
		</div>
	);
};

export default CourseForm;
