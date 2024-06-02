import React from "react";
import { Select } from "antd";

const SelectDepartment = ({
	options,
	onChange,
	onClick,
	sortByValue = false,
	defaultValue = undefined,
}) => {
	const customSort = (optionA, optionB) => {
		if (sortByValue) {
			// Sort by code
			const valueA = Number(optionA?.value) || 0;
			const valueB = Number(optionB?.value) || 0;
			return valueA - valueB;
		} else {
			// Sort by label (default)
			const labelA = optionA?.label || "";
			const labelB = optionB?.label || "";
			return labelA.localeCompare(labelB);
		}
	};

	const SelectProgram = ({ options, ...props }) => {
		const handleChange = (value) => {
			// console.log('Selected value:', value);
			// You may want to update the form field here
			// Example: props.onChange(value);
		};

		return (
			<Select {...props} onChange={handleChange}>
				{options.map((option) => (
					<Select.Option key={option.value} value={option.value}>
						{option.label}
					</Select.Option>
				))}
			</Select>
		);
	};

	const handleSelectChange = (value, option) => {
		const selectedOption = options.find((opt) => opt.code === value);
		onChange(value, selectedOption);
	};

	const customFilter = (input, option) => {
		const codeMatches = (option?.code?.toLowerCase() ?? "").includes(
			input.toLowerCase(),
		);
		const nameMatches = (option?.name?.toLowerCase() ?? "").includes(
			input.toLowerCase(),
		);

		return codeMatches || nameMatches;
	};

	return (
		<Select
			showSearch
			allowClear={true}
			style={{
				width: 200,
			}}
			placeholder="Search to Select"
			filterOption={customFilter}
			filterSort={customSort}
			onChange={handleSelectChange}
			onClick={onClick}
			defaultValue={defaultValue}
			fieldNames={{ label: "name", value: "code", key: "code" }}
			options={options}
		/>
	);
};

export default SelectDepartment;
