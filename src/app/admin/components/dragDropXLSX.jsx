import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Select, Button } from "antd";
import * as XLSX from "xlsx";

const { Dragger } = Upload;
const { Option } = Select;

const dragDrop = ({ requiredFields, records = (records) => {} }) => {
	const [fileData, setFileData] = useState([]);
	const [mappedData, setMappedData] = useState([]);
	const [mappedFields, setMappedFields] = useState({});

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
		// setMappedData(mod);
		mapData(mod);
	}

	const props = {
		name: "file",
		multiple: true,
		showUploadList: false,
		beforeUpload: (file) => {
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

				dataArr[0].map((column, index) => {
					let selectedField = requiredFields.find(
						(f) => f.key === column || f.value === column,
					);
					if (selectedField) {
						newMappedFields[selectedField.key] = column;
						newMappedFields = updateDuplicates(newMappedFields);
					}
				});

				setMappedFields(newMappedFields);

				setFileData(dataArr);
				console.log(dataArr);
			};
			reader.readAsArrayBuffer(file);

			return false;
		},
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};

	const getAvailableFields = () => {
		const selectedFields = Object.keys(mappedFields);
		const options = requiredFields.filter(
			(field) =>
				!selectedFields.includes(field.value) &&
				!selectedFields.includes(field.key),
		);
		return options;
	};

	function mapData(data) {
		console.log(data);
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

		// console.log(mappedData);

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
					Support for a single or bulk upload. Strictly prohibited
					from uploading company data or other banned files.
				</p>
			</Dragger>

			{fileData.length > 0 && (
				<div className="mt-4">
					<h2 className="text-lg font-semibold">Field Mapping</h2>
					{fileData[0].map((column, index) => {
						let selectedField = requiredFields.find(
							(f) => f.key === column || f.value === column,
						);
						selectedField = selectedField
							? selectedField.value
							: "Select Field";
						return (
							<div key={index} className="mt-2 flex items-center">
								<span>{column}</span>
								<Select
									defaultValue={selectedField}
									className="w-48 ml-2"
									onChange={(value, opt) => {
										handleFieldMapping(opt.key, column);
									}}
								>
									<Option value="Select Field">
										Select Field
									</Option>
									{getAvailableFields().map((field) => (
										<Option
											key={field.key}
											value={field.value}
										>
											{field.value}
										</Option>
									))}
								</Select>
							</div>
						);
					})}
					<Button
						type="primary"
						className="mt-4"
						onClick={() => {
							applyMapping();
						}}
					>
						Save Mapping
					</Button>
				</div>
			)}
		</div>
	);
};

export default dragDrop;
