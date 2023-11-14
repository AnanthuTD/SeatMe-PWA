import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";
const { Option } = Select;

const App = ({
	options = [],
	onChange = () => {},
	onClick = () => {},
	sortByValue = false,
	selectedCourses,
	setSelectedCourses,
}) => {
	// Check if the length of options is less than 10
	const isLessThan10 = options.length < 10;

	const [value, setValue] = useState([]);

	// default selected options if less than 10 courses value
	useEffect(() => {
		const option = isLessThan10 ? options.map((option) => option) : [];
		const courseId = isLessThan10 ? options.map((option) => option.id) : [];
		setSelectedCourses(option);
		setValue(courseId);
	}, [options]);

	const customSort = (optionA, optionB) => {
		if (sortByValue) {
			// Sort by id
			const valueA = Number(optionA.value);
			const valueB = Number(optionB.value);
			return valueA - valueB;
		} else {
			// Sort by label (default)
			return optionA.label.localeCompare(optionB.label);
		}
	};

	const removeDefaultValues = (valueToRemove) => {
		const filteredValues = value.filter((obj) => obj !== valueToRemove);
		const filteredSelectedCourses = selectedCourses.filter(
			(obj) => obj.id !== valueToRemove,
		);

		setSelectedCourses(filteredSelectedCourses);
		setValue(filteredValues);
	};

	const addDefaultValues = (valueToAdd) => {
		const option = options.find((obj) => obj.id === valueToAdd);
		if (option) {
			setValue([option.id, ...value]);
			setSelectedCourses([option, ...selectedCourses]);
		}
	};

	return (
		<Select
			mode="multiple"
			allowClear
			style={{
				width: "100%",
			}}
			optionFilterProp="children"
			filterOption={(input, option) =>
				(option?.label?.toLowerCase() ?? "").includes(
					input.toLowerCase(),
				)
			}
			filterSort={customSort}
			onChange={onChange}
			optionLabelProp="label"
			value={value}
			onDeselect={removeDefaultValues}
			onClick={onClick}
			onSelect={addDefaultValues}
		>
			{options.map((option) => (
				<Option
					allowClear
					key={option.id}
					value={option.id}
					label={`${option.name}(${option.name})`}
				>
					<Space>{`${option.name}(${option.name})`}</Space>
				</Option>
			))}
		</Select>
	);
};

export default App;
