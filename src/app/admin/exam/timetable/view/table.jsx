import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import axios from "@/axiosInstance";

const App = ({
	dataSource,
	loading,
	setSorterField,
	setSorterOrder,
	setStartIndex,
	searchedColumn,
	setSearchedColumn,
	searchText,
	setSearchText,
	handleReset,
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
			setStartIndex(0);
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
							await clearFilters({closeDropdown:true, confirm: true});
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
			title: "Course",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps("name"),
			sorter: (a, b) => textColumnSorter(a.name, b.name),
		},
		{
			title: "Semester",
			dataIndex: "semester",
			key: "semester",
			sorter: (a, b) => a.semester - b.semester,
		},
		{
			title: "Date",
			dataIndex: "dateTime.date",
			key: "date",
			sorter: (a, b) => a.programName - b.programName,
		},
		{
			title: "Time Code",
			dataIndex: "dateTime.timeCode",
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
