"use client";
import React, { useState, useEffect } from "react";
import RoomDetail from "./roomDetails";
import axios from "@/lib/axiosPrivate";
import { Spin } from "antd";

const Page = ({ params }) => {
	const [rooms, setRooms] = useState([]);
	const [examType, examinesCount] = params.details || [];
	const [loading, setLoading] = useState(false);

	const loadRooms = async (examType) => {
		setLoading(true);
		let url = "/api/staff/rooms";

		if (examType) {
			url = `/api/staff/rooms/${examType}`;
		}

		const result = await axios.get(url);
		result.data.sort((room1, room2) => {
			return room2.isAvailable - room1.isAvailable;
		});
		setRooms(result.data);
		setLoading(false);
	};

	useEffect(() => {
		loadRooms(examType);
	}, []);

	return (
		<>
			{loading ? (
				<Spin />
			) : (
				<RoomDetail
					data={rooms}
					setData={setRooms}
					examinesCount={examinesCount}
					examType={examType}
				/>
			)}
		</>
	);
};

export default Page;
