"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axiosPrivate";

const YourComponent = () => {
	const [departments, setDepartments] = useState([]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/staff/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	useEffect(() => {
		// Load departments when the component mounts
		loadDepartments();
	}, []); // Empty dependency array ensures that this effect runs only once when the component mounts

	return (
		<div>
			<h1>Departments</h1>
			<ul>
				{departments.map((department) => (
					<li key={department.id}>{department.name}</li>
				))}
			</ul>
		</div>
	);
};

export default YourComponent;
