// 'use client'

import React, { useEffect, useState } from "react";
import {
	HomeOutlined,
	UsergroupAddOutlined,
	UnorderedListOutlined,
	IdcardOutlined,
	CalendarOutlined,
	ScheduleOutlined,
	FileAddOutlined,
	FormOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
// import { useMenuContext } from "./menuContext";
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
	getItem("Staff", "/admin/staffs", <UsergroupAddOutlined />, [
		getItem("Staffs List", "/admin/staffs/list", <UnorderedListOutlined />),
		getItem("Insert", "/admin/staffs/insert", <FileAddOutlined />),
	]),
	getItem("Student", "/admin/student", <IdcardOutlined />, [
		getItem(
			"Student List",
			"/admin/student/list",
			<UnorderedListOutlined />,
		),
		getItem("Insert", "/admin/student/insert", <FileAddOutlined />),
	]),
	getItem("Exam", "/admin/exam", <CalendarOutlined />, [
		getItem("Time Table", "/admin/exam/timetable", <ScheduleOutlined />, [
			getItem(
				"Insert",
				"/admin/exam/timetable/insert",
				<FileAddOutlined />,
			),
			getItem("View", "/admin/exam/timetable/view", <CalendarOutlined />),
		]),
		getItem("Assign", "/admin/exam/assign", <UnorderedListOutlined />),
	]),
	getItem("Forms", "/admin/forms", <FormOutlined />, [
		getItem(
			"Department",
			"/admin/forms/department",
			<UnorderedListOutlined />,
		),
		getItem("Program", "/admin/forms/program", <UnorderedListOutlined />),
		getItem("Course", "/admin/forms/course", <UnorderedListOutlined />),
		getItem("Block", "/admin/forms/block", <UnorderedListOutlined />),
		getItem("Room", "/admin/forms/room", <UnorderedListOutlined />),
	]),
];

const App = () => {
	const router = useRouter();
	const pathname = usePathname();
	// const { activeMenu, setMenu } = useMenuContext();
	const [ activeMenu, setMenu ] = useState(null);
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
		"/admin/forms/department": "/admin/forms/department",
		"/admin/forms/program": "/admin/forms/program",
		"/admin/forms/course": "/admin/forms/course",
		"/admin/forms/block": "/admin/forms/block",
		"/admin/forms/room": "/admin/forms/room",
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
