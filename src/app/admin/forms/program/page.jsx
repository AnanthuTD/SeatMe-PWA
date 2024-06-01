// "use client";

// import React, { useState, useEffect } from "react";
// import {
// 	Input,
// 	Button,
// 	Row,
// 	Col,
// 	Form,
// 	Divider,
// 	Card,
// 	message,
// 	Alert,
// 	Select,
// 	FloatButton,
// 	Table,
// 	Typography,
// } from "antd";
// import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
// import axios from "@/lib/axiosPrivate";
// import SelectDepartment from "../../components/selectDepartment";
// import Link from "next/link";

// const { Title } = Typography;
// const DynamicProgramForm = () => {
// 	const [form] = Form.useForm();
// 	const [error, setError] = useState(null); // State to store error messages
// 	const [departments, setDepartments] = useState([]); // State to store department data
// 	const [selectedDepartmentCode, setSelectedDepartmentCode] = useState(null);

// 	const departmentOptions = departments.map(department => ({
// 		value: department.code,
// 		label: department.name,
// 	  }));
// 	const handleDelete = async (record) => {
// 		try {
// 		  // Make an API call or perform the necessary logic to delete the program
// 		  // You can use axios or any other method for API calls
// 		  const result = await axios.delete(`/api/admin/programentry/program/${record.id}`);
// 		  if (result.status === 200) {
// 			const msg= "Program with id "+record.id+" deleted";
// 			message.success(msg);
// 			// Reload the programs after deletion
// 			loadPrograms();
// 		  } else {
// 			message.error("Delete failed");
// 		  }
// 		} catch (error) {
// 		  console.error(error);
// 		  message.error("Something went wrong. Please try again.");
// 		}
// 	  };
	  
	
// 	  const handleUpdate = async (updatedProgram) => {
// 		console.log(`Updating record with ID ${updatedProgram.id}`);
// 		console.log(`Updating record with ID ${updatedProgram.name}`);
// 		console.log(`Updating record with ID ${updatedProgram.departmentCode}`);	
// 		console.log(updatedProgram);
// 		// You can perform any necessary logic here to handle the table update
// 		try {
// 			const result = await axios.patch("/api/admin/programentry/programupdate/", [updatedProgram]);
// 			if (result.status === 200) {
// 				message.success(result.data.message);
// 				// Optionally, reload departments or update state with the new data
// 				loadPrograms();
// 			} else {
// 				message.error("Update failed");
// 			}
// 		} catch (error) {
// 			console.error("Error updating program:", error);
// 			message.error("Something went wrong. Please try again.");
// 		}
// 	  };
// 	const loadDepartments = async () => {
// 		try {
// 			const result = await axios.get("/api/admin/departments");
// 			// console.log("departments data", result.data);
// 			setDepartments(result.data);
// 		} catch (error) {
// 			console.error("Error fetching departments: ", error);
// 		}
// 	};

// 	useEffect(() => {
// 		loadDepartments();
// 	}, []);

// 	const handleSubmission = async (values) => {
// 		// console.log("Submitted values:", values);

// 		try {
// 			const result = await axios.post("/api/admin/programentry/program", {
// 				programs: values.programs,
// 			});
// 			if (result.status === 200) {
// 				message.success(result.message);
// 				setError(null); // Clear any previous errors
// 			} else message.error("Submit failed");
// 		} catch (error) {
// 			// console.log(error);
// 			if (error.response.status === 400) {
// 				message.error(
// 					`Program with ID '${error.response.data.value}' already exists`,
// 				);
// 			} else {
// 				setError("Something went wrong. Please try again."); // Set the error message
// 			}
// 		}
// 	};

// 	const onFinishFailed = (errorInfo) => {
// 		message.warning(
// 			"ID, Name, Department, Duration, and Level are required",
// 		);
// 	};

// 	const handleAlertClose = () => {
// 		setError(null);
// 	};

// 	const [programs, setPrograms] = useState([]);

// 	const loadPrograms = async () => {
// 		try {
// 			const result = await axios.get("/api/admin/programs");
// 			setPrograms(result.data);
// 		} catch (error) {
// 			console.error("Error fetching programs: ", error);
// 		}
// 	};

// 	useEffect(() => {
// 		loadPrograms();
// 	}, []);

// 	useEffect(() => {
// 		form.setFieldsValue({ programs: [{}] });
// 	}, [form]);

// 	const handleTableChange = (record, field, value) => {
// 		console.log(`Changing ${field} of record with ID ${record.id} to ${value}`);
// 		setPrograms((prevPrograms) =>
// 			prevPrograms.map((item) =>
// 			  item.id === record.id ? { ...item, [field]: value } : item
// 			)
// 		  );
// 		// You can perform any necessary logic here to handle the table change
// 		const newPrograms = [...programs];
// 		const index = newPrograms.findIndex(program => program.id === record.id);
// 		if (index !== -1) {
// 			newPrograms[index][field] = value;
// 			setPrograms(newPrograms);
// 			// Call the update function when the input loses focus
// 			handleUpdate(newPrograms[index]);
// 		}
// 	  };
// 	const columns = [
// 		{
// 			title: "ID",
// 			dataIndex: "id",
// 			key: "id",
// 		},
// 		{
// 			title: "Name",
// 			dataIndex: "name",
// 			key: "name",
// 			render: (text, record) => (
// 				<Input
// 					value={text}
// 					onChange={(e) => handleTableChange(record, "name", e.target.value)}
// 					onBlur={() => handleUpdate(record)}
// 				/>
// 			),
// 		},
// 		{
// 			title: "Duration",
// 			dataIndex: "duration",
// 			key: "duration",
// 			render: (text, record) => (
// 				<Input
// 					value={text}
// 					onChange={(e) => handleTableChange(record, "duration", e.target.value)}
// 					onBlur={() => handleUpdate(record)}

// 				/>
// 			),
// 		},
// 		{
// 			title: "Level",
// 			dataIndex: "level",
// 			key: "level",
// 			render: (text, record) => (
// 				<Input
// 					value={text}
// 					onBlur={() => handleUpdate(record)}
// 					onChange={(e) => handleTableChange(record, "level", e.target.value)}
// 				/>
// 			),
			
// 		},
// 		{
// 			title: "Department",
// 			dataIndex: "department",
// 			key: "department",
// 			render: (text, record) => (
// 			  <Select
// 				options={departmentOptions}
// 				placeholder="Select Department"
// 				value={text}
// 				onChange={(selectedValue) => handleTableChange(record, "department", selectedValue)}
// 				onBlur={() => handleUpdate(record)}
// 			  />
// 			),
// 		  },
		  
// 		{
// 			title: "Abbreviation",
// 			dataIndex: "abbreviation",
// 			key: "abbreviation",
// 			render: (text, record) => (
// 				<Input
// 					value={text}
// 					onChange={(e) => handleTableChange(record, "abbreviation", e.target.value)}
// 					onBlur={() => handleUpdate(record)}
// 				/>
// 			),
// 		},
// 		{
// 			title: "Is Aided",
// 			dataIndex: "isAided",
// 			key: "isAided",
// 			render: (text, record) => (
// 				<Input
// 					value={text}
// 					onChange={(e) => handleTableChange(record, "isAided", e.target.value)}
// 					onBlur={() => handleUpdate(record)}
// 				/>
// 			),
			  
// 		},
// 		{
// 			title: "Actions",
// 			key: "actions",
// 			render: (_, record) => (
// 			  <Button type="link" danger onClick={() => handleDelete(record)}>
// 				Delete
// 			  </Button>
// 			),
// 		  },
// 	];

// 	return (
// 		<div className="p-3">
// 			<Link href={"/admin/forms/program/import"}>
// 				<FloatButton
// 					tooltip={<div>Import</div>}
// 					icon={<FileExcelOutlined />}
// 					type="primary"
// 				/>
// 			</Link>
// 			{error && (
// 				<Alert
// 					message="Error"
// 					description={error}
// 					type="error"
// 					closable
// 					onClose={handleAlertClose}
// 					style={{ marginBottom: 16 }}
// 				/>
// 			)}
// 			<Form
// 				name="main"
// 				onFinish={handleSubmission}
// 				form={form}
// 				initialValues={{
// 					programs: [{}],
// 				}}
// 				onFinishFailed={onFinishFailed}
// 			>
// 				<Form.List name="programs">
// 					{(fields, { add, remove }) => (
// 						<div
// 							style={{
// 								display: "flex",
// 								rowGap: 16,
// 								flexDirection: "column",
// 							}}
// 						>
// 							{fields.map((field) => (
// 								<Card
// 									size="small"
// 									title={`Program ${field.name + 1}`}
// 									key={field.key}
// 									extra={
// 										<CloseOutlined
// 											onClick={() => {
// 												remove(field.name);
// 											}}
// 										/>
// 									}
// 								>
// 									<Row gutter={16}>
// 										<Col xs={24} md={24} lg={7} xxl={7}>
// 											<Form.Item
// 												name={[field.name, "id"]}
// 												label="Program ID"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please enter the program ID",
// 													},
// 												]}
// 											>
// 												<Input />
// 											</Form.Item>
// 										</Col>
// 										<Col xs={24} md={24} lg={10} xxl={10}>
// 											<Form.Item
// 												name={[field.name, "name"]}
// 												label="Program Name"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please enter the program name",
// 													},
// 												]}
// 											>
// 												<Input />
// 											</Form.Item>
// 										</Col>
// 										<Col xs={24} md={24} lg={10} xxl={10}>
// 											<Form.Item
// 												name={[
// 													field.name,
// 													"abbreviation",
// 												]}
// 												label="Name abbreviation"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please enter the program name abbreviation",
// 													},
// 												]}
// 											>
// 												<Input />
// 											</Form.Item>
// 										</Col>
// 									</Row>
// 									<Row gutter={16}>
// 										<Col xs={24} md={24} lg={7} xxl={7}>
// 											<Form.Item
// 												name={[
// 													field.name,
// 													"departmentCode",
// 												]}
// 												label="Department"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please select the department",
// 													},
// 												]}
// 											>
// 												<SelectDepartment
// 													options={departments}
// 													placeholder="Select Department"
// 												/>
// 											</Form.Item>
// 										</Col>
// 										<Col xs={24} md={24} lg={7} xxl={7}>
// 											<Form.Item
// 												name={[field.name, "duration"]}
// 												label="Duration (Years)"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please enter the duration in years",
// 													},
// 												]}
// 											>
// 												<Input />
// 											</Form.Item>
// 										</Col>
// 										<Col xs={24} md={24} lg={7} xxl={7}>
// 											<Form.Item
// 												name={[field.name, "level"]}
// 												label="Level"
// 												rules={[
// 													{
// 														required: true,
// 														message:
// 															"Please enter the level (UG or PG)",
// 													},
// 												]}
// 											>
// 												<Select
// 													defaultValue={"UG"}
// 													options={[
// 														{
// 															key: "ug",
// 															value: "UG",
// 														},
// 														{
// 															key: "pg",
// 															value: "PG",
// 														},
// 													]}
// 													placeholder="Select Department"
// 												/>
// 											</Form.Item>
// 										</Col>
// 									</Row>
// 								</Card>
// 							))}
// 							<Button type="dashed" onClick={() => add()} block>
// 								+ Add Program
// 							</Button>
// 						</div>
// 					)}
// 				</Form.List>
// 				<Divider />
// 				<Row gutter={16}>
// 					<Col sm={24} md={5}>
// 						<Button ghost type="primary" htmlType="submit">
// 							Submit All
// 						</Button>
// 					</Col>
// 				</Row>
// 			</Form>
// 			<div>
// 				<Title
// 					level={4}
// 					style={{
// 						color: "black",
// 						fontWeight: "bold",
// 						marginTop: "20px",
// 					}}
// 				>
// 					Programs
// 				</Title>
// 				<Select
// 					style={{ width: 200, marginBottom: 16 }}
// 					placeholder="Select Department"
// 					onChange={(value) => setSelectedDepartmentCode(value)}
// 				>
// 					<Select.Option value={null}>All Departments</Select.Option>
// 					{departments.map((dept) => (
// 						<Select.Option key={dept.code} value={dept.code}>
// 							{dept.name}
// 						</Select.Option>
// 					))}
// 				</Select>
// 				<Table
// 					dataSource={programs.filter((program) => {
// 						/* console.log(
// 							"Program Department Code:",
// 							program.departmentCode,
// 						);
// 						console.log(
// 							"Selected Department Code:",
// 							selectedDepartmentCode,
// 						); */

// 						return selectedDepartmentCode
// 							? program.departmentCode.toLowerCase() ===
// 									selectedDepartmentCode.toLowerCase()
// 							: true;
// 					})}
// 					columns={columns}
// 					pagination={false}
// 					rowKey="id"
// 				/>
// 			</div>
// 		</div>
// 	);
// };

// export default DynamicProgramForm;



"use client";

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
  Typography,
} from "antd";
import { CloseOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "@/lib/axiosPrivate";
import SelectDepartment from "../../components/selectDepartment";
import Link from "next/link";

const { Title } = Typography;

const DynamicProgramForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState(null);
  const [programs, setPrograms] = useState([]);

  const departmentOptions = departments.map((department) => ({
    value: department.code,
    label: department.name,
  }));

  useEffect(() => {
    loadDepartments();
    loadPrograms();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ programs: [{}] });
  }, [form]);

  const loadDepartments = async () => {
    try {
      const result = await axios.get("/api/admin/departments");
      setDepartments(result.data);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  const loadPrograms = async () => {
    try {
      const result = await axios.get("/api/admin/programs");
      setPrograms(result.data);
    } catch (error) {
      console.error("Error fetching programs: ", error);
    }
  };

  const handleTableChange = (record, field, value) => {
    console.log(`Changing ${field} of record with ID ${record.id} to ${value}`);
    setPrograms((prevPrograms) =>
      prevPrograms.map((item) =>
        item.id === record.id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleUpdate = async (updatedProgram) => {
    console.log(`Updating record with ID ${updatedProgram.id}`);
    try {
      const result = await axios.patch(
        "/api/admin/programentry/programupdate/",
        [updatedProgram]
      );
      if (result.status === 200) {
        message.success(result.data.message);
        loadPrograms();
      } else {
        message.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating program:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (record) => {
    try {
		console.log(`----------------------------------------result`);
      const result = await axios.delete(
        `/api/admin/programentry/program/${record.id}`
      );
	  console.log(`----------------------------------------result: ${result}`);
      if (result.status === 200) {
        message.success(`Program with id ${record.id} deleted`);
        loadPrograms();
      } else {
        message.error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const handleSubmission = async (values) => {
    try {
      const result = await axios.post("/api/admin/programentry/program", {
        programs: values.programs,
      });
	  
      if (result.status === 200) {
        message.success(result.message);
        setError(null);
      } else message.error("Submit failed");
    } catch (error) {
      if (error.response.status === 400) {
        message.error(
          `Program with ID '${error.response.data.value}' already exists`
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.warning(
      "ID, Name, Department, Duration, and Level are required"
    );
  };

  const handleAlertClose = () => {
    setError(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleTableChange(record, "name", e.target.value)}
          onBlur={() => handleUpdate(record)}
        />
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleTableChange(record, "duration", e.target.value)}
          onBlur={() => handleUpdate(record)}
        />
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (text, record) => (
        <Input
          value={text}
          onBlur={() => handleUpdate(record)}
          onChange={(e) => handleTableChange(record, "level", e.target.value)}
        />
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentCode",
      key: "departmentCode",
      render: (text, record) => (
        <Select
          options={departmentOptions}
          placeholder="Select Department"
          value={text}
		  style={{width:"200px"}}
          onChange={(selectedValue) =>
            handleTableChange(record, "departmentCode", selectedValue)
          }
          onBlur={() => handleUpdate(record)}
        />
      ),
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      key: "abbreviation",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleTableChange(record, "abbreviation", e.target.value)}
          onBlur={() => handleUpdate(record)}
        />
      ),
    },
    {
      title: "Is Aided",
      dataIndex: "isAided",
      key: "isAided",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleTableChange(record, "isAided", e.target.value)}
          onBlur={() => handleUpdate(record)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Link href={"/admin/forms/program/import"}>
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
          programs: [{}],
        }}
        onFinishFailed={onFinishFailed}
      >
        <Form.List name="programs">
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
                  title={`Program ${field.name + 1}`}
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
                        label="Program ID"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the program ID",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={10} xxl={10}>
                      <Form.Item
                        name={[field.name, "name"]}
                        label="Program Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the program name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={10} xxl={10}>
                      <Form.Item
                        name={[field.name, "abbreviation"]}
                        label="Name abbreviation"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the program name abbreviation",
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
                        name={[field.name, "departmentCode"]}
                        label="Department"
                        rules={[
                          {
                            required: true,
                            message: "Please select the department",
                          },
                        ]}
                      >
                        <SelectDepartment
                          options={departments}
                          placeholder="Select Department"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={7} xxl={7}>
                      <Form.Item
                        name={[field.name, "duration"]}
                        label="Duration (Years)"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the duration in years",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={7} xxl={7}>
                      <Form.Item
                        name={[field.name, "level"]}
                        label="Level"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the level (UG or PG)",
                          },
                        ]}
                      >
                        <Select
                          defaultValue={"UG"}
                          options={[
                            {
                              key: "ug",
                              value: "UG",
                            },
                            {
                              key: "pg",
                              value: "PG",
                            },
                          ]}
                          placeholder="Select Level"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Add Program
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
      <div>
        <Title
          level={4}
          style={{
            color: "black",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Programs
        </Title>
        <Select
          style={{ width: 200, marginBottom: 16 }}
          placeholder="Select Department"
          onChange={(value) => setSelectedDepartmentCode(value)}
        >
          <Select.Option value={null}>All Departments</Select.Option>
          {departments.map((dept) => (
            <Select.Option key={dept.code} value={dept.code}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>
        <Table
          dataSource={programs.filter((program) => {
            return selectedDepartmentCode
              ? program.departmentCode.toLowerCase() ===
                selectedDepartmentCode.toLowerCase()
              : true;
          })}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default DynamicProgramForm;
