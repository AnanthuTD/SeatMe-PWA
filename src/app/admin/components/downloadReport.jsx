import React from 'react';
import { Button } from 'antd';
import axios from '@/lib/axiosPrivate';

const DownloadZipButton = ({ fileName }) => {
	console.log(fileName);
	const handleDownload = () => {
		axios({
			method: 'get',
			url: `/api/admin/download/report/${fileName}`,
			responseType: 'blob',
		})
			.then((response) => {
				const blob = new Blob([response.data], { type: 'application/zip' });

				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;

				document.body.appendChild(link);
				link.click();

				document.body.removeChild(link);
			})
			.catch((error) => {
				console.error('Download failed:', error);
			});
	};

	return (
		<Button type="primary" onClick={handleDownload}>
			Download Zip
		</Button>
	);
};

export default DownloadZipButton;
