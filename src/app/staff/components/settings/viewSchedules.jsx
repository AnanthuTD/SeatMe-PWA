import React, { useEffect, useState } from "react";
import axios from "@/lib/axiosPrivate";
import { Table, Button, Popconfirm } from "antd";
import { useAccount } from "@/context/accountContext";

const ViewSchedules = ({ updateSchedule }) => {
	const [schedules, setSchedules] = useState([]);
	const { user } = useAccount();

	useEffect(() => {
		axios
			.get("/api/staff/config/seating-availability-schedule")
			.then((response) => {
				if (response.status === 200) {
					setSchedules(response.data);
				} else {
					console.error("Error fetching schedules:", response.statusText);
				}
			})
			.catch((error) => console.error("Error fetching schedules:", error));
	}, [updateSchedule]);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Day",
			dataIndex: "day",
			key: "day",
		},
		{
			title: "Start Time",
			dataIndex: "startTime",
			key: "startTime",
		},
		{
			title: "End Time",
			dataIndex: "endTime",
			key: "endTime",
		},
		{
			title: "Time Code",
			dataIndex: "timeCode",
			key: "timeCode",
		},
	];

	if (user.role === "admin")
		columns.push({
			title: "Action",
			key: "action",
			render: (text, record) => (
				<span>
					<Popconfirm
						title="Are you sure you want to delete this schedule?"
						onConfirm={() => handleDelete(record.id)}
						okText="Yes"
						cancelText="No"
					>
						<Button type="primary" danger>
							Delete
						</Button>
					</Popconfirm>
				</span>
			),
		});

	const handleDelete = (id) => {
		axios
			.delete(`/api/staff/config/seating-availability-schedule/${id}`)
			.then(() => {
				setSchedules((prevSchedules) =>
					prevSchedules.filter((schedule) => schedule.id !== id),
				);
				// console.log(`Deleted record with ID ${id}`);
			})
			.catch((error) =>
				console.error(`Error deleting record with ID ${id}:`, error),
			);
	};

	return (
		<div>
			<Table dataSource={schedules} columns={columns} pagination={false} />
		</div>
	);
};

export default ViewSchedules;
