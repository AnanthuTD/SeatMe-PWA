import React, { useState, useEffect } from "react";
import { InboxOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Upload, Select, Button } from "antd";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Option } = Select;

const DragDrop = ({ requiredFields, records = (records) => { }, loading = false, fileName: name }) => {
	const [fileData, setFileData] = useState([]);
	const [mappedFields, setMappedFields] = useState({});
	const [fileName, setFileName] = useState("");

	const resetState = () => {
		setFileData([]);
		setMappedFields({});
		setFileName("");
	};

	useEffect(() => {
		name(fileName)
	}, [fileName])


	const handleFieldMapping = (field, column) => {
		const newMappedFields = { ...mappedFields };
		newMappedFields[field] = column;
		const uniqueMappedFields = updateDuplicates(newMappedFields);
		setMappedFields(uniqueMappedFields);
	};

	function updateDuplicates(obj) {
		const valueToKeys = {};
		for (const key in obj) {
			const value = obj[key];
			if (valueToKeys[value]) {
				delete obj[valueToKeys[value]];
			} else {
				valueToKeys[value] = key;
			}
		}
		return obj;
	}

	function applyMapping() {
		// Iterate through the data and apply the mapping
		const mod = JSON.parse(JSON.stringify(fileData));
		const fields = Object.keys(mappedFields);
		mod[0].forEach((field, index) => {
			fields.forEach((key) => {
				if (mappedFields[key] === field) mod[0][index] = key;
			});
		});
		mapData(mod);
	}

	const props = {
		name: "file",
		multiple: true,
		showUploadList: false,
		beforeUpload: (file) => {
			resetState();
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target.result;
				const workbook = XLSX.read(data, { type: "array" });
				const sheet = workbook.Sheets[workbook.SheetNames[0]];
				const dataArr = XLSX.utils.sheet_to_json(sheet, {
					header: 1,
					blankrows: false,
				});

				let newMappedFields = {};

				console.log(dataArr[0]);

				requiredFields.forEach((field) => {
					const column = dataArr[0].find((col) => col === field.value || col === field.key);
					if (column) {
						newMappedFields[field.key] = column;
					}
				});
				setMappedFields(newMappedFields);
				setFileData(dataArr);
			};
			reader.readAsArrayBuffer(file);

			return false;
		},
		/* onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		}, */
	};

	const getAvailableFields = () => {
		const selectedFields = Object.values(mappedFields);
		// console.log('selectedFields', selectedFields);
		const options = fileData[0].filter(
			(field) =>
				!selectedFields.includes(field)
		);
		// console.log(options);
		return options;
	};

	function mapData(data) {
		const mappedData = data.slice(1).map((row) => {
			const obj = {};
			data[0].forEach((field, index) => {
				if (requiredFields.some((reqField) => reqField.key === field)) {
					const requiredField = requiredFields.find(
						(reqField) => reqField.key === field,
					);
					obj[requiredField.key] = row[index];
				}
			});
			return obj;
		});

		records(mappedData);
	}

	return (
		<div className="p-4">
			<Dragger {...props}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined className="text-2xl text-blue-500" />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
				<p className="ant-upload-hint">
					{fileName && (
						<>
							<FileExcelOutlined style={{ marginRight: "8px", color: "green", }} />
							{fileName}
						</>
					)}
				</p>
			</Dragger>

			{fileData.length > 0 && (
				<div className="mt-4">
					<h2 className="text-lg font-semibold">Field Mapping</h2>
					{fileData.length > 0 && (
						requiredFields.map((field, index) => (
							<div key={index} className="mt-2 flex items-center">
								<span>{field.value}</span>
								<Select
									defaultValue={
										fileData[0].includes(field.key) ? field.key : fileData[0].includes(field.value) ?
											field.value
											: "Select Field"
									}
									className="w-48 ml-2"
									onChange={(value, opt) => {
										handleFieldMapping(field.key, value);
									}}
								>
									<Option value="Select Field">Select Field</Option>
									{getAvailableFields().map((column) => (
										<Option key={column} value={column}>
											{column}
										</Option>
									))}
								</Select>
							</div>
						))
					)}
					< Button
						type="primary"
						className="mt-4"
						onClick={() => {
							applyMapping();
						}}
						loading={loading}
					>
						Save Mapping
					</Button>
				</div>
			)
			}
		</div >
	);
};

export default DragDrop;
