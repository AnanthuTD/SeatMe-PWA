"use client";
import React, { useState } from "react";
import { Button, Form, Input, Divider, message } from "antd";
import DepProSemCouSelect from "../../components/depProSemCouSelect";
import axios from "@/lib/axiosPrivate";

const PromoteDemotePassout = () => {
	const [program, setProgram] = useState("");
	const [semester, setSemester] = useState("");
	const [year, setYear] = useState("");

	const handlePromote = async () => {
		try {
			// Send PATCH request to promote endpoint
			await axios.patch("/api/staff/student/promote", {
				semester,
				year,
				program,
			});
			message.success("Promotion successful");
		} catch (error) {
			console.error("Error promoting:", error);
			message.error(error.response.data.error || "Failed to promote");
		}
	};

	const handleDemote = async () => {
		try {
			// Send PATCH request to demote endpoint
			await axios.patch("/api/staff/student/demote", {
				semester,
				year,
				program,
			});
			message.success("Demotion successful");
		} catch (error) {
			console.error("Error demoting:", error);
			message.error(error.response.data.error || "Failed to demote");
		}
	};

	const handlePassout = async () => {
		try {
			// Send PATCH request to passout endpoint
			await axios.patch("/api/staff/student/passout", {
				semester,
				year,
				program,
			});
			message.success("Passout successful");
		} catch (error) {
			console.error("Error passing out:", error);
			message.error(error.response.data.error || "Failed to pass out");
		}
	};

	const handleProgramChange = (value) => {
		setProgram(value);
		// Clear year if program is selected
		if (value) {
			setYear("");
		}
	};

	const handleSemChange = (value) => {
		setSemester(value);
		// Clear year if semester is selected
		if (value) {
			setYear("");
		}
	};

	const handleYearChange = (value) => {
		setYear(value);
		// Clear program and sem if year is selected
		if (value) {
			setProgram("");
			setSemester("");
		}
	};

	const isButtonDisabled = (!program || !semester) && !year;

	return (
		<Form layout="vertical">
			{/* Input fields for program and sem */}
			{/* <Form.Item label="Program">
                <Select value={program} onChange={handleProgramChange} disabled={year}>
                    <Option value="program1">Program 1</Option>
                    <Option value="program2">Program 2</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Semester">
                <Select value={semester} onChange={handleSemChange} disabled={year}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                </Select>
            </Form.Item> */}
			<DepProSemCouSelect
				courseField={false}
				value={({ program, semester }) => {
					setSemester(semester);
					setProgram(program);
				}}
			/>

			<Divider style={{ color: "red", borderColor: "red" }}>OR</Divider>

			{/* Option to select year of admission instead */}
			<Form.Item label="Year of Admission (Optional)">
				<Input
					value={year}
					onChange={(e) => handleYearChange(e.target.value)}
				/>
			</Form.Item>

			{/* Buttons for promote, demote, and pass out */}
			<Form.Item>
				<Button
					type="primary"
					onClick={handlePromote}
					disabled={isButtonDisabled}
					className="mr-2"
				>
					Promote by 1
				</Button>
				<Button
					type="primary"
					onClick={handleDemote}
					disabled={isButtonDisabled}
					className="mr-2"
				>
					Demote by 1
				</Button>
				<Button
					type="primary"
					onClick={handlePassout}
					disabled={isButtonDisabled}
				>
					Pass Out
				</Button>
			</Form.Item>
		</Form>
	);
};

export default PromoteDemotePassout;
