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

const { Link } = Anchor;

const SettingsButton = ({ profilePicture }) => {
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

	return (
		<>
			{profilePicture ? (
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
			>
				<Row gutter={16}>
					<Col span={8}>
						<Anchor affix={false} style={{ height: "100%" }}>
							<Link href="#viewProfile" title="View Profile" />
							<Link href="#editProfile" title="Edit Profile" />
							<Link
								href="#profileSettings"
								title="Profile Settings"
							/>
						</Anchor>
					</Col>
					<Col span={16}></Col>
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
