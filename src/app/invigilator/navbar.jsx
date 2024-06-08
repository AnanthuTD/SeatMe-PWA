"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";

import {
	Modal,
	Form,
	Input,
	Row,
	Col,
	message,
	Descriptions,
} from "antd";
import { useRouter } from "next/navigation";
// import { useAccount } from "@/context/accountContext";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LogOut } from "../sign-in/actions";

function Navbar({ examinees = false }) {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [visible, setVisible] = React.useState(false);
	const router = useRouter();

	dayjs.extend(utc);
	dayjs.extend(timezone);

	const [attendancetime, setAttendancetime] = useState(false);

	/* 	useEffect(() => {
		// Get current Indian time
		const currentIndianTime = dayjs().tz("Asia/Kolkata").format("HH:mm:ss");

		// console.log(currentIndianTime);
		// Check if the current time in India is between either of the two time ranges
		const isWithinRange =
			(currentIndianTime > "09:30:00" && currentIndianTime < "10:30:00") ||
			(currentIndianTime > "13:30:00" && currentIndianTime < "14:45:00");
		setAttendancetime(isWithinRange);
	}, []); */

	let pages = ["Schedule", "Examinees"];
	if (!examinees && !attendancetime) pages = ["Schedule"];

	const settings = ["Profile", "Logout"];

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	const handleLogout = async () => {
		try {
			await LogOut();
		} catch (e) {
			console.error(e);
			message.error("Logout failed!");
		}
	};

	const [visibleprofile, setVisibleprofile] = useState(false);
	const [descriptionItems, setDescriptionItems] = useState([]);
	// const { user, setUser } = useAccount();
	const user = { name: "name", email: "email", password: "password" };
	const setUser = (user) => {};

	const handleSettingsClick = () => {
		setVisibleprofile(true);
	};

	const handleCancel = () => {
		setVisibleprofile(false);
	};

	/*  const items = [
		  {
			  key: "viewProfile",
			  href: "#viewProfile",
			  title: "Profile",
			  // label: "Profile",
		  },
		  {
			  key: "Updatepassword",
			  href: "#editProfile",
			  title: "UpdatePassword",
			  // label: "Notifications",
		  },
	  ]; */

	/* 	useEffect(() => {
		const descriptionItems = [
			{
				key: "1",
				label: "Id",
				children: user?.id,
			},
			{
				key: "2",
				label: "UserName",
				children: user?.name,
			},
			{
				key: "3",
				label: "Email",
				children: user?.email,
			},
			{
				key: "4",
				label: "Designation",
				children: user?.designation || "Empty",
			},
		];
		setDescriptionItems(descriptionItems);
	}, [user]); */

	return (
		<>
			<AppBar position="static" sx={{ backgroundColor: "#004AAD" }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							SeatMe
						</Typography>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}
						>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page} onClick={handleCloseNavMenu}>
										<Link
											href={
												page === "Schedule"
													? "/invigilator"
													: "/invigilator/attendance"
											}
											style={{ textDecoration: "none" }}
										>
											<Typography textAlign="center">
												{page}
											</Typography>
										</Link>
									</MenuItem>
								))}
							</Menu>
						</Box>

						<Typography
							variant="h5"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							SeatMe
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}
						>
							{pages.map((page) => (
								<Link
									key={page}
									href={
										page === "Schedule"
											? "/invigilator"
											: "/invigilator/attendance"
									}
									style={{ textDecoration: "none" }}
								>
									<Button
										onClick={handleCloseNavMenu}
										sx={{
											my: 2,
											color: "white",
											display: "block",
										}}
									>
										{page}
									</Button>
								</Link>
							))}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar src="/broken-image.jpg" />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{settings.map((setting) => (
									<MenuItem
										key={setting}
										onClick={() => {
											handleCloseUserMenu();
											if (setting === "Logout") {
												handleLogout();
											} else {
												handleSettingsClick();
											}
										}}
									>
										<Typography textAlign="center">
											{setting}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Modal
				title="Settings"
				open={visibleprofile}
				onCancel={handleCancel}
				footer={null}
				centered
				width={1000}
			>
				<Row gutter={16} style={{ maxHeight: "400px", overflowY: "auto" }}>
					<Col
						span={18}
						style={{ maxHeight: "400px", overflowY: "auto" }}
						className="scrollbar-none"
					>
						<Title level={3}>User Profile</Title>
						<Descriptions
							id="viewProfile"
							// title="User Profile"
							// bordered
							layout="vertical"
							items={descriptionItems}
							column={2}
						/>

						<Title level={4}>update Password</Title>

						<Form
							id="editProfile"
							layout="vertical"
							/* onFinish={onFinish} */
						>
							<Form.Item
								label="Current Password"
								name="password"
								required
								rules={[
									{
										validator: async (_, value) => {
											if (!value) {
												throw new Error("Please provide Password");
											}
										},
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item label="New Password" name="newPassword">
								<Input.Password />
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit">
									Update
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Modal>
		</>
	);
}
export default Navbar;
