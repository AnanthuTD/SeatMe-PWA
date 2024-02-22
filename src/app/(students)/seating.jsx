import React, { useEffect, useState } from "react";
import { Descriptions, Typography } from "antd";
const { Text } = Typography
/**
 * Data items for the description list.
 * @type {Array<import('antd').DescriptionsItemProps>}
 */

const Seating = ({ seatingInfo }) => {
	console.log(JSON.stringify(seatingInfo, null, 2));
	const [item, setItem] = useState([]);

	useEffect(() => {
		if (seatingInfo) fetchItems();
		else setItem([]);
	}, [seatingInfo]);

	const fetchItems = () => {
		const children = [
			{
				label: "Course",
				children: <Text strong>{seatingInfo.courseName.toString()}</Text>,
			},
			{
				label: "Block",
				children: <Text strong>{seatingInfo.blockId.toString()}</Text>,
			},
			{
				label: "Floor Number",
				children: <Text strong>{seatingInfo.floor.toString()}</Text>,
			},
			{
				label: "Room",
				children:
					<Text strong>{seatingInfo.roomName?.toString() ||
						seatingInfo.roomId.toString()}</Text>,
			},
			{
				label: "Seat Number",
				children: <Text strong>{seatingInfo.seatNumber.toString()}</Text>,
			},
		];

		setItem(children);
	};

	return (
		<>
			{item.length ? (
				<Descriptions
					bordered
					column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
					items={item}
				/>
			) : (
				"Nothing"
			)}
		</>
	);
};

export default Seating;
