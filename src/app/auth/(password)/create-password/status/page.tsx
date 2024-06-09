import { Alert, Button } from "antd";
import Image from "next/image";
import Link from "next/link";

const Notification = ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const { email, error } = searchParams;

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
				<div className="flex justify-center mb-6">
					<Image
						src="/seatme.svg"
						alt="SeatMe Logo"
						width={50}
						height={50}
					/>
				</div>
				{error ? (
					<>
						<h1 className="text-2xl font-bold mb-6">Email Sent</h1>
						<Alert
							className="mb-6"
							type="error"
							message={
								<>
									<span>
										We are unable to sent an email to{" "}
										<strong>{email}</strong> with instructions to
										create your password.
									</span>
									<p style={{ color: "red" }}>Error: {error}</p>
								</>
							}
						/>
						<Link href={"/auth/sign-in"}>
							<Button type="primary" danger>
								Back to Sign-in
							</Button>
						</Link>
					</>
				) : (
					<>
						<h1 className="text-2xl font-bold mb-6">Email Sent</h1>
						<Alert
							className="mb-6"
							type="success"
							message={
								<>
									We have sent an email to <strong>{email}</strong>{" "}
									with instructions to create your password.
								</>
							}
						/>
						<p className="mb-6">
							Please check your inbox and follow the link provided in the
							email.
						</p>
						<Link href={"/auth/sign-in"}>
							<Button type="primary">Back to Sign-in</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Notification;
