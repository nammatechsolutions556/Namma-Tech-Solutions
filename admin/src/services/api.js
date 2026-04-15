import axios from "axios";

// Determine the base URL depending on the environment
const getRawUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Dynamic fallback: use localhost only if we're actually on localhost
    if (window.location.hostname === "localhost") {
        return "http://localhost:5000/api";
    }
    // Production fallback
    return "https://namma-tech-solutions.onrender.com/api";
};

const rawUrl = getRawUrl();
// Ensure it ends with /api if not already present, then ensure a trailing slash
const API_URL = (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`).replace(/\/+$/, "") + "/";

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000 // 30 seconds
});

// Base URL for linking to static files (removes /api and trailing slash)
export const BASE_URL = (rawUrl.replace(/\/api$/, "").replace(/\/$/, ""));

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
            window.location.href = "/#/login";
        }
        return Promise.reject(error);
    }
);

export default api;
