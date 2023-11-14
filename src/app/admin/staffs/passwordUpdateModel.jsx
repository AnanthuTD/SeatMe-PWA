import React, { useState } from "react";
import { Modal, Input } from 'antd';

const PasswordUpdateModal = ({ visible, onCancel, onOk }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleOk = () => {
        onOk(newPassword);
    };

    return (
        <Modal
            title="Update Password"
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Input
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
        </Modal>
    );
};

export default PasswordUpdateModal;
