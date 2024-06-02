import { useAccount } from "@/context/accountContext";
import { setAuthorizationToken } from "@/lib/axiosPrivate";
import axios from "@/lib/axiosPublic";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GoogleSignInButton = () => {
	const { setUser } = useAccount();
	const router = useRouter();

	useEffect(() => {
		// Set the boolean flag to enable FedCM
		const initializeFedCM = async () => {
			document
				.getElementById("g_id_onload")
				.setAttribute("data-use_fedcm_for_prompt", "true");
		};
		initializeFedCM();

		// global function
		window.login = async (response) => {
			try {
				const { data } = await axios.post("api/auth/signin/", response);
				const { user, accessToken } = data;

				localStorage.setItem("user", JSON.stringify(user));

				setAuthorizationToken(accessToken);

				// console.log("user: ", response.data);

				setUser(user);

				if (user.role === "admin" || user.role === "staff") {
					router.push("/staff"); // Redirect to the admin page
				} else if (user.role === "invigilator") {
					router.push("/invigilator"); // Redirect to the staff page
				}
			} catch (error) {
				if (error.response) {
					if (error.response.status === 401) {
						message.error(
							"Unauthorized user. Please check your credentials.",
						);
					}
				} else {
					console.error("An error occurred:", error);
					message.error("An error occurred!");
				}
			}
		};
	}, []);

	return (
		<>
			<Script src="https://accounts.google.com/gsi/client" async />
			<div
				id="g_id_onload"
				data-client_id={process.env.CLIENT_ID}
				data-context="signin"
				data-callback="login"
				data-itp_support="true"
			></div>

			<div
				className="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="large"
				data-logo_alignment="left"
				data-width="400"
			></div>
		</>
	);
};

export default GoogleSignInButton;
