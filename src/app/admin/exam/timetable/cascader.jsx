import React from "react";
import { Cascader } from "antd";
/* const options = [
	{
		label: "Light",
		value: "light",
		children: new Array(20).fill(null).map((_, index) => ({
			label: `Number ${index}`,
			value: index,
		})),
	},
	{
		label: "Bamboo",
		value: "bamboo",
		children: [
			{
				label: "Little",
				value: "little",
				children: [
					{
						label: "Toy Fish",
						value: "fish",
						disableCheckbox: true,
					},
					{
						label: "Toy Cards",
						value: "cards",
					},
					{
						label: "Toy Bird",
						value: "bird",
					},
				],
			},
		],
	},
]; */

const App = ({ options = [], onChange = () => {}, onClick = () => {} }) => {
	const filter = (inputValue, path) =>
		path.some(
			(option) =>
				option.name.toLowerCase().indexOf(inputValue.toLowerCase()) >
				-1,
		);
	return (
		<Cascader
			style={{
				width: "100%",
			}}
			onChange={onChange}
			onClick={onClick}
			multiple
			maxTagCount="responsive"
			options={options}
			fieldNames={{ label: "name", value: "id" }}
			showSearch={{
				filter,
			}}
			// onSearch={(value) => console.log(value)}
		/>
	);
};
export default App;
