"use client";

import React, { useEffect, useState } from "react";
import { Select, message, Radio, Form } from "antd";
import axios from "@/lib/axiosPrivate";
import dayjs from "dayjs";
import DownloadButton from "./download";

import dynamic from "next/dynamic";

/* const Form = dynamic(() =>
	import("antd").then((module) => ({ default: module.Form })),
); */
const DatePicker = dynamic(() =>
	import("antd").then((module) => ({ default: module.DatePicker })),
);
const Row = dynamic(() =>
	import("antd").then((module) => ({ default: module.Row })),
);
const Col = dynamic(() =>
	import("antd").then((module) => ({ default: module.Col })),
);
const Statistic = dynamic(() =>
	import("antd").then((module) => ({ default: module.Statistic })),
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

const RoomAssignmentForm = ({
	setIsSuccess = () => {},
	setSelectedRooms = () => {},
}) => {
	const [selectedRoomIds, setSelectedRoomIds] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalSeats, setTotalSeats] = useState(0);
	const [examinesCount, setExaminesCount] = useState(0);
	const [rooms, setRooms] = useState([]);
	const [warningMessage, setWarningMessage] = useState("");
	const [fileName, setFileName] = useState("");
	const [date, setDate] = useState(new Date());

	const loadRooms = async () => {
		const result = await axios.get("/api/admin/rooms");
		setRooms(result.data);
	};

	useEffect(() => {
		loadRooms();
	}, []);

	const getExaminesCount = async () => {
		const result = await axios.get("/api/admin/examines-count", {
			params: {
				date,
			},
		});
		if (result.data === 0)
			message.warning("No exams scheduled at this date");
		setExaminesCount(result.data);
	};

	useEffect(() => {
		getExaminesCount();
		setFileName("");
	}, [date]);

	useEffect(() => {
		const selectedRoomIds = rooms
			.filter((room) => room.isAvailable)
			.map((room) => room.id);

		setSelectedRoomIds(selectedRoomIds);
	}, [rooms]);

	const calculateTotalSeats = () => {
		const selectedRooms = rooms.filter((room) =>
			selectedRoomIds.includes(room.id),
		);

		setSelectedRooms(selectedRooms);

		const newTotalSeats = selectedRooms.reduce((total, room) => {
			return total + room.seats;
		}, 0);
		setTotalSeats(newTotalSeats);
	};

	useEffect(() => {
		calculateTotalSeats();
		/* setFilteredOptions(
			rooms.filter((o) => !selectedRoomIds.includes(o.id)),
		); */
	}, [selectedRoomIds]);

	const filteredOptions = rooms.filter(
		(o) => !selectedRoomIds.includes(o.id),
	);

	const onFinish = async (values) => {
		try {
			const response = await axios.patch("/api/admin/rooms", {
				roomIds: selectedRoomIds,
			});

			if (response.status === 200) {
				message.success("Room availability updated successfully");
				assign(values);
			} else {
				message.error(
					"PATCH request failed with status:",
					response.status,
				);
			}
		} catch (error) {
			console.error("Error while sending PATCH request:", error);
			message.error("Error while sending PATCH request");
		} finally {
			setLoading(false);
		}
	};

	const assign = async (values) => {
		console.log(values);
		try {
			setLoading(true);
			const { orderBy, selectedDate, examType, optimize } = values;
			const result = await axios.get("/api/admin/exams/assign", {
				params: {
					orderBy,
					date: selectedDate,
					examType,
					optimize,
				},
			});
			if (result.status === 201) {
				{
					message.success("Assignments successfully");
					setWarningMessage("");
					setIsSuccess(true);
					setFileName(result.data.fileName);
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

	return (
		<div style={{ padding: "20px" }}>
			{filteredOptions.length > 0 ? (
				<>
					<Form
						name="exam-assignment"
						layout="vertical"
						onFinish={onFinish}
					>
						<Row gutter={16}>
							<Col sm={20}>
								<Form.Item
									name="selectedDate"
									initialValue={dayjs(date)}
									rules={[
										{
											required: true,
											message: "Please select a date",
										},
									]}
								>
									<DatePicker
										style={{ width: 200 }}
										format="YYYY-MM-DD"
										className="date-picker"
										onChange={(newDate) => {
											setDate(newDate.toDate()); // Update the date when it changes
										}}
									/>
								</Form.Item>
							</Col>
							<Col sm={4}>
								<Form.Item name="optimize" initialValue={true}>
									<Switch defaultChecked={true} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col lg={19} md={24}>
								<Form.Item
									label="Select Rooms"
									required={true}
									help="Please select at least one room"
								>
									<Select
										mode="multiple"
										showSearch
										filterOption={(input, option) =>
											(option?.label ?? "").includes(
												input,
											)
										}
										filterSort={(optionA, optionB) =>
											(optionA?.label ?? "")
												.toLowerCase()
												.localeCompare(
													(
														optionB?.label ?? ""
													).toLowerCase(),
												)
										}
										placeholder="Select rooms"
										size="large"
										onChange={setSelectedRoomIds}
										style={{ width: "100%" }}
										value={selectedRoomIds}
										onSelect={(value) => console.log(value)}
										allowClear={true}
										listItemHeight={10}
										listHeight={350}
									>
										{filteredOptions.length
											? filteredOptions.map((room) => {
													return (
														<Select.Option
															key={room.id}
															value={room.id}
															label={`r${room.id} f${room.floor} b${room.blockId}`}
														>
															<div
																className="flex items-center justify-between"
																style={{
																	padding:
																		"8px",
																}}
															>
																<div className="flex-1">
																	<span className="text-md font-bold">
																		{
																			room.id
																		}{" "}
																		- Floor{" "}
																		{
																			room.floor
																		}
																		, Block{" "}
																		{
																			room.blockId
																		}
																	</span>
																	<br />
																</div>
																<div className="text-blue-500">
																	{room.seats}{" "}
																	Seats
																</div>
															</div>
														</Select.Option>
													);
											  })
											: null}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={5} md={24}>
								<Form.Item>
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
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col sm={24}>
								<Form.Item
									name="orderBy"
									initialValue="rollNumber"
									label="Sort by"
									required={true}
								>
									<Select
										style={{ width: 200 }}
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
							<Col sm={24}>
								<Form.Item
									name="examType"
									label="Exam Type"
									required={true}
									initialValue={"Internal"}
								>
									<Radio.Group>
										<Radio value="Internal">Internal</Radio>
										<Radio value="Modal">Modal</Radio>
										<Radio value="Final">Final</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
							<Col sm={24}>
								<Form.Item>
									<Space>
										<Button
											type="primary"
											className="assign-button"
											htmlType="submit"
											loading={loading}
										>
											Assign
										</Button>
									</Space>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</>
			) : null}
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

			{fileName ? <DownloadButton fileName={fileName} /> : null}
		</div>
	);
};

export default RoomAssignmentForm;
