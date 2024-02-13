import React from "react";
import { Select } from "antd";

const { Option } = Select;

function TeacherSelector({ options, onChange, defaultValue = undefined }) {
	return (
		<Select
			showSearch
			options={options}
			style={{ width: "100%" }}
			placeholder="Select a teacher"
			optionFilterProp="children"
			onChange={onChange}
			defaultValue={defaultValue}
			fieldNames={{ label: "name", value: "id", key: "id" }}
		/>
	);
}

export default TeacherSelector;
