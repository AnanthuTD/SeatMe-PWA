import axios from "axios";

import { memoizedRefreshToken } from "./refreshToken";

/* axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
); */

export function setAuthorizationToken(accessToken) {
	if (accessToken) {
		axios.defaults.headers.common[
			"Authorization"
		] = `Bearer ${accessToken}`;
	} else {
		delete axios.defaults.headers.common["Authorization"];
	}
}

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error?.config;

		if (error?.response?.status === 401 && !config?.sent) {
			config.sent = true;

			const accessToken = await memoizedRefreshToken();

			if (accessToken) {
				config.headers = {
					...config.headers,
					authorization: `Bearer ${result?.accessToken}`,
				};
			}

			return axios(config);
		}
		return Promise.reject(error);
	},
);

export default axios;
