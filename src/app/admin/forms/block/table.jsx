"use strict";
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import axios from "@/lib/axiosPrivate";

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
const BlockTable = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [editingId, setEditingId] = useState("");

	const loadBlocks = async () => {
		try {
			const result = await axios.get("/api/staff/blocks");
			setData(result.data);
		} catch (error) {
			console.error("Error fetching blocks: ", error);
		}
	};
	useEffect(() => {
		// Load blocks when the component mounts
		loadBlocks();
	}, []);

	const isEditing = (record) => record.id === editingId;
	const edit = (record) => {
		form.setFieldsValue({
			id: "",
			...record,
		});
		setEditingId(record.id);
	};
	const cancel = () => {
		setEditingId("");
	};
	const save = async (id) => {
		try {
			console.log("id: " + id);
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => id === item.id);
			if (index > -1) {
				axios
					.patch("/api/staff/blocks", {
						prevId: row.id,
						id: newData[index].id,
					})
					.then(() => {
						const item = newData[index];
						newData.splice(index, 1, {
							...item,
							...row,
						});
						setData(newData);
						setEditingId("");
					});
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			// width: "25%",
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
					<Typography.Link
						disabled={editingId !== ""}
						onClick={() => edit(record)}
					>
						Edit
					</Typography.Link>
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
				inputType: col.dataIndex === "age" ? "number" : "text",
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
				dataSource={data}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={{
					onChange: cancel,
				}}
			/>
		</Form>
	);
};
export default BlockTable;
