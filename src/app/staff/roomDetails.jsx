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

export default function BasicTable({ examdetails }) {
	const rows = [
		createData("Room Number", examdetails[0].roomId),
		createData("Building", examdetails[0].room.block.name),
		createData("Floor Number", examdetails[0].room.floor),
	];

	return (
		<TableContainer component={Paper} className="mt-10">
			<Table sx={{ minWidth: 400 }} aria-label="simple table">
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
