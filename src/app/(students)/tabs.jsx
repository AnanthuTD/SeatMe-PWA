import React from 'react';
import { Tabs } from 'antd';
import Seating from './seating';

const onChange = (key) => {
    console.log(key);
};

const Tab = () => (
    <Tabs
        onChange={onChange}
        type="card"
        size='large'
        items={
            [{
                label: `Time Table`,
                key: 'time-table',
                children: `Content of Tab Pane ${'time table'}`,
            }, {
                label: `Seating`,
                key: 'seating',
                children: <Seating />,
            }]
        }
    />
);

export default Tab;