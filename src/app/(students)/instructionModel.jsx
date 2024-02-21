import React from 'react'
import Instruction from './instruction'
import { Modal } from 'antd'

function InstructionModel({ onClose = () => { }, showInstruction }) {
  return (
    <Modal
      open={showInstruction}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Instruction />
    </Modal>
  )
}

export default InstructionModel