"use client";
import React, { useEffect, useState } from "react";
import { SortableList } from "./components";
import "./styles.css";
import axios from "@/lib/axiosPrivate";
import { useAccount } from "@/context/accountContext";
import { useRouter } from "next/navigation";

export default function App({ date, timeCode, onSort }) {
	const { user } = useAccount();

	if (user.role !== "admin") {
		const router = useRouter();
		return router.push("/admin/forbidden");
	}

	const [items, setItems] = useState([]);

	async function fetchExams() {
		try {
			const response = await axios.get(`/api/admin/exams/program`, {
				params: {
					date,
					timeCode,
				},
			});
			const exams = response.data;
			setItems(exams);
		} catch (error) {
			if (error.response && error.response.status !== 403) {
				message.error("Something went wrong!");
			}
			console.error("API call failed:", error);
		}
	}

	useEffect(() => {
		fetchExams();
	}, []);

	return (
		<div>
			<h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
				Sortable Exam List
			</h1>
			<SortableList
				items={items}
				onChange={(items) => {
					onSort(items);
					setItems(items);
				}}
				renderItem={(item) => (
					<SortableList.Item
						id={item.id}
						className="bg-white shadow-sm rounded-md p-4 mb-4 flex items-center justify-between"
					>
						<div className="flex items-center">
							<span class="course">
								{item["courseName"]} (
								<span class="text-gray-500 text-sm">
									{item["courseId"]}
								</span>
								)
							</span>
						</div>
						<SortableList.DragHandle className="cursor-grab" />
					</SortableList.Item>
				)}
			/>
		</div>
	);
}
