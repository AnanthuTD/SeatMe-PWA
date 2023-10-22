"use client";
"use strict";


import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { Button } from "antd";
import Absentstds from "./absentstds";
import Link from "next/link";
import axios from "@/axiosInstance";



import Stdlist from "./stdlist";

function page() {
/*	let std = [
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
	];  */
	const [isAbsent, setIsAbsent] = useState(false);
	const [data, setData] = useState([]);
    const  [conform, setConform] = useState(false);

    const roomid = "4";
	useEffect(() => {
		axios.get(`/api/staff/attendance/${roomid}`)
		.then((response) => {
		  let std = response.data;
		  console.log(std);
		  setData(std);

		})
		.catch((error) => {
		  if (error.response) {
			console.error("Server responded with status code:", error.response.status);
			console.error("Server response data:", error.response.data);
		  } else {
			console.error("Request failed:", error.message);
		  }
		});



	},
	
	
	[])
	
	
	  




	
	
    const confirmpage = () => {	
		setConform(!conform);	
	}

	

	return (
		<>
			<Navbar />
			{ conform ? 
			<>
			   <h1 className="text-center text-2xl text-gray-700  mt-5 "   >Check and click <span className="text-blue-500"  >finish</span></h1>
              <Absentstds  data={data}   />
			  <div className="flex flex-row justify-between m-4"  >
                <button  onClick={() => confirmpage()}    >  back</button>
                <button> Finish   </button>
			  </div>



			</>
			:
			<>
			
			<Stdlist   data={data} setData={setData}      /> 
			<button
								className=" ml-36 mt-5 mb-4  px-4 py-3 bg-blue-600  rounded-3xl border-4 "
								onClick={() => confirmpage()}
							>
								<p  className="text-lg  text-white  "     >    Submit</p>
							</button>
			</>

		
		}
			
			
		</>
	);
}

export default page;
