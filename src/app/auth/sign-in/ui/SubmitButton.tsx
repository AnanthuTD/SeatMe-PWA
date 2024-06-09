"use client";
import React from "react";
import { Button } from "antd";

function SubmitButton({
	value,
	loading = false,
}: {
	Icon?: React.ReactNode;
	value: string;
	loading?: boolean;
}) {
	return (
		<Button
			className="w-full "
			htmlType="submit"
			style={{ padding: "1.25rem", fontWeight: "500" }}
			loading={loading}
			type="primary"
		>
			{value.toString()}
		</Button>
	);
}

export default SubmitButton;
