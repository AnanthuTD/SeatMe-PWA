import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Select, Table, message } from "antd";
import axios from "axios";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const getPriorityLabel = (id) => {
	id = parseInt(id, 10);
	switch (id) {
		case 1:
			return "High";
		case 2:
			return "Medium";
		case 3:
			return "Low";
		default:
			return "";
	}
};

const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	type,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);

	useEffect(() => {
		if (editing) {
			inputRef.current.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		const value =
			dataIndex === "priority"
				? getPriorityLabel(record.id)
				: record[dataIndex];
		form.setFieldsValue({
			[dataIndex]: value,
		});
	};

	const save = async () => {
		try {
			const values = await form.validateFields();
			if (values.priority) values.priority = parseInt(values.priority, 10);
			toggleEdit();
			handleSave(
				{
					...record,
					...values,
				},
				form,
			);
		} catch (errInfo) {
			// console.log("Save failed:", errInfo);
		}
	};
	let childNode = children;
	if (editable) {
		childNode = editing ? (
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
				{type === "select" ? (
					<Select ref={inputRef} onPressEnter={save} onBlur={save}>
						<Option value="1">High</Option>
						<Option value="2">Medium</Option>
						<Option value="3">Low</Option>
					</Select>
				) : (
					<Input ref={inputRef} onPressEnter={save} onBlur={save} />
				)}
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{
					paddingRight: 24,
				}}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}
	return <td {...restProps}>{childNode}</td>;
};
const App = ({ data }) => {
	const [dataSource, setDataSource] = useState(data);

	const defaultColumns = [
		{
			title: "Sl.No",
			key: "serialNumber",
			render: (text, record, index) => index + 1,
		},
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Seats",
			dataIndex: "seats",
			key: "seats",
		},
		{
			title: "Rows",
			dataIndex: "rows",
			key: "rows",
		},
		{
			title: "Columns",
			dataIndex: "cols",
			key: "cols",
		},
		{
			title: "Floor",
			dataIndex: "floor",
			key: "floor",
		},
		{
			title: "Block ID",
			dataIndex: "blockId",
			key: "block_id",
		},
		{
			title: "Priority",
			dataIndex: "priority",
			editable: true,
			type: "select",
			render: (_, record) => getPriorityLabel(record?.priority),
		},
	];
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
				const { id, priority } = row;
				if (priority) {
					await axios.patch("/api/staff/rooms", { id, priority });
					message.success("Updated successfully");
					setDataSource(newData);
				}
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				message.error("Student not found!");
			} else {
				console.error("Error updating student:", error);
				message.error("Something went wrong! Unable to update.");
			}
		}
	};
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
				type: col.type,
				handleSave,
			}),
		};
	});
	return (
		<div>
			<Table
				components={components}
				rowClassName={() => "editable-row"}
				bordered
				dataSource={dataSource}
				columns={columns}
				pagination={false}
			/>
		</div>
	);
};
export default App;
