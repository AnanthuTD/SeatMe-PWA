// RoomDetail.js
import React, { useState, useRef, useEffect } from "react";
import {
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Table,
	Typography,
	Button,
	Space,
	Statistic,
	Card,
	message,
} from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";

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
	const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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

const RoomDetail = ({ data, setData, examinesCount, examType }) => {
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState("");
	const [totalSeats, setTotalSeats] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
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
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
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

	const isEditing = (record) => record.id === editingKey;

	const edit = (record) => {
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
			const url = examType
				? `/api/staff/rooms/${examType}`
				: `/api/staff/rooms`;
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => id === item.id);
			if (index > -1) {
				const item = newData[index];
				row.seats = row.cols * row.rows;
				newData.splice(index, 1, {
					...item,
					...row,
				});

				// console.log({ ...row, id: item.id });
				try {
					const res = await axios.patch(url, { ...row, id: item.id });
					const { updateCount } = res.data;
					if (!updateCount) message.warning("Nothing to update!");
					cancel();
					setData(newData);
				} catch (error) {
					message.error(error.response.data.error);
				}
			}
		} catch (errInfo) {
			// console.log("Validate Failed:", errInfo);
		}
	};

	let columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			editable: false,
			...getColumnSearchProps("id"),
		},
		{
			title: "Seats",
			dataIndex: "seats",
			key: "seats",
			...getColumnSearchProps("seats"),
		},
		...(examType
			? [
					{
						title: "Rows",
						dataIndex: "rows",
						key: "rows",
						editable: true,
						...getColumnSearchProps("rows"),
					},
					{
						title: "Columns",
						dataIndex: "cols",
						key: "cols",
						editable: true,
						...getColumnSearchProps("cols"),
					},
				]
			: [
					{
						title: "Final Row",
						dataIndex: "finalRows",
						key: "finalRow",
						editable: true,
						...getColumnSearchProps("finalRow"),
					},
					{
						title: "Final Column",
						dataIndex: "finalCols",
						key: "finalColumn",
						editable: true,
						...getColumnSearchProps("finalColumn"),
					},
					{
						title: "Internal Row",
						dataIndex: "internalRows",
						key: "internalRow",
						editable: true,
						...getColumnSearchProps("internalRow"),
					},
					{
						title: "Internal Column",
						dataIndex: "internalCols",
						key: "internalCol",
						editable: true,
						...getColumnSearchProps("internalCol"),
					},
				]),
		{
			title: "Floor",
			dataIndex: "floor",
			key: "floor",
			editable: true,
			...getColumnSearchProps("floor"),
		},
		{
			title: "Block ID",
			dataIndex: "blockId",
			key: "block_id",
			editable: true,
			...getColumnSearchProps("blockId"),
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
					<Typography.Link
						disabled={editingKey !== ""}
						onClick={() => edit(record)}
					>
						Edit
					</Typography.Link>
				);
			},
		},
	];

	// Conditionally modify columns based on the existence of examType
	if (!examType) {
		// Remove 'Rows' and 'Columns'
		columns = columns.filter(
			(column) => column.key !== "rows" && column.key !== "cols",
		);
	}

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const availableRoomIds = data
			.filter((room) => room.isAvailable)
			.map((room) => room.id);
		setSelectedRowKeys([...selectedRowKeys, ...availableRoomIds]);
	}, []);

	const onSelectChange = (newSelectedRowKeys) => {
		// console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === "number",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	const calculateTotalSeats = () => {
		const selectedRooms = data.filter((room) =>
			selectedRowKeys.includes(room.id),
		);

		const newTotalSeats = selectedRooms.reduce((total, room) => {
			return total + room.seats;
		}, 0);

		setTotalSeats(newTotalSeats);
	};

	useEffect(() => {
		calculateTotalSeats();
	}, [selectedRowKeys]);

	const router = useRouter();

	const handleRoomSelection = async () => {
		setSubmitting(true);
		try {
			const response = await axios.patch(`/api/staff/rooms-availability`, {
				roomIds: selectedRowKeys,
			});

			if (response.status === 200) {
				message.success("Room availability updated successfully");
				router.push("/staff/exam/assign/students");
			} else {
				message.error(
					"Failed to update room availability :",
					response.status,
				);
			}
		} catch (error) {
			console.error(
				"Error while sending PATCH request to update room availability:",
				error,
			);
			message.error("Error while sending PATCH request");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<div className="flex justify-between">
				<div className="flex">
					{examinesCount === undefined ? null : (
						<Card bordered={false}>
							{examinesCount - totalSeats === 0 ? (
								<Statistic title="Correct number of seats" value="0" />
							) : examinesCount - totalSeats < 0 ? (
								<Statistic
									title="Extra seats"
									value={Math.abs(examinesCount - totalSeats)}
									valueStyle={{ color: "green" }}
								/>
							) : (
								<Statistic
									title="More seats needed"
									value={examinesCount - totalSeats}
									valueStyle={{ color: "red" }}
								/>
							)}
						</Card>
					)}
					<Card bordered={false}>
						<Statistic
							title="Rooms Selected"
							value={selectedRowKeys.length || 0}
						/>
					</Card>
				</div>
				<Button
					className="place-self-center"
					type="primary"
					onClick={handleRoomSelection}
					loading={submitting}
				>
					Submit
				</Button>
			</div>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					bordered
					rowSelection={rowSelection}
					dataSource={data}
					columns={mergedColumns}
					rowClassName="editable-row"
					pagination={{
						onChange: cancel,
						defaultPageSize: 7,
					}}
					rowKey={(record) => record.id}
				/>
			</Form>
		</div>
	);
};

export default RoomDetail;
