import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        'Content-Type': "application/json"
    }
})

axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove("access_token");
            Cookies.remove("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("storage"));
                if (!window.location.pathname.startsWith('/auth/login')) {
                    window.location.href = "/auth/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;