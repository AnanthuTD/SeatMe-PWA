import { React, useState, useEffect } from "react";
import { Segmented } from "antd";
import Seating from "./seating";
import TimeTable from "./timeTable";

const Segment = ({ seatingInfo, upcomingExams }) => {
	const tab1 = "Seating"
	const tab2 = "Upcoming Exams"
	const [tab, setTab] = useState(tab1);

	useEffect(() => {
		if (seatingInfo)
			setTab(tab1);
		else if (upcomingExams)
			setTab(tab2);
	}, [seatingInfo, upcomingExams]);

	return (
		<>
			<div className="flex h-full flex-col gap-5">
				<Segmented
					block
					options={[tab1, tab2]}
					onChange={(value) => {
						console.log(value);
						setTab(value);
					}}
					value={tab}
				/>
				<div className="flex-grow overflow-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-900 scrollbar-thumb-rounded-md">
					{tab === tab1 ? seatingInfo ? <Seating seatingInfo={seatingInfo} /> : <span>Not scheduled!</span> : null}
					{tab === tab2 ? upcomingExams.length ? <TimeTable upcomingExams={upcomingExams} /> : <span>No upcoming exams!</span> : null}
				</div>
			</div>
		</>
	);
};

export default Segment;
