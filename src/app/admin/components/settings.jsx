import React, { useState } from "react";
import { Button, Modal, Menu, Dropdown, Switch } from "antd";
import {UserOutlined, RightOutlined, } from "@ant-design/icons";

const SettingsButton = ({ profilePicture }) => {
	const [visible, setVisible] = useState(false);

	const handleSettingsClick = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const profileMenu = (
		<Menu>
			<Menu.Item key="viewProfile">View Profile</Menu.Item>
			<Menu.Item key="editProfile">Edit Profile</Menu.Item>
		</Menu>
	);

	return (
		<div style={{ position: "fixed", bottom: 20, right: 20 }}>
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
				<Button
					type="primary"
					shape="circle"
					icon={<UserOutlined />}
					onClick={handleSettingsClick}
				>
					Profile
				</Button>
			)}

			<Modal
				title="Settings"
				open={visible}
				onCancel={handleCancel}
				footer={null}
			>
				<Menu>
					<Menu.Item key="profile" className="profile-menu">
						Profile
						<Dropdown menu={profileMenu}>
							<a
								className="ant-dropdown-link"
								onClick={(e) => e.preventDefault()}
							>
								<RightOutlined />
							</a>
						</Dropdown>
					</Menu.Item>
					<Menu.Item key="darkMode">
						Dark Mode
						<Switch />
					</Menu.Item>
					{/* <Menu.Item key="language">
						Language
						<Dropdown overlay={languageMenu}>
							<a
								className="ant-dropdown-link"
								onClick={(e) => e.preventDefault()}
							>
								English <DownOutlined />
							</a>
						</Dropdown>
					</Menu.Item> */}
					<Menu.Item key="notifications">
						Notifications
						<Switch />
					</Menu.Item>
				</Menu>
			</Modal>
		</div>
	);
};

export default SettingsButton;
