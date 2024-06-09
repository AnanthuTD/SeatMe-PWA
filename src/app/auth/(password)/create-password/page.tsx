import Image from "next/image";
import { validateToken } from "../../actions/createPassword";
import CreatePassword from "./CreatePassword";

const Page = async ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | undefined };
}) => {
	const { token } = searchParams;

	try {
		const email = await validateToken(token);
		if (email) {
			return (
				<div className="flex items-center justify-center min-h-screen bg-gray-100">
					<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
						<div className="flex justify-center mb-6">
							<Image
								src="/seatme.svg"
								alt="SeatMe Logo"
								width={50}
								height={50}
							/>
						</div>
						<h1 className="text-2xl font-bold mb-6 text-center">
							Create Your Password
						</h1>
						<CreatePassword email={email} token={token} />
					</div>
				</div>
			);
		}
		throw new Error("Invalid token");
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			console.error("Token has expired:", error.message);
		} else if (error.name === "JsonWebTokenError") {
			console.error(
				"Token is malformed or signature verification failed:",
				error.message,
			);
		} else if (error.name === "validateTokenError") {
			console.error(error.massage);
		} else {
			console.error("Token verification failed:", error.message);
		}
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
					<div className="flex justify-center mb-6">
						<Image
							src="/seatme.svg"
							alt="SeatMe Logo"
							width={50}
							height={50}
						/>
					</div>
					<h1 className="text-2xl font-bold mb-6 text-center text-red">
						{error.name}
					</h1>
					<p className="text-center">{error.message}</p>
				</div>
			</div>
		);
	}
};

export default Page;
