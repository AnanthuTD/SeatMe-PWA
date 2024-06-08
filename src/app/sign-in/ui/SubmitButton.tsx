import React from "react";
import { Button } from "antd";
import { useFormStatus } from "react-dom";

function SubmitButton({
	Icon = null,
	value,
}: {
	Icon?: React.ReactNode;
	value: string;
}) {
	const { pending } = useFormStatus();
	return (
		<Button
			className="w-full "
			htmlType="submit"
			style={{ padding: "1.25rem", fontWeight: "500" }}
			icon={Icon}
			loading={pending}
			type="primary"
		>
			{value.toString()}
		</Button>
	);
}

export default SubmitButton;
