"use client";

import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import * as XLSX from "xlsx"; // Import XLSX to work with Excel files

const { Dragger } = Upload;

const uploadData = (dataArray) => {
	console.log(JSON.stringify(dataArray, null, 2));
};

const props = {
	name: "file",
	multiple: true,
	showUploadList: false, // Hide the file list since we're not uploading to a URL
	beforeUpload: (file) => {
		// Handle file before uploading
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target.result;
            
			const workbook = XLSX.read(data, { type: "array" });

			// Assuming your data is in the first sheet
			const sheet = workbook.Sheets[workbook.SheetNames[0]];
			const dataArr = XLSX.utils.sheet_to_json(sheet, { header: 1 });

			uploadData(dataArr);
		};
		reader.readAsArrayBuffer(file);

		return false; // Prevent default upload behavior
	},
	onDrop(e) {
		console.log("Dropped files", e.dataTransfer.files);
	},
};

const DragDrop = () => (
	<Dragger {...props}>
		<p className="ant-upload-drag-icon">
			<InboxOutlined />
		</p>
		<p className="ant-upload-text">
			Click or drag file to this area to upload
		</p>
		<p className="ant-upload-hint">
			Support for a single or bulk upload. Strictly prohibited from
			uploading company data or other banned files.
		</p>
	</Dragger>
);

export default DragDrop;
