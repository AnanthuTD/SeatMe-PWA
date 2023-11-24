"use client";

import React, { useEffect, useState } from "react";
import { Select, message, Radio, Form, Spin, Divider, Statistic, Modal } from "antd";
import axios from "@/lib/axiosPrivate";
import dayjs from "dayjs";
import DownloadButton from "./download";
import dynamic from "next/dynamic";
import Link from "next/link";
import Rooms from "./rooms";
import CustomDatePicker from "../../components/datePicker";

const Row = dynamic(() =>
	import("antd").then((module) => ({ default: module.Row })),
);
const Col = dynamic(() =>
	import("antd").then((module) => ({ default: module.Col })),
);
const Button = dynamic(() =>
	import("antd").then((module) => ({ default: module.Button })),
);
const Card = dynamic(() =>
	import("antd").then((module) => ({ default: module.Card })),
);
const Space = dynamic(() =>
	import("antd").then((module) => ({ default: module.Space })),
);
const Alert = dynamic(() =>
	import("antd").then((module) => ({ default: module.Alert })),
);
const Switch = dynamic(() =>
	import("antd").then((module) => ({ default: module.Switch })),
);

const timeOptions = ['AN', 'FN'];

const RoomAssignmentForm = ({
	setAssignTeachers = () => { },
}) => {
	const [loading, setLoading] = useState(false);
	const [loadingRooms, setLoadingRooms] = useState(false);
	const [selectedRooms, setSelectedRooms] = useState([]);
	const [examinesCount, setExaminesCount] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);
	const [warningMessage, setWarningMessage] = useState("");
	const [fileName, setFileName] = useState("");
	const [examType, setExamType] = useState("internal");
	const [date, setDate] = useState(new Date());
	const [timeCode, setTimeCode] = useState('AN');
	const [visible, setVisible] = useState(false);

	const handleExamTypeChange = (e) => {
		const examType = e.target.value;
		setExamType(examType);
	};

	const getExaminesCount = async () => {
		const result = await axios.get("/api/admin/examines-count", {
			params: {
				date,
				timeCode
			},
		});
		if (result.data === 0)
			message.warning("No exams scheduled at this date");
		setExaminesCount(result.data);
	};

	useEffect(() => {
		getExaminesCount();
		setFileName("");
	}, [date, timeCode]);

	const loadSelectedRooms = async (examType) => {
		setLoadingRooms(true);
		const result = await axios.get(`/api/admin/rooms/${examType}`, { params: { availability: true } });
		setSelectedRooms(result.data);
		setLoadingRooms(false);
	};

	useEffect(() => {
		loadSelectedRooms(examType);
	}, []);

	const assign = async (values) => {
		console.log(values);
		try {
			setLoading(true);
			const { orderBy, selectedDate, examType, optimize, timeCode } = values;
			const result = await axios.get("/api/admin/exams/assign", {
				params: {
					orderBy,
					date: selectedDate,
					examType,
					optimize,
					timeCode
				},
			});
			if (result.status === 201) {
				{
					message.success("Assignments successfully");
					setWarningMessage("");
					setFileName(result.data.fileName);

					setDate(selectedDate);
					setVisible(true);
				}
			} else if (result.status === 200) {
				setWarningMessage(result.data.message);
				setIsSuccess(false);
			}
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			) {
				message.error(error.response.data.error);
			} else {
				message.error("An error occurred while making the request.");
			}
		} finally {
			setLoading(false);
		}
	};

	const disabledDate = (current) => {
		// Disable days before today
		return current && current <= dayjs().startOf('day');
	};

	const calculateTotalSeats = () => {
		const newTotalSeats = selectedRooms.reduce((total, room) => {
			return total + room.seats;
		}, 0);
		setTotalSeats(newTotalSeats);
	};

	useEffect(() => {
		if (selectedRooms.length) calculateTotalSeats();
	}, [selectedRooms])

	const handleModalClose = () => {
		setVisible(false);
	};

	return (
		<div style={{ padding: "20px" }}>

			<>
				<Form
					name="exam-assignment"
					layout="vertical"
					onFinish={assign}
				>
					<Row gutter={16}>
						<Col sm={24} md={12} lg={6} xl={5}>
							<Form.Item
								label="Date"
								name="selectedDate"
								initialValue={dayjs(date)}
								rules={[
									{
										required: true,
										message: "Please select a date",
									},
								]}
							>
								<CustomDatePicker defaultValue={date} onChange={(newDate) => {
									setDate(newDate.toDate())
								}} />
							</Form.Item>
						</Col>
						<Col sm={24} md={12} lg={6} xl={5}>
							<Form.Item
								label="Time Code"
								name="timeCode"
								rules={[{ required: true, message: 'Please select AN or FN' }]}
								initialValue={'AN'}
							>
								<Select placeholder="Select AN or FN" onSelect={setTimeCode}>
									{timeOptions.map((option) => (
										<Select.Option key={option} value={option}>
											{option}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col sm={24} md={18} lg={9} xl={10} /* className="justify-center items-center flex" */>
							<Form.Item
								name="examType"
								label="Exam Type"
								required={true}
								initialValue={"internal"}
							>
								<Radio.Group onChange={handleExamTypeChange}>
									<Radio value="internal">Internal</Radio>
									<Radio value="modal">Modal</Radio>
									<Radio value="final">Final</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col sm={24} md={6} lg={3} xl={2}>
							<Form.Item name="optimize" label="Optimize" initialValue={true}>
								<Switch defaultChecked={true
								} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col sm={24} lg={10} md={10} xl={10} xs={24}>
							<Form.Item
								name="orderBy"
								initialValue="rollNumber"
								label="Sort by"
								required={true}
							>
								<Select
									className="select-box"
								>
									<Select.Option value="rollNumber">
										Roll Number
									</Select.Option>
									<Select.Option value="id">
										Registration Number
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>

					</Row>
					<Row gutter={16}>
						<Col>
							<Card bordered={false}>
								<Statistic
									title="Total Examinees"
									value={examinesCount}
								/>
							</Card>
						</Col>
						<Col>
							<Card bordered={false}>
								{examinesCount - totalSeats === 0 ? (
									<Statistic
										title="Correct number of seats"
										value="0"
									/>
								) : examinesCount - totalSeats < 0 ? (
									<Statistic
										title="Extra seats"
										value={Math.abs(
											examinesCount - totalSeats,
										)}
										valueStyle={{ color: "green" }}
									/>
								) : (
									<Statistic
										title="More seats needed"
										value={
											examinesCount - totalSeats
										}
										valueStyle={{ color: "red" }}
									/>
								)}
							</Card>
						</Col>
						<Col sm={24} lg={10} md={10} xl={10} xs={24} className="flex items-center">
							{examinesCount ? <Link href={`/admin/rooms/${examType}/${examinesCount}`} ><Button type="primary">Select Rooms</Button></Link> : null}
						</Col>
					</Row>
					<Row>
						{loadingRooms
							? <Spin />
							: selectedRooms.length ? <Rooms data={selectedRooms} /> : null
						}
					</Row>
					<Divider />
					<Row>
						<Col sm={24}>
							<Form.Item>
								<Space>
									<Button
										type="primary"
										className="assign-button"
										htmlType="submit"
										loading={loading}
										disabled={examinesCount > totalSeats}
									>
										Assign
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</>

			{warningMessage ? (
				<Row>
					<Alert
						message={"Add more rooms"}
						description={warningMessage}
						type="warning"
						showIcon
					/>
				</Row>
			) : null}

			<Modal
				open={visible}
				onCancel={handleModalClose}
				footer={null}
				centered={true}
				className="custom-modal" // Add a custom class for styling the modal
			>
				<Row gutter={[16, 16]}>
					{/* Download Section */}
					<Col span={22} >
						<div className="flex items-center">
							<label className="">Download Seating Arrangement for Students:</label>
							<DownloadButton fileName={fileName} />
						</div>
					</Col>
					{/* Assign Teachers Section */}
					<Col span={24}>
						<Link href={`/admin/exam/assign/staffs?date=${date}&timeCode=${timeCode}`}>
							<Button type="primary">
								Assign Teachers
							</Button>
						</Link>
					</Col>
				</Row>
			</Modal>
		</div>
	);
};

export default RoomAssignmentForm;
