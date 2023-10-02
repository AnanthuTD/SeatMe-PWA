import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button, Tooltip, Row, Col } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import "./style.css";

const CourseForm = ({
	onFinish = () => {},
	formData = { courseId: "", timeCode: "AN", date: "" },
	formUpdate = () => {},
}) => {
	const [form] = Form.useForm();
	const [submitStatus, setSubmitStatus] = useState("idle"); // idle, success, error

	const updateFields = (formData) => {
		form.setFieldsValue(formData);
	};

	useEffect(() => {
		updateFields(formData);
	}, [formData]);

	const handleFormValueChange = (changedValue, values) => {
		formUpdate(values);
	};

	const handleFormFinish = async (values) => {
		const status = await onFinish(values);
		setSubmitStatus(status ? "success" : "error");
	};

	const handleFormReset = () => {
		const newFormData = { courseId: "", timeCode: "AN", date: "" };
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
				name="courseForm"
				onValuesChange={handleFormValueChange}
				onFinish={handleFormFinish}
				/* initialValues={{
					timeCode: formData.timeCode,
					date: dayjs(formData.timeCode),
					courseId: formData.courseId,
				}} */
				onReset={handleFormReset}
			>
				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course ID:</span>
					<span className="text-blue-500">{formData.courseId}</span>
				</div>

				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course Name:</span>
					<span className="text-blue-500">name</span>
				</div>

				<Form.Item name={"courseId"} hidden={true} />

				<Form.Item
					label="Date"
					name="date"
					rules={[
						{
							required: true,
							message: "Please select a date",
						},
					]}
				>
					<DatePicker className="w-full" allowClear />
				</Form.Item>

				<Form.Item name={"timeCode"} label={"Time Code"}>
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
									: submitStatus === "success"
									? "Update"
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
