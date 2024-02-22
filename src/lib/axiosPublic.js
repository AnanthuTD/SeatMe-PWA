import axios from "axios";

const axiosInstance = axios.create({
	headers: {
		// "Content-Type": "application/json",
	},
});

/* export function setAuthorizationToken(token) {
	if (token) {
		axiosInstance.defaults.headers.common[
			"Authorization"
		] = `Bearer ${token}`;
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
	}
}

let requestQueue = [];

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (
			error.response.status === 401 &&
			error.response.url !== "api/auth/refresh-token"
		) {
			// Check if a token refresh is already in progress
			if (!isRefreshing) {
				isRefreshing = true;

				try {
					// Request a new access token using the refresh token
					// console.log("Attempting to refresh token...");
					const refreshTokenResponse = await axiosInstance.post(
						"api/auth/refresh-token",
					);

					// Extract the new access token
					const newAccessToken =
						refreshTokenResponse.data.accessToken;

					// console.log("new access token: ", newAccessToken);

					setAuthorizationToken(newAccessToken);

					// Retry the original request with the new access token
					error.config.headers.Authorization = `Bearer ${newAccessToken}`;

					isRefreshing = false;

					// Resolve the stored promises with the new response
					requestQueue.forEach((requestData) => {
						const { resolver, rejecter, config } = requestData;

						axiosInstance(config)
							.then((response) => resolver(response))
							.catch((error) => rejecter(error));
					});

					// Clear the requestQueue
					requestQueue = [];
				} catch (refreshError) {
					// console.log("Refresh error:", refreshError);

					if (
						refreshError.response &&
						refreshError.response.status === 401
					) {
						window.location.href = "/login";
					}

					// Reject the stored promises with the refresh error
					requestQueue.forEach((requestData) => {
						const { rejecter } = requestData;
						rejecter(refreshError);
					});

					// Clear the requestQueue
					requestQueue = [];
				} finally {
					isRefreshing = false;
				}
			} else {
				alert("Refresh error");
				// Store the original request and resolver/rejecter
				requestQueue.push({
					config: error.config,
					resolver: (response) => resolve(response),
					rejecter: (error) => reject(error),
				});
			}
		}

		// return Promise.reject(error);
	},
);
 */
export default axiosInstance;
