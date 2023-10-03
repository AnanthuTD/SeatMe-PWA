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
	]),
	getItem("Student", "/admin/student", <MailOutlined />, [
		getItem("Student List", "/admin/student/list", <OrderedListOutlined />),
	]),
	getItem("Exam", "/admin/exam", <AppstoreOutlined />, [
		getItem("Time Table", "/admin/exam/timetable",<></>, [
			getItem("Insert", "/admin/exam/timetable/insert"),
			getItem("View", "/admin/exam/timetable/view"),
		]),
	]),
];

const App = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { activeMenu, setMenu } = useMenuContext();
	const [parentPath, setParentPath] = useState(getParentPaths(pathname));

	// setMenu(pathname)

	function getParentPaths(path) {
		const parts = path.split("/").filter((part) => part.length > 0);

		const parentPath = "/" + parts.slice(0, parts.length - 1).join("/");

		return parentPath;
	}

	const handleMenuItemClick = (key) => {
		console.log("key: " + key);
		setMenu(key);
	};

	useEffect(() => {
		if (activeMenu) {
			console.log("active menu ", activeMenu);
			if (activeMenu === "/admin") router.push("/admin");
			else if (activeMenu === "/admin/staffs/list")
				router.push("/admin/staffs/list");
			else if (activeMenu === "/admin/student/list")
				router.push("/admin/student/list");
			else if (activeMenu === "/admin/exam/timetable/insert")
				router.push("/admin/exam/timetable/insert");
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
