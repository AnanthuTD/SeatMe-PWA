import React from "react";
import { Descriptions, Typography } from "antd";
const { Text } = Typography;

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
						<Descriptions.Item label={<Text strong>Date</Text>}>
							<Text strong italic>
								{item.date}
							</Text>
						</Descriptions.Item>
						<Descriptions.Item label={<Text strong>Course Name</Text>}>
							<Text strong italic>
								{item.courseName}
							</Text>
						</Descriptions.Item>
						<Descriptions.Item label={<Text strong>Time</Text>}>
							<Text strong italic>
								{item.timeCode}
							</Text>
						</Descriptions.Item>
					</Descriptions>
				</div>
			))}
		</div>
	);
};

export default TimeTable;
