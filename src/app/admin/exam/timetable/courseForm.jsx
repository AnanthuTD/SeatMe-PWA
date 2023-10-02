import React, { useEffect } from "react";
import { Form, DatePicker, Select, Button } from "antd";

const CourseForm = ({
	onFinish = () => {},
	formData = { courseId: "", timeCode: "AN", date: "" },
	formUpdate = () => {},
}) => {
	const [form] = Form.useForm();

	const updateFields = (formData) => {
		form.setFieldsValue(formData);
	};

	useEffect(() => {
		updateFields(formData);
	}, [formData]);

	const handleFormValueChange = (changedValue, values) => {
		formUpdate(values);
	};

	const handleFormFinish = (values) => {
		onFinish(values);
	};

	return (
		<div className="border rounded-lg shadow-md w-11/12 mx-auto p-6 bg-white">
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
						htmlType="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white"
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default CourseForm;
