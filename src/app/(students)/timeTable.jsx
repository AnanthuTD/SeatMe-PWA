import React from 'react';
import { Divider, List, Card } from 'antd';
import VirtualList from 'rc-virtual-list';


const data = [
	['25/6/2023',
		'METHODOLOGY OF PROGRAMMING',
		'1:30-4:30'],
	['25/6/2023',
		'METHODOLOGY OF PROGRAMMING',
		'1:30-4:30'],
	['25/6/2023',
		'METHODOLOGY OF PROGRAMMING',
		'1:30-4:30'],
	['25/6/2023',
		'METHODOLOGY OF PROGRAMMING',
		'1:30-4:30'],
	['25/6/2023',
		'METHODOLOGY OF PROGRAMMING',
		'1:30-4:30'],
];

const TimeTable = () => (
	<>
		

			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 4,
					lg: 4,
					xl: 6,
					xxl: 3,
				}}
				size="small"
				dataSource={data}
				// style={{overflow:'hidden', overflowY:'scroll'}}
				renderItem={(item) =>
					<List.Item>
						<List
							size="small"
							bordered
							dataSource={item}
							renderItem={(item) => <List.Item>{item}</List.Item>}
						/>
					</List.Item>
				}
			/>
		
	</>
);

export default TimeTable;