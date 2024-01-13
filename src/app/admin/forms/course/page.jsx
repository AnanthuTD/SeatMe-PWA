"use client";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { useRef } from "react";


import React, { useState, useEffect } from "react";
import {
	Input,
	Button,
	Row,
	Col,
	Form,
	Divider,
	Card,
	message,
	Alert,
	Select,
    FloatButton,
	Table,
	Checkbox
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import SelectProgram from "../../components/selectDepartment";
import Link from "next/link";
import { FileExcelOutlined } from "@ant-design/icons";

const DynamicCourseForm = () => {

	const [searchText, setSearchText] = useState(""); // State to store the search text
	const [searchedColumn, setSearchedColumn] = useState(""); // State to store the column being searched
	const searchInputRef = useRef(null);
	
	const [form] = Form.useForm();
	const [error, setError] = useState(null); // State to store error messages
	const [programs, setPrograms] = useState([]); // State to store program data

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	  };
	  
	  const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	  };
	  <Input
		ref={(node) => {
			setSearchInputRef(node);
		}}
		// ...
		/>
	  const getColumnSearchProps = (dataIndex, placeholder) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
		  <div style={{ padding: 8 }}>
			<Input
			  placeholder={placeholder}
			  value={selectedKeys[0]}
			  onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
			  onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
			  style={{ width: 188, marginBottom: 8, display: "block" }}
			/>
			<Button
			  type="primary"
			  onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
			  icon={<SearchOutlined />}
			  size="small"
			  style={{ width: 90, marginRight: 8 }}
			>
			  Search
			</Button>
			<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
			  Reset
			</Button>
		  </div>
		),
		filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
		onFilter: (value, record) =>
		  record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
		  onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
			  setTimeout(() => {
				if (searchInputRef.current && searchInputRef.current.select) {
				  searchInputRef.current.select();
				}
			  }, 100);
			}
		  },
		render: (text) =>
		  searchedColumn === dataIndex ? (
			<Highlighter
			  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
			  searchWords={[searchText]}
			  autoEscape
			  textToHighlight={text ? text.toString() : ""}
			/>
		  ) : (
			text
		  ),
	  });
	  

	const loadPrograms = async () => {
		try {
			const result = await axios.get("/api/admin/programs");
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	useEffect(() => {
		loadPrograms();
	}, []);

	const handleSubmission = async (values) => {
		console.log("Submitted values:", values);

		try {
			const result = await axios.post("/api/admin/courseentry/course", {
				courses: values.courses,
			});
			if (result.status === 200) {
				message.success(result.message);
				setError(null); // Clear any previous errors
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Course with ID '${error.response.data.value}' already exists`,
				);
			} 
			else if(error.response.status ===500) {
				message.error(
					`Course with ID '${error.response.data.value}' already exists`,
				);

			}else {
				setError("Something went wrong. Please try again."); // Set the error message
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.warning(
			"ID, Name, Semester, IsOpenCourse, and Program fields are required",
		);
	};

	const handleAlertClose = () => {
		setError(null); // Clear the error message
	};
	const [courses, setCourses] = useState([]);
	// let [semesterOptions, setSemesterOptions] = useState([]);
	const [selectedSemester, setSelectedSemester] = useState(null);
	const [semesterOptions, setSemesterOptions] = useState([1, 2, 3, 4, 5, 6, 7, 8,9,10]);
	const loadSemesterOptions = async () => {
		try {
		  const result = await axios.get("/api/admin/courses");
		  //setSemesterOptions(result.data.map(course => course.semester));
		} catch (error) {
		  console.error("Error fetching semesters: ", error);
		}
	  };

	const loadCourses = async (programId, semester) => {
		try {
			const result = await axios.get("/api/admin/courses", {
				params: { programId, semester },
			});
			setCourses(result.data);
		} catch (error) {
			console.error("Error fetching courses: ", error);
		}
	};
	// useEffect(() => {
	// 	// Load departments when the component mounts
	// 	loadSemesterOptions();
	// 	loadCourses(null,semesterOptions);	
	//   }, [semesterOptions]);

	useEffect(() => {
		form.setFieldsValue({ courses: [{}] });
	}, [form]);
	useEffect(() => {
		loadSemesterOptions();
	  }, []);
	  useEffect(() => {
		loadCourses(null, semesterOptions); // Load courses initially with a null programId
	  }, [semesterOptions]);
	  
	  useEffect(() => {
		console.log("Semester Options:", semesterOptions);
	  }, [semesterOptions]);
	  
	
	return (
		<div className="p-3">
			<Link href={"/admin/forms/course/import"}>
				<FloatButton
					tooltip={<div>Import</div>}
					icon={<FileExcelOutlined />}
					type="primary"
				/>
			</Link>
			{error && (
				<Alert
					message="Error"
					description={error}
					type="error"
					closable
					onClose={handleAlertClose}
					style={{ marginBottom: 16 }}
				/>
			)}
			<Form
				name="main"
				onFinish={handleSubmission}
				form={form}
				initialValues={{
					courses: [{}],
				}}
				onFinishFailed={onFinishFailed}
			>
				<Form.List name="courses">
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
									title={`Course ${field.name + 1}`}
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
												label="Course ID"
												rules={[
													{
														required: true,
														message:
															"Please enter the course ID",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "name"]}
												label="Course Name"
												rules={[
													{
														required: true,
														message:
															"Please enter the course name",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={16}>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[field.name, "semester"]}
												label="Semester"
												rules={[
													{
														required: true,
														message:
															"Please enter the semester",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={7} xxl={7}>
											<Form.Item
												name={[
													field.name,
													"isOpenCourse",
												]}
												label="Is Open Course"
												initialValue={false}
												valuePropName="checked"
											>
												<Checkbox defaultChecked={false}/>
											</Form.Item>
										</Col>
										<Col xs={24} md={24} lg={10} xxl={10}>
											<Form.Item
												name={[field.name, "program"]}
												label="Program"
												rules={[
													{
														required: true,
														message:
															"Please select the program",
													},
												]}
											>
												<SelectProgram
													options={programs}
													placeholder="Select Program"
												/>
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}
							<Button type="dashed" onClick={() => add()} block>
								+ Add Course
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
			<Card size="small" title="Courses" style={{ marginTop: 16 }}>
			{
		// 	semesterOptions ? (
		// 	<Select
		// 	// style={{ width: 200, marginBottom: 16 }}
		// 	// placeholder="Select Semester"
		// 	// onChange={(value) => setSelectedSemester(value)}
		// 	// value={selectedSemester}
		//   >
		// 	{/* <Select.Option value={null}>All Semesters</Select.Option>
		// 	{semesterOptions.map((semester) => (
		// 	  <Select.Option key={semester} value={semester}>
		// 		{semester}
		// 	  </Select.Option>
		// 	))} */}
		//   </Select>
		// 	) : (
		// 	<span>Loading semesters...</span>
		// 	)
			}

				<Table
				 dataSource={courses}
				 columns={[
				   {
					 title: 'ID',
					 dataIndex: 'id',
					 key: 'id',
					 ...getColumnSearchProps('id', 'Search ID'),
				   },
				   {
					 title: 'Name',
					 dataIndex: 'name',
					 key: 'name',
					 ...getColumnSearchProps('name', 'Search Name'),
				   },
					{
					title: 'Semester',
					dataIndex: 'semester',
					key: 'semester',
					...getColumnSearchProps('semester', 'Search Semester'),
					},
					{
						title: "Is Open Course",
						dataIndex: "isOpenCourse",
						key: "isOpenCourse",

						
						render: (text, record) => (
						  <span style={{ color: text  ? 'green' : 'red' }}>
							{text  ? 'Yes' : 'No'}
						  </span>
						),
					  },

				]}
				pagination={false}
				style={{ width: '100%' }}
				/>
			</Card>
		</div>
	);
};

export default DynamicCourseForm;
