import React from 'react'
import BanUnbanStudents from '../../ban/page'
import { Modal } from 'antd'

function BannedStudentsModal({ handleModalClose }) {

    return (
        <Modal
            open={true}
            onCancel={handleModalClose}
            footer={null}
            centered={true}
            title={null}
            width={1000}
        >
            <BanUnbanStudents />
        </Modal>
    )
}

export default BannedStudentsModal