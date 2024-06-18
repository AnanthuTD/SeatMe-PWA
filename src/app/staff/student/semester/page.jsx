"use client";
import React, { useState } from "react";
import { Button, Form, Divider, message, Radio, DatePicker } from "antd";
import DepProSemCouSelect from "../../components/depProSemCouSelect";
import axios from "@/lib/axiosPrivate";
import dayjs from "dayjs";

const PromoteDemotePassout = () => {
	const [program, setProgram] = useState("");
	const [level, setLevel] = useState("none");
	const [year, setYear] = useState("");

	const handlePromote = async () => {
		try {
			await axios.patch("/api/staff/student/promote", {
				year,
				program,
				level,
			});
			message.success("Promotion successful");
		} catch (error) {
			console.error("Error promoting:", error);
			message.error(error.response?.data?.error || "Failed to promote");
		}
	};

	const handleDemote = async () => {
		try {
			await axios.patch("/api/staff/student/demote", {
				year,
				program,
				level,
			});
			message.success("Demotion successful");
		} catch (error) {
			console.error("Error demoting:", error);
			message.error(error.response?.data?.error || "Failed to demote");
		}
	};

	const handlePassout = async () => {
		try {
			await axios.patch("/api/staff/student/passout", {
				year,
				program,
				level,
			});
			message.success("Passout successful");
		} catch (error) {
			console.error("Error passing out:", error);
			message.error(error.response?.data?.error || "Failed to pass out");
		}
	};

	const handleLevelChange = (value) => {
		setLevel(value);
		if (["20", "30"].includes(value)) {
			setProgram(value);
		} else {
			setProgram("");
		}
	};

	const handleYearChange = (date, dateString) => {
		setYear(dateString);
	};

	const isButtonEnabled = (program && year) || (year && level !== "none");

	return (
		<Form layout="vertical">
			<Form.Item label="Year of Admission">
				<DatePicker
					picker="year"
					value={year ? dayjs(year, "YYYY") : null}
					onChange={handleYearChange}
				/>
			</Form.Item>

			<Divider style={{ borderColor: "yellow" }}>
				Select any one option from below.
			</Divider>

			<DepProSemCouSelect
				courseField={false}
				semesterField={false}
				value={({ program }) => {
					setProgram(program);
					setLevel("none");
				}}
			/>

			<Divider style={{ color: "red", borderColor: "red" }}>OR</Divider>

			<Form.Item label="Education Level">
				<Radio.Group
					onChange={(e) => handleLevelChange(e.target.value)}
					value={level}
				>
					<Radio value="none">None</Radio>
					<Radio value="ug">UG (without B VOC)</Radio>
					<Radio value="pg">PG</Radio>
					<Radio value="bvoc">B Voc (abbreviation: bvoc)</Radio>
					<Radio value="20">Integrated MA HRM (id: 20)</Radio>
					<Radio value="30">Integrated Chemistry (id: 30)</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item>
				<Button
					type="primary"
					onClick={handlePromote}
					disabled={!isButtonEnabled}
					className="mr-2"
				>
					Promote by 1
				</Button>
				<Button
					type="primary"
					onClick={handleDemote}
					disabled={!isButtonEnabled}
					className="mr-2"
				>
					Demote by 1
				</Button>
				<Button
					type="primary"
					onClick={handlePassout}
					disabled={!isButtonEnabled}
				>
					Pass Out
				</Button>
			</Form.Item>
		</Form>
	);
};

export default PromoteDemotePassout;
