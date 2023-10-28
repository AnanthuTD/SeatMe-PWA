import React from "react";
import { Table, Spin } from "antd";

const SeatingMatrix = ({ classes }) => {
	if (!classes || classes.length === 0) {
		// Handle the case when classes array is empty or not provided
		return <div>No data available</div>;
	}

	return (
		<div>
            {console.log(classes) }
			{classes.map((classData, classIndex) => (
				<div key={classIndex}>
					<h3>Class {classIndex + 1}</h3>
					<Table
						dataSource={classData.exams[classIndex].examines}
						columns={classData.exams.map(
							(program, programIndex) => ({
								title: `${program.name}-sem_${program.semester}`,
								dataIndex: `seatingMatrix.${programIndex}`, // Assuming exams are related to seatingMatrix
								key: `seatingMatrix.${programIndex}`,
							}),
						)}
					/>
				</div>
			))}
		</div>
	);
};

export default SeatingMatrix;
