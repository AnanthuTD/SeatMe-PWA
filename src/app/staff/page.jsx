"use client";

import React, { useState, useEffect } from "react";
import { List, Button, Modal, Input } from "antd";
import axios from "@/lib/axiosPrivate";
import DownloadButton from "./components/downloadReport";
// import { useAccount } from "@/context/accountContext";

const PDFList = () => {
	const [pdfs, setPDFs] = useState([]);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [fileToDelete, setFileToDelete] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredPDFs, setFilteredPDFs] = useState([]);
	const { user } = useAccount();

	const handleDelete = (pdf) => {
		setFileToDelete(pdf);
		setDeleteModalVisible(true);
	};

	const confirmDelete = () => {
		axios
			.delete(`api/staff/reports/${fileToDelete}`)
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
			.get("api/staff/reports")
			.then((response) => {
				setPDFs(response.data);
			})
			.catch((error) => {
				console.error("Error fetching PDF list: ", error);
			});
	}, []);

	useEffect(() => {
		// Filter the PDFs based on the searchQuery without changing the original state
		const filteredPDFs = pdfs.filter((pdf) =>
			pdf.toLowerCase().includes(searchQuery.toLowerCase()),
		);
		setFilteredPDFs(filteredPDFs); // Update the filtered PDFs state
	}, [searchQuery, pdfs]);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-semibold mb-4">
				List of Seating Arrangements
			</h2>
			<Input
				placeholder="Search PDFs"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<List
				dataSource={filteredPDFs}
				renderItem={(pdf, index) => (
					<List.Item>
						<div className="flex items-center justify-between w-full">
							<div>{pdf}</div>
							<div className="space-x-2">
								<DownloadButton fileName={pdf} />
								<Button
									type="primary"
									danger
									onClick={() => handleDelete(pdf)}
									disabled={user.role !== "admin"}
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
