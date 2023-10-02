import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button } from "antd";
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
		setSubmitStatus("pending");
		const status = await onFinish(values);
		setSubmitStatus(status ? "success" : "error");
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
					<Button
						type="primary"
						danger={submitStatus === "error" ? true : false}
						htmlType="submit"
						className={["w-full text-white submit-button"].join(
							" ",
						)}
					>
						{submitStatus === "idle"
							? "Submit"
							: submitStatus === "success"
							? "Update"
							: "Re-Submit"}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default CourseForm;
