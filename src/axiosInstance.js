import axios from "axios";

const apiClient = axios.create({
	headers: {
		"ngrok-skip-browser-warning": "69420", // header for skipping warning page of ngrok
	},
});

export default apiClient;
