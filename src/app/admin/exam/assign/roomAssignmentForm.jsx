"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import axios from "@/axiosInstance";

const { Option } = Select;

const RoomAssignmentForm = () => {
	const [form] = Form.useForm();
	const [selectedRoomIds, setSelectedRoomIds] = useState([]); // Keep track of selected room IDs
	const [totalSeats, setTotalSeats] = useState(0);
	const [rooms, setRooms] = useState([]);

	const loadRooms = async () => {
		const result = await axios.get("/api/admin/rooms");
		setRooms(result.data);
	};

	useEffect(() => {
		loadRooms();
	}, []);

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
		const newTotalSeats = selectedRooms.reduce((total, room) => {
			return total + room.seats;
		}, 0);
		setTotalSeats(newTotalSeats);
	};

	const filteredOptions = rooms.filter(
		(o) => !selectedRoomIds.includes(o.id),
	);

	useEffect(() => {
		calculateTotalSeats();
	}, [selectedRoomIds]);

	const onFinish = async () => {
		try {
			const response = await axios.patch("/api/admin/rooms", {
				roomIds: selectedRoomIds,
			});

			if (response.status === 200) {
				message.success("PATCH request was successful");
			} else {
				message.error(
					"PATCH request failed with status:",
					response.status,
				);
			}
		} catch (error) {
			console.error("Error while sending PATCH request:", error);
			message.error("Error while sending PATCH request");
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<Form
				form={form}
				name="exam-assignment"
				layout="vertical"
				onFinish={onFinish}
			>
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
								optionFilterProp="children"
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
								{filteredOptions.map((room) => (
									<Option key={room.id} value={room.id}>
										<div
											className="flex items-center justify-between"
											style={{ padding: "8px" }}
										>
											<div className="flex-1">
												<span className="text-md font-bold">
													{room.id} - Floor{" "}
													{room.floor}, Block{" "}
													{room.block}
												</span>
												<br />
											</div>
											<div className="text-blue-500">
												{room.seats} Seats
											</div>
										</div>
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={5} md={24}>
						<Form.Item label="Total Seats">
							<Input
								value={totalSeats}
								readOnly={true}
								size="large"
								style={{ fontWeight: "bold" }}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Assign Rooms
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default RoomAssignmentForm;
