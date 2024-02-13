<<<<<<< HEAD
// SelectProgram.js
import React from 'react';
import { Select } from 'antd';

const SelectProgram = ({ options, placeholder, onChange, value }) => {
  return (
    <Select
      showSearch
      placeholder={placeholder}
      optionFilterProp="label"
      onChange={onChange}
      value={value}
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((program) => (
        <Select.Option key={program.id} value={program.id} label={program.name}>
          {program.name}
        </Select.Option>
      ))}
    </Select>
  );
=======
import React, { useEffect, useState } from "react";
import { Select } from "antd";

const SelectProgram = ({
	options,
	onChange,
	onClick = () => {},
	sortByValue = false,
}) => {
	useEffect(() => {
		setValue([]);
	}, [options]);

	const [value, setValue] = useState([]);

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

	const handleSelectChange = (value, option) => {
		// Instead of just returning value, return the entire option object
		const selectedOption = options.find((opt) => opt.id === value);
		setValue([value]);
		onChange(value, selectedOption);
	};

	const customFilter = (input, option) => {
		console.log(option);
		const codeMatches = (option?.children?.toLowerCase() ?? "").includes(
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
			allowClear
			style={{
				width: 300,
			}}
			placeholder="Search to Select"
			optionFilterProp="children"
			filterOption={customFilter}
			filterSort={customSort}
			onChange={handleSelectChange}
			onClick={onClick}
			value={value}
		>
			{options.map((option) => (
				<Select.Option
					allowClear
					key={option.id}
					value={option.id}
					label={option.name}
				>
					{option.name +
						" ( " +
						option.id +
						" )" +
						" ( " +
						option.abbreviation +
						" )"}
				</Select.Option>
			))}
		</Select>
	);
>>>>>>> 7ade08f570348305db8aa7663ce568ae2ed17704
};

export default SelectProgram;
