import { SearchOutlined } from "@ant-design/icons";
import React, { useRef } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";

const App = ({
	dataSource,
	loading = false,
	setSorterField = "",
	setSorterOrder = "",
	searchedColumn = "",
	setSearchedColumn = "",
	searchText = "",
	setSearchText = "",
	handleReset = () => {},
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
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
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

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			...getColumnSearchProps("id"),
			sorter: true, // Example sorting for numeric column
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps("name"),
			sorter: (a, b) => textColumnSorter(a.name, b.name),
		},
		{
			title: "Roll Number",
			dataIndex: "rollNumber",
			key: "rollNumber",
			...getColumnSearchProps("rollNumber"),
			sorter: (a, b) => a.rollNumber - b.rollNumber,
		},
		{
			title: "Semester",
			dataIndex: "semester",
			key: "semester",
			sorter: (a, b) => a.semester - b.semester,
		},
		{
			title: "Program",
			dataIndex: "program.name",
			key: "programName",
			sorter: (a, b) => a.programName - b.programName,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Contact",
			dataIndex: "phone",
			key: "contact",
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={dataSource}
			pagination={false}
			loading={loading}
			onChange={handleTableChange}
			rowKey={(record) => record.id}
		/>
	);
};
export default App;