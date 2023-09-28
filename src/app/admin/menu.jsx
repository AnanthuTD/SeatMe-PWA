// 'use client'

import React from 'react';
import {
    AppstoreOutlined,
    TeamOutlined,
    OrderedListOutlined,
    MailOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('Home', '1', <HomeOutlined />),
    getItem('Staff', '2', <TeamOutlined />, [
        getItem('Staffs List', '3', <OrderedListOutlined />),
    ]),
    getItem('Navigation One', 'sub1', <MailOutlined />, [
        getItem('Option 6', '6'),
        getItem('Option 7', '7'),
        getItem('Option 8', '8'),
    ]),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
        getItem('Option 9', '9'),
        getItem('Option 10', '10'),
        getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
    ]),
];
const App = () => {
    return (

        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            className='flex-grow'
        />
    );
};
export default App;