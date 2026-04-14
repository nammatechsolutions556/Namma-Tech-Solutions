import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="logo">Namma Tech</h2>

            <nav className="menu">
                <NavLink to="/dashboard" className="menu-item">
                    Dashboard
                </NavLink>

                <NavLink to="/projects" className="menu-item">
                    Manage Projects
                </NavLink>

                <NavLink to="/portfolio" className="menu-item">
                    Manage Portfolio
                </NavLink>

                <NavLink to="/internships" className="menu-item">
                    Manage Internships
                </NavLink>

                <NavLink to="/requests" className="menu-item">
                    Project Requests
                </NavLink>

                <NavLink to="/applications" className="menu-item">
                    Internship Applications
                </NavLink>

                <NavLink to="/certificates" className="menu-item">
                    Certificates
                </NavLink>

                <NavLink to="/enquiries" className="menu-item">
                    Client Enquiry
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;