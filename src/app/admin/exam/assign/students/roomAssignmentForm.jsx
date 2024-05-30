"use client";

import React, { useEffect, useState } from "react";
import {
	Select,
	message,
	Radio,
	Form,
	Spin,
	Divider,
	Statistic,
	Input,
} from "antd";
import axios from "@/lib/axiosPrivate";
import dayjs from "dayjs";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Rooms from "./rooms";
import CustomDatePicker from "../../../components/datePicker";
import DownloadZipButton from "../../../components/downloadReport";
import ProgramCountsDisplay from "./ProgramCountsDisplay";
import SortableExam from "../sort";
import BannedStudentsModal from "./bannedStudentsModal";

const Row = dynamic(() =>
	import("antd").then((module) => ({ default: module.Row })),
);
const Modal = dynamic(() =>
	import("antd").then((module) => ({ default: module.Modal })),
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

const timeOptions = ["AN", "FN"];

const RoomAssignmentForm = () => {
	const [loading, setLoading] = useState(false);
	const [loadingRooms, setLoadingRooms] = useState(false);
	const [selectedRooms, setSelectedRooms] = useState([]);
	const [examineesByProgram, setExamineesByProgram] = useState([]);
	const [totalExaminees, setTotalExaminees] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);
	const [warningMessage, setWarningMessage] = useState("");
	const [fileName, setFileName] = useState("");
	const [examType, setExamType] = useState(null);
	const [examName, setExamName] = useState("");
	const [sortByField, setSortByField] = useState("id");
	const [date, setDate] = useState(null);
	const [timeCode, setTimeCode] = useState(null);
	const [visible, setVisible] = useState(false);
	const [triggerSortExam, setTriggerSortExam] = useState(false);
	const [examOrder, setExamOrder] = useState(undefined);
	const [bannedStudentsModal, setBannedStudents] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [form] = Form.useForm();

	function loadFromLocalStorage() {
		let storedDate = localStorage.getItem("selectedDate");
		const storedTimeCode = localStorage.getItem("timeCode");
		const storedExamType = localStorage.getItem("examType");
		const storedExamName = localStorage.getItem("examName");
		const storedSortByField = localStorage.getItem("sortByField");

		if (storedDate) {
			try {
				storedDate = dayjs(storedDate);
				setDate(storedDate);
				form.setFieldValue("selectedDate", dayjs(storedDate));
			} catch (e) {
				setDate(new dayjs());
			}
		} else {
			setDate(new Date());
			form.setFieldValue("selectedDate", dayjs(new Date()));
		}

		if (storedTimeCode) {
			setTimeCode(storedTimeCode);
			form.setFieldValue("timeCode", storedTimeCode);
		} else {
			setTimeCode("AN");
			form.setFieldValue("timeCode", "AN");
		}

		if (storedExamType) {
			setExamType(storedExamType);
			form.setFieldValue("examType", storedExamType);
		} else {
			setExamType("final");
			form.setFieldValue("examType", "final");
		}

		if (storedExamName) {
			setExamName(storedExamName);
			form.setFieldValue("examName", storedExamName);
		} else {
			setExamName("");
			form.setFieldValue("examName", "");
		}

		if (storedSortByField) {
			setSortByField(storedSortByField);
			form.setFieldValue("sortByField", storedSortByField);
		} else {
			setSortByField("id");
			form.setFieldValue("sortByField", "id");
		}
	}

	useEffect(() => {
		loadFromLocalStorage();
	}, []);

	useEffect(() => {
		loadFromLocalStorage();
	}, [pathname, searchParams]);

	useEffect(() => {
		if (date && typeof date.toISOString === "function") {
			localStorage.setItem("selectedDate", date.toISOString());
		}
		if (timeCode) {
			localStorage.setItem("timeCode", timeCode);
		}
		if (examType) {
			localStorage.setItem("examType", examType);
		}
		if (examName) {
			localStorage.setItem("examName", examName);
		}
		if (sortByField) {
			localStorage.setItem("sortByField", sortByField);
		}
	}, [date, timeCode, examType, examName, sortByField]);

	const handleExamTypeChange = (e) => {
		const examType = e.target.value;
		setExamType(examType);
	};

	const getExaminesCount = async () => {
		const response = await axios.get("/api/admin/examines-count", {
			params: {
				date,
				timeCode,
			},
		});
		const examineesByProgram = response.data;
		setExamineesByProgram(examineesByProgram);

		if (examineesByProgram.total === 0)
			message.warning("No exams scheduled at this date");

		const totalRegular = examineesByProgram.reduce(
			(sum, program) => sum + program.regular,
			0,
		);
		const totalSupply = examineesByProgram.reduce(
			(sum, program) => sum + program.supply,
			0,
		);
		const totalCombined = totalRegular + totalSupply;
		setTotalExaminees(totalCombined);
	};

	useEffect(() => {
		if (date) getExaminesCount();
		setFileName("");
	}, [date, timeCode]);

	const loadSelectedRooms = async (examType) => {
		setLoadingRooms(true);
		const result = await axios.get(`/api/admin/rooms/${examType}`, {
			params: { availability: true },
		});
		setSelectedRooms(result.data);
		setLoadingRooms(false);
	};

	useEffect(() => {
		if (examType) loadSelectedRooms(examType);
	}, [examType]);

	const assign = async () => {
		try {
			setLoading(true);
			const {
				orderBy,
				selectedDate,
				examType,
				optimize,
				timeCode,
				examName,
			} = form.getFieldsValue();
			const result = await axios.get("/api/admin/exams/assign", {
				params: {
					orderBy,
					date: selectedDate.format("YYYY-MM-DDTHH:mm:ssZ"),
					examType,
					optimize,
					timeCode,
					examName,
					examOrder,
				},
			});

			const { data } = result;

			if (data.error) {
				message.warning(data.error);
				setWarningMessage(data.error);
			} else message.success("Assignments successfully");

			const { fileName } = result.data;
			setFileName(fileName);
			setVisible(true);
		} catch (error) {
			if (error.response && error.response.status === 403) {
			} else if (error?.response?.data?.error) {
				message.error(error.response.data.error);
			} else {
				console.error(error);
				message.error("An error occurred while making the request.");
			}
		} finally {
			setLoading(false);
		}
	};

	const calculateTotalSeats = () => {
		const newTotalSeats = selectedRooms.reduce((total, room) => {
			return total + room.seats;
		}, 0);
		setTotalSeats(newTotalSeats);
	};

	useEffect(() => {
		if (selectedRooms.length) calculateTotalSeats();
	}, [selectedRooms]);

	const handleModalClose = () => {
		setVisible(false);
	};

	return (
		<div style={{ padding: "20px" }}>
			<>
				<Form
					name="exam-assignment"
					layout="vertical"
					onFinish={() => {
						setBannedStudents(true);
					}}
					form={form}
				>
					<Row gutter={16}>
						<Col sm={24} md={11} lg={8} xl={6}>
							<Form.Item
								label="Date"
								name="selectedDate"
								rules={[
									{
										required: true,
										message: "Please select a date",
									},
								]}
							>
								<CustomDatePicker
									value={date}
									onChange={setDate}
								/>
							</Form.Item>
						</Col>
						<Col sm={24} md={7} lg={4} xl={5}>
							<Form.Item
								label="Time Code"
								name="timeCode"
								rules={[
									{
										required: true,
										message: "Please select AN or FN",
									},
								]}
								initialValue={timeCode}
							>
								<Select
									placeholder="Select AN or FN"
									onSelect={setTimeCode}
								>
									{timeOptions.map((option) => (
										<Select.Option
											key={option}
											value={option}
										>
											{option}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col sm={24} md={12} lg={9} xl={8}>
							<Form.Item
								name="examType"
								label="Exam Type"
								rules={[
									{
										required: true,
										message: "Please select exam type",
									},
								]}
								initialValue={examType}
							>
								<Radio.Group onChange={handleExamTypeChange}>
									<Radio value="internal">Internal</Radio>
									<Radio value="modal">Modal</Radio>
									<Radio value="final">Final</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col sm={24} md={12} lg={3} xl={5}>
							<Form.Item
								label="Sort Exam"
								rules={[
									{
										required: true,
										message: "Please select exam type",
									},
								]}
								initialValue={examType}
							>
								<Button
									type="primary"
									onClick={() => setTriggerSortExam(true)}
								>
									Sort Exam
								</Button>
								{triggerSortExam ? (
									<Modal
										open={triggerSortExam}
										closable={true}
										onCancel={() =>
											setTriggerSortExam(false)
										}
										onOk={() => setTriggerSortExam(false)}
									>
										<SortableExam
											date={date}
											timeCode={timeCode}
											onSort={(exams) => {
												const examIds = exams.map(
													(exam) => exam.id,
												);
												// console.log(examIds);
												setExamOrder(examIds);
											}}
										/>
									</Modal>
								) : null}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col sm={24} lg={10} md={10} xl={10} xs={24}>
							<Form.Item
								name="orderBy"
								initialValue={sortByField}
								label="Sort by"
								rules={[
									{
										required: true,
										message:
											"Please select a sort by field",
									},
								]}
							>
								<Select
									className="select-box"
									onSelect={setSortByField}
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
						<Col sm={24} lg={14} md={14} xl={14} xs={24}>
							<Form.Item
								name="examName"
								label="Exam Name"
								initialValue={examName}
								rules={[
									{
										required: true,
										message: "Please enter name of exam",
										type: "string",
									},
								]}
							>
								<Input
									onChange={(e) =>
										setExamName(e.target.value)
									}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col>
							<Card bordered={false}>
								<Statistic
									title="Total Examinees"
									value={totalExaminees}
								/>
							</Card>
						</Col>
						<Col>
							<Card bordered={false}>
								{totalExaminees - totalSeats === 0 ? (
									<Statistic
										title="Correct number of seats"
										value="0"
									/>
								) : totalExaminees - totalSeats < 0 ? (
									<Statistic
										title="Extra seats"
										value={Math.abs(
											totalExaminees - totalSeats,
										)}
										valueStyle={{ color: "green" }}
									/>
								) : (
									<Statistic
										title="More seats needed"
										value={totalExaminees - totalSeats}
										valueStyle={{ color: "red" }}
									/>
								)}
							</Card>
						</Col>
						<Col
							sm={24}
							lg={10}
							md={10}
							xl={10}
							xs={24}
							className="flex items-center"
						>
							<Link
								href={`/admin/rooms/${examType}/${totalExaminees}`}
							>
								<Button type="primary">Select Rooms</Button>
							</Link>
						</Col>
					</Row>
					<Row gutter={[16, 16]}>
						<Col lg={16} xl={16}>
							{loadingRooms ? (
								<Spin />
							) : selectedRooms.length ? (
								<Rooms data={selectedRooms} />
							) : null}
						</Col>
						<Col lg={8} xl={8}>
							{examineesByProgram.length ? (
								<ProgramCountsDisplay
									data={examineesByProgram}
								/>
							) : null}
						</Col>
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
										disabled={totalExaminees > totalSeats}
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
					<Col span={22}>
						{fileName ? (
							<div className="flex items-center">
								<label className="">
									Download Seating Arrangement for Students:
								</label>
								<DownloadZipButton fileName={fileName} />
							</div>
						) : null}
					</Col>
					{/* Assign Teachers Section */}
					<Col span={24}>
						<Link
							href={`/admin/exam/assign/staffs?date=${date}&timeCode=${timeCode}`}
						>
							<Button type="primary">Assign Teachers</Button>
						</Link>
					</Col>
				</Row>
			</Modal>
			{bannedStudentsModal ? (
				<BannedStudentsModal
					handleModalClose={() => {
						assign();
						setBannedStudents(false);
					}}
				/>
			) : null}
		</div>
	);
};

export default RoomAssignmentForm;
