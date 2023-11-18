"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories) {
	return { name, calories };
}

export default function BasicTable({ examDetails }) {
	const rows = [
		createData("Room Number", examDetails.roomId),
		createData("Building", examDetails.room.block.name),
		createData("Floor Number", examDetails.room.floor),
		createData("Attendance", examDetails.attendanceSubmitted ? "Submitted" : "Not submitted")
	];

	return (
		<TableContainer component={Paper} className="mt-10">
			<Table sx={{ minWidth: 350 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="center">
							<span className="text-lg  ml-10 font-bold text-blue-950 ">
								Exam Details
							</span>
						</TableCell>
						<TableCell align=""></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.name}
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
							}}
						>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="">{row.calories}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
