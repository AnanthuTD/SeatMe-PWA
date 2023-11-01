import axios from "axios";

let isRefreshing = false; // Flag to prevent simultaneous refresh requests

const axiosInstance = axios.create({
	headers: {
		"ngrok-skip-browser-warning": "69420",
	},
});

export function setAuthorizationToken(token) {
	if (token) {
	  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
	  delete axiosInstance.defaults.headers.common['Authorization'];
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
					console.log("Attempting to refresh token...");
					const refreshTokenResponse = await axiosInstance.post(
						"api/auth/refresh-token",
					);

					// Extract the new access token
					const newAccessToken =
						refreshTokenResponse.data.accessToken;

					console.log("new access token: ", newAccessToken);

					// Update the stored access token
					localStorageManager.setItem(newAccessToken);

					// Retry the original request with the new access token
					error.config.headers.Authorization = `Bearer ${newAccessToken}`;

					isRefreshing = false;

					requestQueue.forEach((config) => {
						config.headers.Authorization = newAccessToken;
						axiosInstance(config);
					});
					requestQueue = [];

					return axios(error.config);
				} catch (refreshError) {
					console.log("Refresh error:", refreshError);

					if (
						refreshError.response &&
						refreshError.response.status === 401
					) {
						// alert("redirecting");
						// The refresh token is not valid, navigate to the login page
						/* const router = useRouter();
						router.push("/login"); */
						window.location.href = "/login";
					}

					// Reject the request with the refresh error
					return Promise.reject(refreshError);
				} finally {
					console.log("hi");
					isRefreshing = false;
					requestQueue = [];
				}
			} else {
				// If a token refresh is in progress, add the request to the queue

				requestQueue.push(error.config);
			}
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
