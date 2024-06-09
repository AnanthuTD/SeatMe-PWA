import React from "react";
import { Divider } from "antd";
import Image from "next/image";
import MagicLinkForm from "./ui/MagicLinkForm";
import CredentialForm from "./ui/CredentialForm";
import GoogleButton from "./ui/GoogleButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Login = async () => {
	const session = await auth();
	if (session?.user) {
		const { role } = session.user;
		if (role === "admin" || role === "staff") return redirect("/staff");
		else if (role === "invigilator") return redirect("/invigilator");
	}
	return (
		<div className="flex justify-center items-center bg-gray-50 h-screen">
			<div className="w-5/12 bg-white border p-8 rounded-lg shadow border-gray-200 flex flex-col text-sm">
				<div className="flex items-center space-x-2 mb-6">
					<Image
						width={32}
						height={32}
						src="/seatme.svg"
						alt="SeatMe Logo"
					/>
					<span className="text-xl font-bold">SeatMe</span>
				</div>
				<h1 className="text-2xl font-bold mb-6">Welcome back</h1>

				<GoogleButton />

				<Divider>or</Divider>

				<MagicLinkForm />

				<Divider>or</Divider>

				<CredentialForm />
			</div>
		</div>
	);
};

export default Login;
