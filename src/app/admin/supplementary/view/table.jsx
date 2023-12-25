"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	Input,
	Table,
	Space,
	Popconfirm,
	message,
	Tag
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./table.css";
import { EditableCell, EditableRow } from "./editable";
import axios from "@/lib/axiosPrivate";
import Highlighter from "react-highlight-words";

const EditableTable = ({
	dataSource,
	setDataSource = () => { },
	loading = false,
	setSorterField = () => { },
	setSorterOrder = () => { },
	searchedColumn = [""],
	setSearchedColumn = () => { },
	searchText = [""],
	setSearchText = () => { },
	handleReset = () => { },
}) => {
	const searchInput = useRef(null);

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
			const response = await axios.delete("/api/admin/student/supplementary", {
				params: { studentId: studentId },
			});
			setDataSource(newData);
			message.success(response.data.message || 'Deleted successfully!'); // Assuming your response has a "message" field
		} catch (error) {
			console.error(error);
			message.error(error.response.data.error || "Deletion failed!");
		}
	};

	const defaultColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: "10%",
			sorter: (a, b) => a.id - b.id,
			...getColumnSearchProps("id"),
			fixed: 'left',
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: "20%",
			editable: true,
			...getColumnSearchProps("name"),
			sorter: (a, b) => textColumnSorter(a.name, b.name),
		},
		{
			title: "Roll Number",
			dataIndex: "rollNumber",
			key: "rollNumber",
			width: "10%",
			editable: true,
			...getColumnSearchProps("rollNumber"),
			sorter: (a, b) => a.rollNumber - b.rollNumber,
		},
		{
			title: "Semester",
			dataIndex: "semester",
			key: "semester",
			width: "10%",
			editable: true,
			sorter: (a, b) => a.semester - b.semester,
		},
		{
			title: "Program",
			dataIndex: "programId",
			key: "programId",
			width: "20%",
			sorter: (a, b) => a.programId - b.programId,
			render: (_, record) => (
				<span>
					{record.program.name + `-(${record.programId})`}
				</span>
			)
		},
		{
			title: "aided",
			dataIndex: "isAided",
			key: "isAided",
		},
		{
			title: "Course",
			dataIndex: "courses",
			key: "courses",
			width: "25%",
			editable: true,
			type: "select",
			render: (_, record) => (
				<span>
					{[...record.courses].join(', ')}
				</span>
			)
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "15%",
			editable: true,
		},
		{
			title: "Contact",
			dataIndex: "phone",
			key: "contact",
			width: "15%",
			editable: true,
		},
		{
			title: "operation",
			dataIndex: "operation",
			fixed: 'right',
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<Tag color="red" className="cursor-pointer">
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => handleDelete(record.id)}
						>
							Delete
						</Popconfirm>
					</Tag>
				) : null,
		},
	];

	const [programs, setPrograms] = useState([])

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
	}, [])


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
				programs: programs
			}),
		};
	});

	const handleSave = async (row) => {
		try {

			const newData = [...dataSource];
			const index = newData.findIndex((item) => row.id === item.id);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				console.log(row);
				await axios.patch("/api/admin/student", row);
				await axios.patch("/api/admin/student/supplementary", row);
				message.success("Updated successfully");
				setDataSource(newData);
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				message.error('Student not found!');
			} else {
				console.error('Error updating student:', error);
				message.error('Something went wrong! Unable to update.');
			}
		}
	};

	return (
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
	);
};

export default EditableTable;
