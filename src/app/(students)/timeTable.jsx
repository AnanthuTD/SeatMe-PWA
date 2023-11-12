import React from "react";
import { Descriptions } from "antd";

const TimeTable = ({ upcomingExams }) => {
	return (
		<div>
			{upcomingExams.map((item, index) => (
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
