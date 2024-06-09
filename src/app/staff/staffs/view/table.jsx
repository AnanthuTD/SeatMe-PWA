"use client";

import React, { useRef, useState, useEffect } from "react";
import {
	Button,
	Input,
	Table,
	Space,
	Popconfirm,
	message,
	Tag,
	Typography,
	Form,
	Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./table.css";
import Highlighter from "react-highlight-words";
import axios from "axios";
import PasswordUpdateModal from "./passwordUpdateModel"; 
// import { useAccount } from "@/context/accountContext";
import SelectDepartment from "../../components/selectDepartment";

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	departments,
	...restProps
}) => {
	const roles = [
		{ value: "admin" },
		{ value: "staff" },
		{ value: "invigilator" },
	];

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
							required: true,
							message: `${title} is required.`,
						},
					]}
				>
					{dataIndex === "departmentCode" ? (
						<SelectDepartment options={departments} />
					) : dataIndex === "role" ? (
						<Select options={roles} />
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

const loadDepartments = async () => {
	try {
		const result = await axios.get("/api/staff/departments");
		return result.data;
	} catch (error) {
		console.error("Error fetching departments: ", error);
	}
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
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState("");
	const [departments, setDepartments] = useState([]);
	const isEditing = (record) => record.id === editingId;
	const { user } = useAccount();
	const searchInput = useRef(null);

	useEffect(() => {
		const fun = async () => {
			const departments = await loadDepartments();
			setDepartments(departments);
		};
		fun();
	}, []);

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
		onFilter: (value, record) => {
			// console.log(value, record);
			return record[dataIndex]
				?.toString()
				.toLowerCase()
				.includes(value.toLowerCase());
		},
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
		let staffId = undefined;
		const newData = dataSource.filter((item) => {
			if (item.id !== id) return true;
			staffId = item.id;
		});

		try {
			await axios.delete(`/api/staff/staff/${id}`);
			setDataSource(newData);
			message.success("Deleted successfully!");
		} catch (error) {
			console.error(error);
			message.error("Deletion failed!");
		}
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			...getColumnSearchProps("id"),
			sorter: true,
			fixed: "left",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps("name"),
			editable: true,
			sorter: true,
		},
		{
			title: "Department",
			dataIndex: "departmentCode",
			key: "departmentCode",
			...getColumnSearchProps("departmentCode"),
			editable: true,
			sorter: true,
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<span className="flex gap-1">{record.departmentName}</span>
				) : null,
		},
		{
			title: "Designation",
			dataIndex: "designation",
			key: "designation",
			editable: true,
			...getColumnSearchProps("designation"),
			sorter: true,
		},
		{
			title: "Aided/Unaided",
			dataIndex: "aided/unaided",
			key: "aided/unaided",
			sorter: (a, b) => a["aided/unaided"] - b["aided/unaided"],
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			editable: true,
			...getColumnSearchProps("email"),
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			editable: true,
			type: "select",
			// ...getColumnSearchProps("role"),
		},
		{
			title: "Contact",
			dataIndex: "phone",
			key: "contact",
			editable: true,
			...getColumnSearchProps("phone"),
		},
		{
			title: "Operation",
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
						<Tag
							color="gold"
							className="cursor-pointer"
							onClick={() => showPasswordUpdateModal(record.id)}
						>
							Password
						</Tag>
					</span>
				) : null;
			},
		},
	];

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === "age" ? "number" : "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
				departments: departments,
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
					await axios.patch(`/api/staff/staff/${row.id}`, row);
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

	const [passwordUpdateModalVisible, setPasswordUpdateModalVisible] =
		useState(false);
	const [selectedStaffId, setSelectedStaffId] = useState(null);

	const showPasswordUpdateModal = (staffId) => {
		setSelectedStaffId(staffId);
		setPasswordUpdateModalVisible(true);
	};

	const hidePasswordUpdateModal = () => {
		setSelectedStaffId(null);
		setPasswordUpdateModalVisible(false);
	};

	const handlePasswordUpdate = async (newPassword) => {
		try {
			const response = await axios.patch(
				`/api/staff/staff/update-password`,
				{
					staffId: selectedStaffId,
					newPassword: newPassword,
				},
			);

			if (response.status === 200) message.success(response.data.message);
			else message.warning(response.data.message);
		} catch (error) {
			console.error("Error:", error);
			message.error(error.response.data.message || "Something went wrong!");
		}
	};

	return (
		<>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					rowClassName="editable-row"
					dataSource={dataSource}
					columns={mergedColumns}
					pagination={false}
					loading={loading}
					onChange={handleTableChange}
					rowKey={(record) => record.id}
				/>
			</Form>
			<PasswordUpdateModal
				visible={passwordUpdateModalVisible}
				onCancel={hidePasswordUpdateModal}
				onOk={handlePasswordUpdate}
			/>
		</>
	);
};

export default EditableTable;
