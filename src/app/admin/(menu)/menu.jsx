// 'use client'

import React, { useEffect, useState } from "react";
import {
	AppstoreOutlined,
	TeamOutlined,
	OrderedListOutlined,
	MailOutlined,
	HomeOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useMenuContext } from "./menuContext";
import { useRouter, usePathname } from "next/navigation";

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
	getItem("Home", "/admin", <HomeOutlined />),
	getItem("Staff", "/admin/staffs", <TeamOutlined />, [
		getItem("Staffs List", "/admin/staffs/list", <OrderedListOutlined />),
		getItem("Insert", "/admin/staffs/insert", <OrderedListOutlined />),
	]),
	getItem("Student", "/admin/student", <MailOutlined />, [
		getItem("Student List", "/admin/student/list", <OrderedListOutlined />),
		getItem("Insert", "/admin/student/insert", <OrderedListOutlined />),
	]),
	getItem("Exam", "/admin/exam", <AppstoreOutlined />, [
		getItem("Time Table", "/admin/exam/timetable", <></>, [
			getItem("Insert", "/admin/exam/timetable/insert"),
			getItem("View", "/admin/exam/timetable/view"),
		]),
		getItem("Assign", "/admin/exam/assign", <OrderedListOutlined />),
	]),
];

const App = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { activeMenu, setMenu } = useMenuContext();
	const [parentPath, setParentPath] = useState(getParentPaths(pathname));

	function getParentPaths(path) {
		const parts = path.split("/").filter((part) => part.length > 0);

		const parentPath = "/" + parts.slice(0, parts.length - 1).join("/");

		return parentPath;
	}

	const handleMenuItemClick = (key) => {
		setMenu(key);
	};

	const routeMapping = {
		"/admin": "/admin",
		"/admin/staffs/list": "/admin/staffs/list",
		"/admin/staffs/insert": "/admin/staffs/insert",
		"/admin/student/list": "/admin/student/list",
		"/admin/student/insert": "/admin/student/insert",
		"/admin/exam/timetable/insert": "/admin/exam/timetable/insert",
		"/admin/exam/timetable/view": "/admin/exam/timetable/view",
		"/admin/exam/assign": "/admin/exam/assign",
	};

	useEffect(() => {
		if (activeMenu && routeMapping[activeMenu]) {
			console.log("active menu ", activeMenu);
			router.push(routeMapping[activeMenu]);
		}
	}, [activeMenu]);

	return (
		<Menu
			defaultSelectedKeys={[pathname]}
			defaultOpenKeys={[parentPath]}
			mode="inline"
			items={items}
			className="flex-grow"
			onClick={(e) => handleMenuItemClick(e.key)}
		/>
	);
};
export default App;
