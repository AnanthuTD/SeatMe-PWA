import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";

/**
 * Data items for the description list.
 * @type {Array<import('antd').DescriptionsItemProps>}
 */

const Seating = ({ data }) => {
	console.log(JSON.stringify(data, null, 2));
	const [items, setItems] = useState([]);

	useEffect(() => {
		fetchItems();
	}, [data]);

	const fetchItems = () => {
		const newItems = data
			.filter((studentSeat) => studentSeat.roomId?true:false)
			.map((studentSeat) => {
				const children = [
					{
						label: "Block",
						children: studentSeat.blockId.toString(),
					},
					{
						label: "Floor Number",
						children: studentSeat.floor.toString(),
					},
					{
						label: "Row Number",
						children: studentSeat.roomId.toString(),
					},
					{
						label: "Seat Number",
						children: studentSeat.seatNumber.toString(), // Convert to string
					},
				];

				return children;
			});

		setItems(newItems);
	};

	// console.log("data: ", items);

	return (
		<>
			{items.map((item) => (
				<Descriptions
					bordered
					column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
					items={item}
				/>
			))}
		</>
	);
};

export default Seating;
