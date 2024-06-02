import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Select } from "antd";
import "./table.css";
import axios from "@/lib/axiosPrivate";

async function fetchOpenCourses(programId) {
	const apiUrl = "/api/staff/open-courses";

	let openCourses = [];
	try {
		const response = await axios.get(apiUrl, {
			params: { programId },
		});
		openCourses = response.data;
	} catch (err) {
		console.error("Error fetching open courses: ", err);
	}

	return openCourses || [];
}

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
	programs,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const [openCourses, setOpenCourses] = useState([]);
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
		if (dataIndex === "openCourseId") {
			const fun = async () => {
				const openCourses = await fetchOpenCourses(record.programId);
				setOpenCourses(openCourses);
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
				{dataIndex === "openCourseId" || dataIndex === "programId" ? (
					<Select
						options={
							dataIndex === "openCourseId" ? openCourses : programs
						}
						ref={inputRef}
						onSelect={save}
						fieldNames={{ label: "name", value: "id" }}
					/>
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
