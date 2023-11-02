import mem from "mem";

import axios, { setAuthorizationToken } from "./axiosPrivate";

const refreshTokenFn = async () => {
	try {
		const response = await axios.post("/api/auth/refresh");

		const { accessToken } = response.data;

		if (!accessToken) {
			setAuthorizationToken();
			// localStorage.removeItem("accessToken");
			localStorage.removeItem("user");
		}

		// localStorage.setItem("accessToken", accessToken);
		setAuthorizationToken(accessToken);

		return accessToken;
	} catch (error) {
		// localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		setAuthorizationToken();
	}
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
	maxAge,
});
