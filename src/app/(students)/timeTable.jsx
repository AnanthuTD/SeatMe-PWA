import React from "react";
import { List } from "antd";

/* const data = [
	["25/6/2023", "METHODOLOGY OF PROGRAMMING", "1:30-4:30"],
	["25/6/2023", "METHODOLOGY OF PROGRAMMING", "1:30-4:30"],
	["25/6/2023", "METHODOLOGY OF PROGRAMMING", "1:30-4:30"],
	["25/6/2023", "METHODOLOGY OF PROGRAMMING", "1:30-4:30"],
	["25/6/2023", "METHODOLOGY OF PROGRAMMING", "1:30-4:30"],
]; */

const TimeTable = ({ data }) => {
	const convertedData = data
		.map((value) => {
			const dateParts = value.date?.split("-");
			const formattedDate = dateParts
				? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
				: "not issued";
			return [
				formattedDate,
				value.courseName,
				`${value.timeCode ? value.timeCode : "not issued"}`,
			];
		})
		

	// Log the converted data
	// console.log(convertedData);
	return (
		<>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 1,
					lg: 1,
					xl: 1,
					xxl: 3,
				}}
				size="small"
				dataSource={convertedData}
				// style={{overflow:'hidden', overflowY:'scroll'}}
				renderItem={(item) => (
					<List.Item>
						<List
							size="small"
							bordered
							dataSource={item}
							renderItem={(item) => <List.Item>{item}</List.Item>}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};
export default TimeTable;
