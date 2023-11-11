import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Select } from "antd";
import "./table.css";
import axios from "@/lib/axiosPrivate";
import SelectDepartment from "../../components/select";

const loadDepartments = async () => {
	try {
		const result = await axios.get("/api/admin/departments");
		return (result.data);
	} catch (error) {
		console.error("Error fetching departments: ", error);
	}
};

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

const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const [departments, setDepartments] = useState([]);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);

	useEffect(() => {
		if (editing) {
			if (inputRef.current) {
				inputRef.current?.focus();
			}
		}
	}, [editing]);

	useEffect(() => {
		if (dataIndex === "departmentName") {
			const fun = async () => {
				const departments = await loadDepartments();
				setDepartments(departments);
			};
			fun();
		}
	}, []);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({
			[dataIndex]: record[dataIndex],
		});
	};

	const save = async () => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			handleSave({
				...record,
				...values,
			});
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
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
				{dataIndex === "departmentName" ? (
					<SelectDepartment options={departments} onChange={save} />
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

export { EditableCell, EditableRow };
