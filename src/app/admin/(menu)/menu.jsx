import React, { useEffect, useState } from "react";
import {
	HomeOutlined,
	UsergroupAddOutlined,
	UnorderedListOutlined,
	IdcardOutlined,
	CalendarOutlined,
	FileAddOutlined,
	FormOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
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
		getItem("Staffs List", "/admin/staffs/view", <UnorderedListOutlined />),
		getItem("Insert", "/admin/staffs/insert", <FileAddOutlined />),
	]),
	getItem("Student", "/admin/student", <IdcardOutlined />, [
		getItem(
			"Student List",
			"/admin/student/view",
			<UnorderedListOutlined />,
		),
		getItem("Insert", "/admin/student/insert", <FileAddOutlined />),
		getItem("Semester", "/admin/student/semester", <IdcardOutlined />),
	]),
	getItem("Supplementary", "/admin/supplementary", <IdcardOutlined />, [
		getItem("Insert", "/admin/supplementary/insert", <FileAddOutlined />),
		getItem("List", "/admin/supplementary/view", <UnorderedListOutlined />),
	]),
	getItem("Exam", "/admin/exam", <CalendarOutlined />, [
		getItem("Insert", "/admin/exam/insert", <FileAddOutlined />),
		getItem("View", "/admin/exam/view", <CalendarOutlined />),
		getItem(
			"Assign Seats",
			"/admin/exam/assign/students",
			<UnorderedListOutlined />,
		),
		getItem(
			"Assign Staffs",
			"/admin/exam/assign/staffs",
			<UnorderedListOutlined />,
		),
		getItem("Ban", "/admin/exam/ban", <UnorderedListOutlined />),
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
	const [activeMenu, setMenu] = useState(null);
	// const [parentPath, setParentPath] = useState(getParentPaths(pathname));

	function getSelectedKey() {
		if (["/admin/staffs", "/admin/staffs/insert"].includes(pathname))
			return "/admin/staffs";
		if (["/admin/student", "/admin/student/insert"].includes(pathname))
			return "/admin/student";
		if (
			[
				"/admin/exam/insert",
				"/admin/exam",
				"/admin/exam/assign",
			].includes(pathname)
		)
			return "/admin/exam";
		if (
			[
				"/admin/forms/department",
				"/admin/forms/program",
				"/admin/forms/course",
			].includes(pathname)
		)
			return "/admin/forms";
	}

	const handleMenuItemClick = (key) => {
		setMenu(key);
	};

	const routeMapping = {
		"/admin": "/admin",

		"/admin/staffs/view": "/admin/staffs/view",
		"/admin/staffs": "/admin/staffs/view",
		"/admin/staffs/insert": "/admin/staffs/insert",

		"/admin/student/view": "/admin/student/view",
		"/admin/student": "/admin/student/view",
		"/admin/student/insert": "/admin/student/insert",
		"/admin/student/semester": "/admin/student/semester",

		"/admin/supplementary/insert": "/admin/supplementary/insert",
		"/admin/supplementary": "/admin/supplementary/insert",
		"/admin/supplementary/view": "/admin/supplementary/view",

		"/admin/exam/insert": "/admin/exam/insert",
		"/admin/exam": "/admin/exam/view",
		"/admin/exam/view": "/admin/exam/view",
		"/admin/exam/assign/students": "/admin/exam/assign/students",
		"/admin/exam/assign/staffs": "/admin/exam/assign/staffs",
		"/admin/exam/ban": "/admin/exam/ban",

		"/admin/forms/department": "/admin/forms/department",
		"/admin/forms/program": "/admin/forms/program",
		"/admin/forms/course": "/admin/forms/course",
		"/admin/forms/block": "/admin/forms/block",
		"/admin/forms/room": "/admin/forms/room",
	};

	useEffect(() => {
		if (activeMenu && routeMapping[activeMenu]) {
			router.push(routeMapping[activeMenu]);
		}
	}, [activeMenu]);

	return (
		<Menu
			defaultSelectedKeys={[pathname]}
			defaultOpenKeys={[getSelectedKey()]}
			mode="inline"
			items={items}
			className="flex-grow"
			onClick={(e) => handleMenuItemClick(e.key)}
		/>
	);
};
export default App;
