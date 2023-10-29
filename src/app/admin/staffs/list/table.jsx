"use client";

import React, { useRef, useState } from "react";
import {
	Button,
	Input,
	Table,
	Space,
	Popconfirm,
	Modal,
	FloatButton,
	message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./table.css";
import Highlighter from "react-highlight-words";
import { EditableCell, EditableRow } from "./editable";
import axios from "@/axiosInstance";

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
	const searchInput = useRef(null);
	const [editedData, setEditedData] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);

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
			console.log(item);
			studentId = item.id;
		});

		try {
			const response = await axios.delete("/api/admin/student", {
				params: { studentId: studentId },
			});
			setDataSource(newData);
			message.success(response.data.message); // Assuming your response has a "message" field
		} catch (error) {
			console.error(error);
			message.error(error.response.data.error);
		}
	};

	const defaultColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			...getColumnSearchProps("id"),
			sorter: true,
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
			dataIndex: "departmentId",
			key: "departmentId",
			...getColumnSearchProps("departmentId"),
			editable: true,
			sorter: true,
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
			editable: true,
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
			title: "Contact",
			dataIndex: "phone",
			key: "contact",
			editable: true,
			...getColumnSearchProps("phone"),
		},
		{
			title: "operation",
			dataIndex: "operation",
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => handleDelete(record.id)}
					>
						<a>Delete</a>
					</Popconfirm>
				) : null,
		},
	];
	const components = {
		body: {
			row: EditableRow,
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
				handleSave,
			}),
		};
	});

	const handleSave = (row) => {
		console.log(row);
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.id === item.id);

		if (index > -1) {
			const item = newData[index];
			newData.splice(index, 1, {
				...item,
				...row,
			});

			// Check if row is not already in editedData
			if (!editedData.some((editedRow) => editedRow.id === row.id)) {
				setEditedData([...editedData, row]);
			} else {
				// If the row is already in editedData, update it instead of adding a duplicate
				const updatedEditedData = editedData.map((editedRow) =>
					editedRow.id === row.id
						? { ...editedRow, ...row }
						: editedRow,
				);
				setEditedData(updatedEditedData);
			}
		}

		setDataSource(newData);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleUpdate = async () => {
		try {
			const response = await axios.patch("/api/admin/staff", editedData);
			setEditedData(response.data);
			if (response.data.length > 0) {
				message.warning("unable to update some records");
			} else {
				handleCancel();
				message.success("Updated successfully");
			}
		} catch (error) {
			message.error(error.response.data.error);
		}
	};

	const EditedRowsModal = () => {
		return (
			<Modal
				title="Edited Rows"
				open={isModalVisible}
				onOk={handleUpdate}
				onCancel={handleCancel}
				style={{ maxHeight: "80vh" }}
				width={1000}
			>
				<Table
					dataSource={editedData}
					columns={defaultColumns}
					pagination={false}
					rowKey={(record) => record.key}
					style={{
						overflowY: "auto",
						maxHeight: "calc(80vh - 100px)",
					}}
				/>
			</Modal>
		);
	};

	return (
		<div>
			<Table
				components={components}
				rowClassName={() => "editable-row"}
				dataSource={dataSource}
				columns={columns}
				pagination={false}
				loading={loading}
				onChange={handleTableChange}
				rowKey={(record) => record.id}
			/>
			<FloatButton onClick={showModal}>Show Edited Rows</FloatButton>

			{isModalVisible && <EditedRowsModal />}
		</div>
	);
};

export default EditableTable;
