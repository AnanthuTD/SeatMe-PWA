import React, { useEffect, useState } from "react";
import { Select } from "antd";

const SelectDepartment = ({
	options,
	onChange,
	onClick,
	sortByValue = false,
}) => {
	useEffect(() => {
		setValue([]);
	}, [options]);

	const [value, setValue] = useState([]);

	const customSort = (optionA, optionB) => {
		if (sortByValue) {
			// Sort by code
			const valueA = Number(optionA?.value) || 0;
			const valueB = Number(optionB?.value) || 0;
			return valueA - valueB;
		} else {
			// Sort by label (default)
			const labelA = optionA?.label || '';
			const labelB = optionB?.label || '';
			return labelA.localeCompare(labelB);
		}
	};

	const handleSelectChange = (value, option) => {
		// Instead of just returning value, return the entire option object
		const selectedOption = options.find((opt) => opt.code === value);
		setValue([value]);
		onChange(value, selectedOption);
	};

	return (
		<Select
			showSearch
			allowClear
			style={{
				width: 200,
			}}
			placeholder="Search to Select"
			optionFilterProp="children"
			filterOption={(input, option) =>
				(option?.label?.toLowerCase() ?? "").includes(
					input.toLowerCase(),
				)
			}
			filterSort={customSort}
			onChange={handleSelectChange}
			onClick={onClick}
			value={value}
		>
			{options.map((option) => (
				<Select.Option
					allowClear
					key={option.code}
					value={option.code}
					label={option.name}
				>
					{option.name}
				</Select.Option>
			))}
		</Select>
	);
};

export default SelectDepartment;
