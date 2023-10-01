import React from "react";
import { Form, Input, DatePicker, Select, Button } from "antd";

const { Option } = Select;

const CourseForm = ({ onFinish }) => {
	const onFinishHandler = (values) => {
		// Handle form submission here, you can send the values to an API or perform any other action.
		onFinish(values);
	};

	return (
		<div className="border rounded-lg shadow-md w-11/12 mx-auto p-6 bg-white">
			<h2 className="text-2xl font-semibold mb-4">Course Form</h2>
			<Form
				name="courseForm"
				onFinish={onFinishHandler}
				initialValues={{ timecode: "AN" }} // Set initial value for timecode
			>
				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course ID:</span>
					<span className="text-blue-500">CID12345</span>
				</div>

				<div className="flex items-center justify-between mb-4">
					<span className="text-gray-600">Course Name:</span>
					<span className="text-blue-500">Sample Course</span>
				</div>

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
					<DatePicker className="w-full" />
				</Form.Item>

				<Form.Item
					label="Time Code"
					name="timecode"
					rules={[
						{
							required: true,
							message: "Please select a time code",
						},
					]}
				>
					<Select style={{ width: "100%" }}>
						<Option value="AN">AN</Option>
						<Option value="FN">FN</Option>
					</Select>
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
