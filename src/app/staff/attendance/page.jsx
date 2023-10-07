"use client";

import React, { useState } from "react";
import Navbar from "../navbar";

import Stdlist from "./stdlist";

function page() {
	let std = [
		{
			id: 1,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 2,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 3,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 4,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 5,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 6,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 7,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 8,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 9,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
		{
			id: 10,
			name: "Muhammed",
			program: "Bca",
			row: 1,
			column: 6,
			isPresent: true,
		},
	];
	const [isAbsent, setIsAbsent] = useState(false);
	const [data, setData] = useState(std);
    const [conform, setConform] = useState(false);
	
    const confirmpage = () => {
		setConform[true];
		console.log('hioeiufhedf');
	}



	return (
		<>
			<Navbar />
			{ conform ? 
			<div>hiii</div>
			:
			<>
			
			<Stdlist   data={data} setData={setData}      /> 
			<button   onclick={ confirmpage }  className="p-5 bg-yellow-500"     >Submit</button> 
			</>

		
		}
			
			
		</>
	);
}

export default page;
