import React from 'react';
import { Descriptions } from 'antd';

/**
    * Data items for the description list.
    * @type {Array<import('antd').DescriptionsItemProps>}
    */
const items = [
    {
        label: 'Building',
        children: 'South Block',
    },
    {
        label: 'Floor Number',
        children: '1st Floor',
    },
    {
        label: 'Room Number',
        children: '704',
    },
    {
        label: 'Row Number',
        // span: { xl: 2, xxl: 2 },
        children: '5',
    },
    {
        label: 'Seat Number',
        // span: { xl: 2, xxl: 2 },
        children: '15',
    },
];

const Seating = () => {
   return <Descriptions
        // title="Responsive Descriptions"
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        items={items}
    />
};

export default Seating;