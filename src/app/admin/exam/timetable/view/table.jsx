import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import {
	Button,
	Input,
	Space,
	Table,
	Form,
	InputNumber,
	Popconfirm,
	Typography,
	DatePicker,
} from "antd";
import "./table.css";
import dayjs from "dayjs";
import Link from "next/link";

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	if (!record) return <td {...restProps}>{children}</td>;

	const inputNode =
		inputType === "date" ? <DatePicker format="YYYY-MM-DD" /> : <Input />;

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const App = ({
	dataSource,
	loading = false,
	setSorterField = () => { },
	setSorterOrder = () => { },
	searchedColumn = "",
	setSearchedColumn = () => { },
	searchText = "",
	setSearchText = () => { },
	handleReset = () => { },
}) => {
	const searchInput = useRef(null);

	const handleSearch = async (selectedKeys, confirm, dataIndex) => {
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
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

	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState("");

	const isEditing = (record) => record.id === editingKey;

	const edit = (record) => {
		record.date = dayjs(record.date);

		form.setFieldsValue({
			...record,
		});
		setEditingKey(record.id);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (id) => {
		try {
			const row = await form.validateFields();
			const newData = [...dataSource];
			const index = newData.findIndex((item) => id === item.id);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setData(newData);
				setEditingKey("");
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "course.id",
			key: "course.id",
			...getColumnSearchProps("course.id"),
			sorter: true,
		},
		{
			title: "Course",
			dataIndex: "course.name",
			key: "course.name",
			...getColumnSearchProps("course.name"),
			sorter: (a, b) =>
				textColumnSorter(a["course.name"], b["course.name"]),
		},
		{
			title: "Semester",
			dataIndex: "course.semester",
			key: "course.semester",
			sorter: (a, b) => a["course.semester"] - b["course.semester"],
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			...getColumnSearchProps("date"),
			sorter: (a, b) => a.programName - b.programName,
			editable: true,
		},
		{
			title: "Time Code",
			dataIndex: "timeCode",
			key: "timeCode",
			sorter: (a, b) => a.programName - b.programName,
			filters: [
				{
					text: "AN",
					value: "AN",
				},
				{
					text: "FN",
					value: "FN",
				},
			],
			editable: true,
		},
		{
			title: "operation",
			dataIndex: "operation",
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
				) : (
					<span className="gap-2 flex">
						<Link href={`/admin/exam/timetable/view/${record.id}`}>Attendance</Link>
						<Typography.Link
							disabled={editingKey !== ""}
							onClick={() => edit(record)}
						>
							Edit
						</Typography.Link>
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => handleDelete(record.id)}
						>
							<a>Delete</a>
						</Popconfirm>
					</span>
				);
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
				inputType: col.dataIndex === "date" ? "date" : "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				bordered
				dataSource={dataSource}
				columns={mergedColumns}
				rowClassName="editable-row"
				loading={loading}
				pagination={false}
				onChange={handleTableChange}
				rowKey={(record) => record.id}
			/>
		</Form>
	);
};

export default App;
