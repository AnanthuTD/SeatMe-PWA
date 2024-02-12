"use client";
import React, { useEffect, useState } from "react";
import { SortableList } from "./components";
import "./styles.css";
import axios from "@/lib/axiosPrivate";

export default function App({ date, onSort }) {
	const [items, setItems] = useState([]);

	async function fetchExams() {
		const response = await axios.get(`/api/admin/exams/`, {
			params: {
				query: date,
				column: "date",
			},
		});

		const exams = response.data;
		setItems(exams);
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
								{item["course.name"]} (
								<span class="text-gray-500 text-sm">
									{item["course.id"]}
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
