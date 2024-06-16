"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	Input,
	Table,
	Space,
	Popconfirm,
	message,
	Tag,
	Form,
	Select,
	Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./table.css";
import axios from "@/lib/axiosPrivate";
import Highlighter from "react-highlight-words";
import { useAccount } from "@/context/accountContext";

async function fetchOpenCourses(programId) {
	const apiUrl = "/api/staff/open-courses";

	let openCourses = [];
	try {
		const response = await axios.get(apiUrl, {
			params: { programId },
		});
		openCourses = response.data;
	} catch (err) {
		console.error("Error fetching open courses: ", err);
	}

	return openCourses || [];
}

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	programs,
	required,
	...restProps
}) => {
	const [openCourses, setOpenCourses] = useState([]);

	useEffect(() => {
		if (dataIndex === "openCourseId") {
			const fun = async () => {
				const openCourses = await fetchOpenCourses(record.programId);
				setOpenCourses(openCourses);
			};
			fun();
		}
	}, []);

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					style={{
						margin: 0,
					}}
					name={dataIndex}
					rules={[
						{
							required: required,
							message: `${title} is required.`,
						},
					]}
				>
					{dataIndex === "openCourseId" || dataIndex === "programId" ? (
						<Select
							options={
								dataIndex === "openCourseId" ? openCourses : programs
							}
							fieldNames={{ label: "name", value: "id" }}
						/>
					) : (
						<Input />
					)}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const EditableTable = ({
	dataSource,
	setDataSource = () => {},
	loading = false,
	setSorterField = () => {},
	setSorterOrder = () => {},
	searchedColumn = [""],
	setSearchedColumn = () => {},
	searchText = [""],
	setSearchText = () => {},
	handleReset = () => {},
}) => {
	const { user } = useAccount();
	const searchInput = useRef(null);
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState("");
	const isEditing = (record) => record.id === editingId;

	const edit = (record) => {
		form.setFieldsValue({
			...record,
		});
		console.log();
		setEditingId(record.id);
	};
	const cancel = () => {
		setEditingId("");
	};

	const handleSearch = async (selectedKeys, confirm, dataIndex) => {
		setSearchText([selectedKeys[0]]);
		setSearchedColumn([dataIndex]);
		confirm();
	};

	const handleTableChange = (pagination, filters, sorter) => {
		// Handle table sorting
		if (sorter.field) {
			setSorterField(sorter.field);
			let order = sorter.order === "descend" ? "desc" : "asc";
			setSorterOrder(order);
		}
	};

	const textColumnSorter = (a, b) => {
		return a.localeCompare(b);
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => {
						setSelectedKeys(e.target.value ? [e.target.value] : []);
					}}
					onPressEnter={() => {
						handleSearch(selectedKeys, confirm, dataIndex);
					}}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => {
							handleSearch(selectedKeys, confirm, dataIndex);
						}}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={async () => {
							await clearFilters({
								closeDropdown: true,
								confirm: true,
							});
							clearFilters && handleReset();
						}}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText([selectedKeys[0]]);
							setSearchedColumn([dataIndex]);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1677ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const handleDelete = async (id) => {
		let studentId = undefined;
		const newData = dataSource.filter((item) => {
			if (item.id !== id) return true;
			studentId = item.id;
		});

		try {
			const response = await axios.delete("/api/staff/student", {
				params: { studentId: studentId },
			});
			setDataSource(newData);
			message.success(response.data.message || "Deleted successfully!"); // Assuming your response has a "message" field
		} catch (error) {
			console.error(error);
			message.error(error.response.data.error || "Deletion failed!");
		}
	};

	console.log(dataSource);

	const defaultColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			sorter: (a, b) => a.id - b.id,
			...getColumnSearchProps("id"),
			fixed: "left",
			required: true,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			editable: true,
			required: true,
			...getColumnSearchProps("name"),
			sorter: (a, b) => textColumnSorter(a.name, b.name),
		},
		{
			title: "Roll Number",
			dataIndex: "rollNumber",
			key: "rollNumber",
			editable: true,
			required: true,
			...getColumnSearchProps("rollNumber"),
			sorter: (a, b) => a.rollNumber - b.rollNumber,
		},
		{
			title: "Semester",
			dataIndex: "semester",
			key: "semester",
			editable: true,
			required: true,
			sorter: (a, b) => a.semester - b.semester,
		},
		{
			title: "Program",
			dataIndex: "programId",
			key: "programId",
			required: true,
			sorter: (a, b) => a.programId - b.programId,
			render: (_, record) => <span>{record.programName}</span>,
		},
		{
			title: "aided",
			dataIndex: "isAided",
			key: "isAided",
			required: true,
		},
		{
			title: "Open Course",
			dataIndex: "openCourseId",
			key: "openCourseId",
			editable: true,
			type: "select",
			required: false,
		},
		{
			title: "Second Lang - 1",
			dataIndex: "secondLang_1",
			key: "secondLang_1",
			editable: true,
			type: "text",
			width:"50%",
			required: false,
			render: (_, record) => <span>{record.secondLang_1 ?? "Null"}</span>,
		},
		{
			title: "Second Lang - 2",
			dataIndex: "secondLang_2",
			key: "secondLang_2",
			width:"50%",
			editable: true,
			type: "text",
			required: false,
			render: (_, record) => <span>{record.secondLang_2 ?? "Null"}</span>,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			editable: true,
			required: false,
		},
		{
			title: "Contact",
			dataIndex: "phone",
			key: "contact",
			editable: true,
			required: false,
		},
		{
			title: "operation",
			dataIndex: "operation",
			fixed: "right",
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.id)}
							style={{
								marginRight: 8,
							}}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : dataSource.length >= 1 ? (
					<span className="flex gap-1">
						<Typography.Link
							disabled={editingId !== ""}
							onClick={() => edit(record)}
						>
							<Tag color="orange">Edit</Tag>
						</Typography.Link>
						{user.role === "admin" && (
							<Tag color="red" className="cursor-pointer">
								<Popconfirm
									title="Sure to delete?"
									onConfirm={() => handleDelete(record.id)}
								>
									Delete
								</Popconfirm>
							</Tag>
						)}
					</span>
				) : null;
			},
		},
	];

	const [programs, setPrograms] = useState([]);

	const loadPrograms = async () => {
		try {
			const result = await axios.get("/api/staff/programs");
			setPrograms(result.data);
		} catch (error) {
			console.error("Error fetching programs: ", error);
		}
	};

	useEffect(() => {
		loadPrograms();
	}, []);

	const components = {
		body: {
			// row: EditableRow,
			cell: EditableCell,
		},
	};

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
				programs: programs,
				required: col.required,
			}),
		};
	});

	const save = async (id) => {
		try {
			const row = await form.validateFields();
			row.id = id;
			const newData = [...dataSource];
			const index = newData.findIndex((item) => id === item.id);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				try {
					await axios.patch("/api/staff/student", row);
					message.success("Updated successfully");
					setDataSource(newData);
				} catch (error) {
					if (error.response && error.response.status === 404) {
						message.error("Staff not found!");
					} else {
						console.error("Error updating staff:", error);
						message.error("Something went wrong! Unable to update.");
					}
				}
				setEditingId("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	return (
		<Form form={form} component={false}>
			<Table
				components={components}
				rowClassName="editable-row"
				dataSource={dataSource}
				columns={columns}
				pagination={false}
				loading={loading}
				onChange={handleTableChange}
				rowKey={(record) => record.id}
			/>
		</Form>
	);
};

export default EditableTable;
