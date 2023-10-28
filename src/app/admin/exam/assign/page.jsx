"use client";

import React, { useState } from "react";
import RoomAssignmentForm from "./roomAssignmentForm";
import View from "./view";

function Page() {
	const [isSubmit, setIsSubmit] = useState(false);
	return (
		<div>
			{isSubmit ? (
				<View classes={isSubmit}/>
			) : (
				<RoomAssignmentForm setIsSubmit={setIsSubmit} />
			)}
		</div>
	);
}

export default Page;
