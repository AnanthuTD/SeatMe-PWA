import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";

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
				children: seatingInfo.courseName.toString(),
			},
			{
				label: "Block",
				children: seatingInfo.blockId.toString(),
			},
			{
				label: "Floor Number",
				children: seatingInfo.floor.toString(),
			},
			{
				label: "Room",
				children:
					seatingInfo.roomName?.toString() ||
					seatingInfo.roomId.toString(),
			},
			{
				label: "Seat Number",
				children: seatingInfo.seatNumber.toString(), // Convert to string
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
