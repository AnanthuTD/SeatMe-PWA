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
	getItem("Home", "/staff", <HomeOutlined />),
	getItem("Staff", "/staff/staffs", <UsergroupAddOutlined />, [
		getItem("Staffs List", "/staff/staffs/view", <UnorderedListOutlined />),
		getItem("Insert", "/staff/staffs/insert", <FileAddOutlined />),
	]),
	getItem("Student", "/staff/student", <IdcardOutlined />, [
		getItem("Student List", "/staff/student/view", <UnorderedListOutlined />),
		getItem("Insert", "/staff/student/insert", <FileAddOutlined />),
		getItem("Semester", "/staff/student/semester", <IdcardOutlined />),
	]),
	getItem("Supplementary", "/staff/supplementary", <IdcardOutlined />, [
		getItem("Insert", "/staff/supplementary/insert", <FileAddOutlined />),
		getItem("List", "/staff/supplementary/view", <UnorderedListOutlined />),
	]),
	getItem("Exam", "/staff/exam", <CalendarOutlined />, [
		getItem("Insert", "/staff/exam/insert", <FileAddOutlined />),
		getItem("View", "/staff/exam/view", <CalendarOutlined />),
		getItem(
			"Assign Seats",
			"/staff/exam/assign/students",
			<UnorderedListOutlined />,
		),
		getItem(
			"Assign Staffs",
			"/staff/exam/assign/staffs",
			<UnorderedListOutlined />,
		),
		getItem("Ban", "/staff/exam/ban", <UnorderedListOutlined />),
	]),
	getItem("Forms", "/staff/forms", <FormOutlined />, [
		getItem(
			"Department",
			"/staff/forms/department",
			<UnorderedListOutlined />,
		),
		getItem("Program", "/staff/forms/program", <UnorderedListOutlined />),
		getItem("Course", "/staff/forms/course", <UnorderedListOutlined />),
		getItem("Block", "/staff/forms/block", <UnorderedListOutlined />),
		getItem("Room", "/staff/forms/room", <UnorderedListOutlined />),
	]),
];

const App = () => {
	const router = useRouter();
	const pathname = usePathname();

	// const { activeMenu, setMenu } = useMenuContext();
	const [activeMenu, setMenu] = useState(null);
	// const [parentPath, setParentPath] = useState(getParentPaths(pathname));

	function getSelectedKey() {
		if (["/staff/staffs", "/staff/staffs/insert"].includes(pathname))
			return "/staff/staffs";
		if (["/staff/student", "/staff/student/insert"].includes(pathname))
			return "/staff/student";
		if (
			["/staff/exam/insert", "/staff/exam", "/staff/exam/assign"].includes(
				pathname,
			)
		)
			return "/staff/exam";
		if (
			[
				"/staff/forms/department",
				"/staff/forms/program",
				"/staff/forms/course",
			].includes(pathname)
		)
			return "/staff/forms";
	}

	const handleMenuItemClick = (key) => {
		setMenu(key);
	};

	const routeMapping = {
		"/staff": "/staff",

		"/staff/staffs/view": "/staff/staffs/view",
		"/staff/staffs": "/staff/staffs/view",
		"/staff/staffs/insert": "/staff/staffs/insert",

		"/staff/student/view": "/staff/student/view",
		"/staff/student": "/staff/student/view",
		"/staff/student/insert": "/staff/student/insert",
		"/staff/student/semester": "/staff/student/semester",

		"/staff/supplementary/insert": "/staff/supplementary/insert",
		"/staff/supplementary": "/staff/supplementary/insert",
		"/staff/supplementary/view": "/staff/supplementary/view",

		"/staff/exam/insert": "/staff/exam/insert",
		"/staff/exam": "/staff/exam/view",
		"/staff/exam/view": "/staff/exam/view",
		"/staff/exam/assign/students": "/staff/exam/assign/students",
		"/staff/exam/assign/staffs": "/staff/exam/assign/staffs",
		"/staff/exam/ban": "/staff/exam/ban",

		"/staff/forms/department": "/staff/forms/department",
		"/staff/forms/program": "/staff/forms/program",
		"/staff/forms/course": "/staff/forms/course",
		"/staff/forms/block": "/staff/forms/block",
		"/staff/forms/room": "/staff/forms/room",
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
