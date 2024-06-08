import { Button } from "antd";
import React from "react";
import GoogleIcon from "./GoogleIcon";
import { authenticate } from "../actions";

function GoogleButton() {
	const [googleSignInPending, setGoogleSignInPending] = React.useState(false);

	return (
		<Button
			className="w-full "
			style={{ padding: "1.25rem", fontWeight: "500" }}
			icon={<GoogleIcon />}
			onClick={async () => {
				setGoogleSignInPending(true);
				await authenticate(undefined, { provider: "google" });
				setGoogleSignInPending(false);
			}}
			loading={googleSignInPending}
		>
			Sign in with Google
		</Button>
	);
}

export default GoogleButton;
