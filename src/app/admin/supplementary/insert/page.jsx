"use client";
import React, { useEffect, useState } from "react";
import {
	Form,
	InputNumber,
	Button,
	Space,
	Divider,
	ConfigProvider,
	Row,
	Col,
	message,
	FloatButton,
} from "antd";
import {
	MinusCircleOutlined,
	PlusOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import DepProSemExaSelect from "../../components/depProSemExaSelect";
import ErrorModel from "./errorModel";
import ImportModel from "./import";

const Page = () => {
	return (
		<ConfigProvider
			theme={{
				components: {
					InputNumber: {
						controlWidth: 140,
					},
				},
			}}
		>
			<DynamicForm />
		</ConfigProvider>
	);
};

const DynamicForm = () => {
	const [form] = Form.useForm();
	const [courseIds, setCourseIds] = useState([]);
	const [failedRecords, setFailedRecords] = useState([]);
	const [studentIds, setStudentIds] = useState([]);
	const [displayImport, setDisplayImport] = useState(false);
	const [reset, toggleReset] = useState(false);

	const handleCourseId = (values) => {
		const courseIds = values.courses.map((c) => c.id);
		form.resetFields();
		setCourseIds(courseIds);
	};

	useEffect(() => {
		if (reset) {
			form.resetFields();
			setCourseIds([]);
			setFailedRecords([]);
			setStudentIds([]);
			toggleReset(false);
		}
	}, [reset]);

	return (
		<>
			<DepProSemExaSelect value={handleCourseId} reset={reset} />
			<Divider />
			<Form
				name="dynamic_form_nest_item"
				onFinish={onFinish}
				autoComplete="off"
				onValuesChange={handleValuesChange}
				initialValues={{ studentIds: [{}] }}
				form={form}
			>
				<Form.List name="studentIds">
					{(fields, { add, remove }) => (
						<>
							<Row gutter={[16, 16]}>
								{fields.map(
									({ key, name, ...restField }, index) => (
										<Col
											xs={24}
											sm={12}
											md={8}
											lg={6}
											key={key}
										>
											<Space
												align="baseline"
												style={{ marginBottom: 8 }}
											>
												<Form.Item
													{...restField}
													name={[name, "id"]}
												>
													<InputNumber
														min={100000000000}
														max={999999999999}
														formatter={(value) =>
															`${value}`
														}
														parser={(value) =>
															value.replace(
																/\D/g,
																"",
															)
														}
													/>
												</Form.Item>
												<MinusCircleOutlined
													onClick={() => remove(name)}
												/>
											</Space>
										</Col>
									),
								)}
							</Row>
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									icon={<PlusOutlined />}
								>
									Add Students
								</Button>
							</Form.Item>

							<Divider />

							<Form.Item>
								<Button
									type="primary"
									ghost
									onClick={() => setDisplayImport(true)}
									icon={<PlusOutlined />}
								>
									Import Students
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider />

				<Row justify={"center"}>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Row>
			</Form>

			<FloatButton
				onClick={() => toggleReset(!reset)}
				type="default"
				style={{
					backgroundColor: "#ffe6e6",
					border: "solid #ff8080",
				}}
				icon={<ReloadOutlined style={{ color: "#ff8080" }} />}
			/>

			{displayImport ? (
				<ImportModel
					setDisplayImport={setDisplayImport}
					onFinish={setStudentIds}
				/>
			) : null}

			{failedRecords.length ? (
				<ErrorModel
					failedRecords={failedRecords}
					setFailedRecords={setFailedRecords}
				/>
			) : null}
		</>
	);

	function formatStudentIds(studentIds = []) {
		return studentIds.map((studentId) => studentId.id);
	}

	async function onFinish(values) {
		let ids = [];
		if (studentIds.length) ids = formatStudentIds(studentIds);
		else if (values.studentIds.length)
			ids = formatStudentIds(values.studentIds);
		else {
			message.warning("Please provided studentIds !");
			return null;
		}
		ids = ids.filter((id) => (id ? true : false));
		try {
			const response = await axios.post(
				"/api/admin/student/supplementary",
				{ courseIds, studentIds: ids },
			);
			const { failedRecords } = response.data;
			if (failedRecords.length > 0)
				message.warning("Failed to import some records!");
			else message.success("Import Success");
			setFailedRecords(failedRecords);
		} catch (error) {
			console.error(error);
			message.error("An error occurred at the server!");
		} finally {
			setStudentIds([]);
		}
	}

	function handleValuesChange(changedValues, allValues) {
		const lastFieldIndex = allValues.studentIds.length - 1;
		const lastField = allValues.studentIds[lastFieldIndex];

		if (lastField?.id && changedValues.studentIds[lastFieldIndex]) {
			// const idLength = String(lastField.id).length;
			// if (idLength === 12)
			addField();
		}
	}

	function addField() {
		const { setFieldsValue, getFieldValue } = form;
		const newFields = [...getFieldValue("studentIds")];
		newFields.push({ id: "" });
		setFieldsValue({
			studentIds: newFields,
		});
	}
};

export default Page;
