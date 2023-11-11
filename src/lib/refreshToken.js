import mem from "mem";

import axios from "./axiosPublic";
import { setAuthorizationToken } from "./axiosPrivate";

const refreshTokenFn = async () => {
	try {
		const response = await axios.post("/api/auth/refresh");

		const { accessToken } = response.data;

		if (!accessToken) {
			setAuthorizationToken();
			localStorage.removeItem("user");
		}

		setAuthorizationToken(accessToken);

		return accessToken;
	} catch (error) {
		console.error('refreshToken', error);
		localStorage.removeItem("user");
		setAuthorizationToken();
	}
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
	maxAge,
});
