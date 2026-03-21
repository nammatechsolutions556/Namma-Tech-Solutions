import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Navbar/Topbar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { isAuthenticated } = useAuth();

    // Protect Dashboard Routes: If not auth'd, boot to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="page-content">
                    {/* Render matching child route component here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
