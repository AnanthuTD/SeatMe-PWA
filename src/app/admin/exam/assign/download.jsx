import React from "react";
import { Button } from "antd";
import axios from "@/lib/axiosInstance";

const DownloadButton = ({ fileName }) => {
	const handleDownload = () => {
		// Use the fetch function to initiate the download request
		const url = `/api/admin/public/${fileName}`;
		axios
			.get(url, {
				responseType: "blob",
			})
			.then((response) => {
				// Create a URL for the blob content
				const url = window.URL.createObjectURL(
					new Blob([response.data]),
				);
				// Create an anchor element to trigger the download
				const a = document.createElement("a");
				a.href = url;
				a.download = `${fileName}`; // Specify the file name
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch((error) => {
				console.error("Error downloading content:", error);
			});
	};
	return (
		<Button type="primary" onClick={handleDownload}>
			Download
		</Button>
	);
};

export default DownloadButton;
