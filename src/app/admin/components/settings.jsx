import React, { useState } from "react";
import {
	Button,
	Modal,
	Anchor,
	Form,
	Input,
	Switch,
	Row,
	Col,
	message,
	Descriptions,
	Menu,
} from "antd";
import {
	UserOutlined,
	LogoutOutlined,
	NotificationOutlined,
	SettingFilled,
} from "@ant-design/icons";
import axios from "axios";
import { setAuthorizationToken } from "@/lib/axiosPrivate";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/accountContext";

const SettingsButton = () => {
	const [visible, setVisible] = useState(false);

	const router = useRouter();

	const handleSettingsClick = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const handleProfileFormSubmit = (values) => {
		// Handle form submission for profile settings
		console.log("Profile Settings:", values);
	};

	const handleLogout = async () => {
		try {
			await axios.delete("/api/auth/logout");
			setVisible(false);
			setAuthorizationToken();
			router.push("/login");
		} catch (e) {
			console.error(e);
			message.error("Logout failed!");
		}
	};

	const onFinish = (values) => {};

	const items = [
		{
			key: "viewProfile",
			href: "#viewProfile",
			title: "Profile",
			// label: "Profile",
		},
		{
			key: "viewNotifications",
			href: "#viewNotifications",
			title: "Notifications",
			// label: "Notifications",
		},
		{
			key: "editProfile",
			href: "#editProfile",
			title: "Edit Profile",
			// label: "Edit Profile",
		},
	];

	const { user } = useAccount();

	console.log(user);

	const descriptionItems = [
		{
			key: "6",
			label: "Id",
			children: user?.id,
		},
		{
			key: "1",
			label: "UserName",
			children: user?.name,
		},
		{
			key: "5",
			label: "Designation",
			children: user?.designation || "Empty",
		},
		{
			key: "2",
			label: "Telephone",
			children: user?.phone || "Empty",
		},
		{
			key: "4",
			label: "Address",
			span: 2,
			children: user?.address,
		},
	];

	return (
		<>
			{user?.profilePicture ? (
				<Button
					type="primary"
					shape="circle"
					icon={
						<img
							src={profilePicture}
							alt="Profile"
							className="profile-picture"
						/>
					}
					onClick={handleSettingsClick}
				/>
			) : (
				<SettingFilled
					style={{ fontSize: "25px" }}
					onClick={handleSettingsClick}
				/>
			)}

			<Modal
				title="Settings"
				open={visible}
				onCancel={handleCancel}
				footer={null}
				centered
				
			>
				<Row
					gutter={16}
					style={{ maxHeight: "400px", overflowY: "auto" }}
				>
					<Col span={6}>
						<Anchor
							affix={false}
							items={items}
							
							replace={true}
						/>
						{/* <Menu items={items} /> */}
					</Col>
					<Col
						span={18}
						style={{ maxHeight: "400px", overflowY: "auto" }}
						className="scrollbar-none"
					>
						<Descriptions
							id="viewProfile"
							title="User Profile"
							// bordered
							layout="vertical"
							items={descriptionItems}
							column={2}
						/>

						<Form
							id="editProfile"
							layout="vertical"
							onFinish={onFinish}
						>
							<Form.Item
								label="Name"
								name="name"
								initialValue="John Doe"
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Email"
								name="email"
								initialValue="johndoe@example.com"
							>
								<Input />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Save Profile
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>

				<div style={{ marginTop: 20 }}>
					<Button
						type="danger"
						icon={<LogoutOutlined />}
						onClick={handleLogout}
					>
						Logout
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default SettingsButton;
