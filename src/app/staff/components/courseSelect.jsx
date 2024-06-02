"use client";
import React, { useState, useEffect } from "react";
import { Select, Button } from "antd";
const { Option } = Select;

const CoursesSelect = ({
	options = [],
	onChange = () => {},
	onClick = () => {},
	sortByValue = false,
	selectedCourses,
	setSelectedCourses = (courses) => {},
	mode = "multiple",
	defaultSelectAll = true,
}) => {
	// Check if the length of options is less than 10
	const isLessThan20 = defaultSelectAll ? options.length < 20 : false;

	const [value, setValue] = useState([]);
	const [cleared, setCleared] = useState(false);

	// default selected options if less than 10 courses value
	useEffect(() => {
		// console.log("options changed");
		setCleared(false);
		const option = isLessThan20 ? options.map((option) => option) : [];
		const courseId = isLessThan20 ? options.map((option) => option.id) : [];
		// const option = options.length ? options.map((option) => option) : [];
		// const courseId = options.length ? options.map((option) => option.id) : [];
		setSelectedCourses(option);
		setValue(courseId);
	}, [options]);

	useEffect(() => {
		// console.log("cleared");
	}, [cleared]);

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

	const handleClear = () => {
		// console.log("Clear button clicked!");
		setSelectedCourses([]);
		setValue([]);
	};

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
			<Select
				mode={mode}
				// allowClear={true}
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
						label={`${option.name}(${option.id})`}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>{`${option.name} - (${option.id})`}</div>
							{option.type && (
								<span style={{ marginLeft: 8 }}>{option.type}</span>
							)}
						</div>
					</Option>
				))}
			</Select>
			<Button type="primary" ghost onClick={handleClear}>
				Clear
			</Button>
		</div>
	);
};

export default CoursesSelect;
