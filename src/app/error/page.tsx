import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/router";

enum Error {
	Configuration = "Configuration",
	AccessDenied = "AccessDenied",
	Verification = "Verification",
	Default = "Default",
}

const errorMessages = {
	[Error.Configuration]:
		"There is a problem with the server configuration. Check if your options are correct.",
	[Error.AccessDenied]: "Access denied. Please contact support.",
	[Error.Verification]:
		"Verification error. The token has expired or has already been used.",
	[Error.Default]: "An unknown error occurred. Please contact support.",
};

interface Props {
	error: Error;
}

const AuthErrorPage = ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | undefined };
}) => {
	console.log(searchParams);
	const { error } = searchParams;

	return (
		<div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50">
			<Result
				status="error"
				title="Authentication Error"
				subTitle={errorMessages[error] || errorMessages[Error.Default]}
				extra={[
					<Button type="primary" href="/" key="home">
						Go Home
					</Button>,
					<Button type="primary" href="/sign-in" key="home">
						Sign-In
					</Button>,
				]}
			/>
		</div>
	);
};

export default AuthErrorPage;
