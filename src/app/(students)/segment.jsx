import { React, useState, useRef } from "react";
import { Segmented, Space } from "antd";
import Seating from "./seating";
import TimeTable from "./timeTable";

const Segment = () => {
	const segments = useRef();
	const timeTable = "Time Table";
	const seating = "seating";
	const [tab, setTab] = useState(timeTable);

	return (
		<>
			<div className="flex h-full flex-col gap-5">
				<Segmented
					block
					options={[timeTable, seating]}
					onChange={(value) => {
						console.log(value);
						setTab(value);
					}}
					ref={segments}
				/>
				<div className="flex-grow overflow-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-900 scrollbar-thumb-rounded-md">
					{tab === timeTable ? <TimeTable /> : null}
					{tab === seating ? <Seating /> : null}
				</div>
			</div>
		</>
	);
};

export default Segment;
