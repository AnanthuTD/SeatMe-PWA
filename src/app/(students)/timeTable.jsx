import React from "react";
import { Descriptions } from "antd";

const TimeTable = ({ data }) => {
	const convertedData = data.map((value) => {
		const dateParts = value.date?.split("-");
		const formattedDate = dateParts
			? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
			: "not issued";
		return {
			date: formattedDate,
			courseName: value.courseName,
			timeCode: value.timeCode ? value.timeCode : "not issued",
		};
	});

	return (
		<div>
			{convertedData.map((item, index) => (
				<div key={index} className="mb-4">
					{" "}
					<Descriptions
						bordered
						column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 3 }}
					>
						<Descriptions.Item label="Date">
							{item.date}
						</Descriptions.Item>
						<Descriptions.Item label="Course Name">
							{item.courseName}
						</Descriptions.Item>
						<Descriptions.Item label="Time">
							{item.timeCode}
						</Descriptions.Item>
					</Descriptions>
				</div>
			))}
		</div>
	);
};

export default TimeTable;
