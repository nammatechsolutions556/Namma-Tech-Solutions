import axios from "axios";

// Determine the base URL depending on the environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api" || "https://namma-tech-solutions.onrender.com/api";

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL
});

// Request Interceptor to automatically attach token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors (like unauthorized / token expiry)
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Logging out...");
            // Clean up session securely
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminAuth");
            localStorage.removeItem("adminProfile");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
