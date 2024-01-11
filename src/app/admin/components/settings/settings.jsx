import React, { useEffect, useState } from "react";
import {
	Button,
	Modal,
	Anchor,
	Form,
	Input,
	Row,
	Col,
	message,
	Descriptions,
	Divider,
} from "antd";
import {
	LogoutOutlined,
	SettingFilled,
} from "@ant-design/icons";
import axios from "axios";
import { setAuthorizationToken } from "@/lib/axiosPrivate";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/accountContext";
import ScheduleSeatingAvailabilityForm from "./seatingAvailableTimeConfig";
import Title from "antd/es/typography/Title";
import ViewSchedules from "./viewSchedules";

const SettingsButton = () => {
	const [visible, setVisible] = useState(false);
	const [descriptionItems, setDescriptionItems] = useState([]);
	const { user, setUser } = useAccount();
	const [updateSchedule, triggerUpdateSchedule] = useState(false)

	const router = useRouter();

	const handleSettingsClick = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const handleLogout = async () => {
		try {
			await axios.delete("/api/auth/logout");
			setVisible(false);
			setAuthorizationToken();
			localStorage.removeItem("user");
			router.push("/login");
		} catch (e) {
			console.error(e);
			message.error("Logout failed!");
		}
	};

	const onFinish = async (values) => {
		try {
			const response = await axios.patch('/api/admin/profile', values);
			const { user } = response.data;
			setUser(user);
			message.success('Profile updated successfully')
		} catch (error) {
			message.error('Profile update failed');
		}

	};

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
		{
			key: "seatingAvailableTimeConfig",
			href: "#seatingAvailableTimeConfig",
			title: "Schedule Seating Availability",
		},
	];

	useEffect(() => {
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
			{
				key: "5",
				label: "Phone",
				children: user?.phone || "Empty",
			},
		];
		setDescriptionItems(descriptionItems)
	}, [user])

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
				width={1000}
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
					</Col>
					<Col
						span={18}
						style={{ maxHeight: "400px", overflowY: "auto" }}
						className="scrollbar-none"
					>
						<Title level={4}>User Profile</Title>
						<Descriptions
							id="viewProfile"
							// title="User Profile"
							// bordered
							layout="vertical"
							items={descriptionItems}
							column={2}
						/>

						<Title level={4}>Edit Profile</Title>

						<Form
							id="editProfile"
							layout="vertical"
							onFinish={onFinish}
						>
							<Form.Item
								label="Name"
								name="name"
								initialValue={user?.name}
								required
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Email"
								name="email"
								initialValue={user?.email}
								required
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								required
								rules={[
									{
										validator: async (_, value) => {
											if (!value) {
												throw new Error('Please provide Password');
											}
										},
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								label="New Password"
								name="newPassword"
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								label="Phone"
								name="phone"
								initialValue={user?.phone}
							>
								<Input />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Save Profile
								</Button>
							</Form.Item>
						</Form>

						<Divider />

						<div id="seatingAvailableTimeConfig">
							<Title level={4}>Schedule Seating Availability</Title>
							<ScheduleSeatingAvailabilityForm triggerUpdateSchedule={triggerUpdateSchedule} updateSchedule={updateSchedule} />
							<ViewSchedules updateSchedule={updateSchedule} />
						</div>
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
