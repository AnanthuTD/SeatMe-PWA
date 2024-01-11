// Import necessary dependencies
import { Form, Button, TimePicker, Select, Row, Col } from 'antd';
import { useState } from 'react';
import axios from "@/lib/axiosPrivate"
import dayjs from 'dayjs'

// Constants for the day and time options
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeOptions = ['AN', 'FN'];

// Example component for the seating arrangement form
const ScheduleSeatingAvailabilityForm = ({ triggerUpdateSchedule, updateSchedule }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const formatTime = (dayjsTime) => {
        const selectedTime = dayjs(dayjsTime);
        return selectedTime.format("HH:mm");
    }

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);

            values.startTime = formatTime(values.startTime)
            values.endTime = formatTime(values.endTime)

            await axios.post('/api/admin/config/seating-availability-schedule', values)

            triggerUpdateSchedule(!updateSchedule)

            form.resetFields();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Day" name="day" rules={[{ required: true, message: 'Please select a day' }]}>
                        <Select placeholder="Select a day">
                            {days.map((day) => (
                                <Select.Option key={day} value={day}>
                                    {day}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[{ required: true, message: 'Please select a start time' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="End Time"
                        name="endTime"
                        rules={[{ required: true, message: 'Please select an end time' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Time Option"
                        name="timeCode"
                        rules={[{ required: true, message: 'Please select AM or FN' }]}
                    >
                        <Select placeholder="Select AN or FN">
                            {timeOptions.map((option) => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Save
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ScheduleSeatingAvailabilityForm;
