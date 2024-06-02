"use client";
import React from "react";
import RoomAssignmentForm from "./roomAssignmentForm";
import { useAccount } from "@/context/accountContext";
import { useRouter } from "next/navigation";

function Page() {
	const { user } = useAccount();

	if (user.role !== "admin") {
		const router = useRouter();
		return router.push("/staff/forbidden");
	}

	return (
		<div>
			<RoomAssignmentForm />
		</div>
	);
}

export default Page;
