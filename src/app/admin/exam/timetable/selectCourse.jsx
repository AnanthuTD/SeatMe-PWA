import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";
const { Option } = Select;

const App = ({
	options = [],
	onChange = () => {},
	onClick = () => {},
	sortByValue = false,
}) => {
	// Check if the length of options is less than 10
	const isLessThan10 = options.length < 10;

	// Calculate the default values based on all option values
	const [defaultValues, setDefaultValues] = useState([]);

	useEffect(() => {
		const values = isLessThan10 ? options.map((option) => option.id) : [];
		setDefaultValues(values);
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
		const filteredValues = defaultValues.filter(
			(obj) => obj !== valueToRemove,
		);
		setDefaultValues(filteredValues);
	};

	const addDefaultValues = (valueToAdd) => {
		const option = options.find((obj) => obj.id === valueToAdd);
		if (option) {
			setDefaultValues([option.id, ...defaultValues]);
		}
	};

	useEffect(() => {
		console.log(defaultValues);
	}, [defaultValues]);

	return (
		<Select
			mode="multiple"
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
			value={defaultValues}
			onDeselect={removeDefaultValues}
			onClick={onClick}
			onSelect={addDefaultValues}
		>
			{options.map((option) => (
				<Option
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
