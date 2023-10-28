"use client";

import React, { useState, useEffect } from "react";
import { List, Button, Modal } from "antd";
import axios from "@/axiosInstance";

const PDFList = () => {
	const [pdfs, setPDFs] = useState([]);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [fileToDelete, setFileToDelete] = useState(null);

	const handleDelete = (pdf) => {
		setFileToDelete(pdf);
		setDeleteModalVisible(true);
	};

	const confirmDelete = () => {
		axios
			.delete(`api/admin/public/${fileToDelete}`)
			.then(() => {
				// Successfully deleted, remove the file from the list
				setPDFs((prevPDFs) =>
					prevPDFs.filter((file) => file !== fileToDelete),
				);
			})
			.catch((error) => {
				console.error("Error deleting PDF: ", error);
			})
			.finally(() => {
				setDeleteModalVisible(false);
			});
	};

	const cancelDelete = () => {
		setFileToDelete(null);
		setDeleteModalVisible(false);
	};

	useEffect(() => {
		axios
			.get("api/admin/list-pdfs") // Use axios to make the GET request
			.then((response) => {
				setPDFs(response.data); // Use response.data to access the data
			})
			.catch((error) => {
				console.error("Error fetching PDF list: ", error);
			});
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-semibold mb-4">List of Seating Arrangements</h2>
			<List
				dataSource={pdfs}
				renderItem={(pdf, index) => (
					<List.Item>
						<div className="flex items-center justify-between w-full">
							<div>{pdf}</div>
							<div className="space-x-2">
								<Button type="primary">
									<a
										href={`api/admin/public/${pdf}`}
										download
									>
										Download
									</a>
								</Button>
								<Button
									type="primary"
									danger
									onClick={() => handleDelete(pdf)}
								>
									Delete
								</Button>
							</div>
						</div>
					</List.Item>
				)}
			/>
			<Modal
				title="Confirm Deletion"
				open={deleteModalVisible}
				onOk={confirmDelete}
				onCancel={cancelDelete}
				okText="Delete"
				cancelText="Cancel"
			>
				Are you sure you want to delete the file: {fileToDelete}?
			</Modal>
		</div>
	);
};

export default PDFList;
