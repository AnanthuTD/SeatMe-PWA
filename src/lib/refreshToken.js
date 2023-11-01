import mem from "mem";

import axios from "./axiosPrivate";

const refreshTokenFn = async () => {
  try {
    const response = await axios.post("/api/auth/refresh");

    const { accessToken } = response.data;

    if (!accessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge,
});