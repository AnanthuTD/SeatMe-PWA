"use client";
import React, { useState } from "react";
import { Input, Button, InputNumber, Row, Col, Form } from "antd";
import DepProSemCouSelect from "../../components/depProSemCouSelect";

const DynamicStudentForm = () => {
	const [numForms, setNumForms] = useState(1);
	const [forms, setForms] = useState([{ id: 1, data: {} }]);
	const [semester, setSemester] = useState("1");
	const [program, setProgram] = useState("");
	const [department, setDepartment] = useState("");
	// const [form] = Form.useForm();

	const addForm = () => {
		const newId = numForms + 1;
		setNumForms(newId);
		setForms([...forms, { id: newId, data: {} }]);
	};

	const clearForm = (id) => {
		const updatedForms = forms.map((form) =>
			form.id === id ? { ...form, data: {} } : form,
		);
		setForms(updatedForms);
	};

	const handleSubmission = () => {
		// Collect and submit data from all forms and merge with common fields
		const formData = forms.map((form) => form.data);
		const finalFormData = formData.map((data) => ({
			...data,
			semester,
			program,
			department,
		}));
		console.log(finalFormData);
		// You can submit this data to your server or perform any desired action.
	};

	const handleFormChange = (id, changedValues) => {
		const updatedForms = forms.map((form) => {
			if (form.id === id) {
				return {
					...form,
					data: {
						...form.data,
						...changedValues,
					},
				};
			}
			return form;
		});
		setForms(updatedForms);
	};

	const handleChange = (e) => {
		const { value } = e.target;
		let newCleanedValue = "";

		for (let i = 0; i < value.length; i++) {
			const char = value[i];
			if (!isNaN(parseInt(char, 10)) || char === "-" || char === "") {
				newCleanedValue += char;
			}
		}

		e.target.value = newCleanedValue;
	};

	return (
		<div>
			<DepProSemCouSelect />
			<Form
				// form={form}
				name="main"
				onFinish={handleSubmission}
				// initialValues={{ semester, program, department }}
			>
				{Array.from({ length: numForms }, (_, index) => (
					<Form.Item
						key={index + 1}
						onValuesChange={(values) =>
							handleFormChange(index + 1, values)
						}
					>
						<Row gutter={16}>
							<Col xs={24} md={24} lg={7} xxl={7}>
								<Form.Item
									name="id"
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
									name="rollNumber"
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
									name="name"
									label="Name"
									rules={[{ required: true }]}
								>
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col>
								<Form.Item name="email" label="Email">
									<Input type="email" />
								</Form.Item>
							</Col>
							<Col>
								<Form.Item
									name="phone"
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
							<Col>
								<Button
									type="primary"
									onClick={() => {
										clearForm(index + 1);
										form.resetFields();
									}}
									htmlType="clear"
								>
									Clear Form
								</Button>
							</Col>
						</Row>
					</Form.Item>
				))}
				<Row gutter={16}>
					<Col sm={24} md={5}>
						<Button ghost type="primary" onClick={addForm}>
							Add Form
						</Button>
					</Col>
					<Col sm={24} md={5}>
						<Button ghost type="primary" htmlType="submit">
							Submit All
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default DynamicStudentForm;
