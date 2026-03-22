import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Check local storage for initial auth state
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem("adminAuth");
        return storedAuth === "true";
    });

    const [admin, setAdmin] = useState(() => {
        const storedAdmin = localStorage.getItem("adminProfile");
        return storedAdmin ? JSON.parse(storedAdmin) : null;
    });

    // Handle Login
    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/admin/login", { email, password });

            if (response.data && response.data.token) {
                const adminProfile = { name: "Admin", email: response.data.email };
                setIsAuthenticated(true);
                setAdmin(adminProfile);

                // Persist session
                localStorage.setItem("adminAuth", "true");
                localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
                localStorage.setItem("adminToken", response.data.token);

                return true;
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false;
        }
        return false;
    };

    // Handle Logout
    const logout = () => {
        setIsAuthenticated(false);
        setAdmin(null);
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminProfile");
        localStorage.removeItem("adminToken");
    };

    const value = {
        isAuthenticated,
        admin,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
