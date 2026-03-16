import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./Topbar.css";
import adminProfile from "../../assets/founder.png";

const Topbar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">Admin Dashboard</h2>
      </div>

      <div className="topbar-right">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="topbar-user">
          <span className="admin-name">Ashok</span>
          <img
            src={adminProfile}
            alt="admin"
            className="admin-avatar"
          />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;