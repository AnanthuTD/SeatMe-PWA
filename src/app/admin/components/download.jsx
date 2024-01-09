import React from "react";
import { Button } from "antd";
import axios from "@/lib/axiosPrivate";

const DownloadButton = ({ fileNames }) => {
	const handleDownload = () => {
		console.log(fileNames);
		if (Array.isArray(fileNames) && fileNames.length > 0) {
			fileNames.forEach((file) => {
				downloadFile(file);
			});
		} else if (typeof fileNames === "string") {
			downloadFile(fileNames);
		}
	};

	const downloadFile = (file) => {
		console.log(file);
		const url = `/api/admin/reports/${file}`;
		axios
			.get(url, {
				responseType: "blob",
			})
			.then((response) => {
				const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
				const a = document.createElement("a");
				a.href = blobUrl;
				a.download = file;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(blobUrl);
				document.body.removeChild(a);
			})
			.catch((error) => {
				console.error(`Error downloading ${file}:`, error);
			});
	};

	return (
		<Button type="primary" onClick={handleDownload}>
			Download
		</Button>
	);
};

export default DownloadButton;
