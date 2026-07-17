import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState("projects");
    const [user, setUser] = useState(null);

    const [projects, setProjects] = useState([]);
    const [internships, setInternships] = useState([]);
    const [certificates, setCertificates] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("nts_user");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchUserData(parsedUser.email);
    }, [navigate]);

    const { url } = useContext(StoreContext);

    const fetchUserData = async (email) => {
        try {
            // Fetch data specific to the logged-in client via dedicated endpoints
            const [projRes, intRes, certRes] = await Promise.all([
                axios.get(`${url}/api/requests/client?email=${email}`),
                axios.get(`${url}/api/applications/client?email=${email}`),
                axios.get(`${url}/api/certificates/client?email=${email}`)
            ]);

            setProjects(projRes.data);
            setInternships(intRes.data);
            setCertificates(certRes.data);

        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    const groupedCertificates = useMemo(() => {
        const groups = {};
        certificates.forEach(c => {
            // Normalize title by removing the (Project: ...) suffix if present
            const baseTitle = c.title.split(" (Project:")[0];
            const key = `${baseTitle}-${c.project_title || 'General'}`;
            if (!groups[key]) {
                groups[key] = {
                    title: baseTitle,
                    project_title: c.project_title,
                    internshipCert: null,
                    projectCert: null
                };
            }
            if (c.cert_type === "Internship") {
                groups[key].internshipCert = c.certificateUrl;
            } else if (c.cert_type === "Project") {
                groups[key].projectCert = c.certificateUrl;
            }
        });
        return Object.values(groups);
    }, [certificates]);

    const getStatusClass = (status) => {
        if (!status) return "status-pending";
        if (status.toLowerCase() === "approved" || status.toLowerCase() === "completed") return "status-approved";
        if (status.toLowerCase() === "rejected") return "status-rejected";
        return "status-pending";
    };

    if (!user) return null;

    return (
        <div className="client-dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                {/* <button
                    className={`sidebar-btn ${activeTab === "projects" ? "active" : ""}`}
                    onClick={() => setActiveTab("projects")}
                >
                    My Projects
                </button> */}
                <button
                    className={`sidebar-btn ${activeTab === "internships" ? "active" : ""}`}
                    onClick={() => setActiveTab("internships")}
                >
                    My Internships
                </button>
                {/* <button
                    className={`sidebar-btn ${activeTab === "certificates" ? "active" : ""}`}
                    onClick={() => setActiveTab("certificates")}
                >
                    My Certificates
                </button> */}
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {activeTab === "projects" && (
                    <section>
                        <h2>My Project Requests</h2>
                        {projects.length === 0 ? (
                            <p>You have not requested any projects yet.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Requirements</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((p, idx) => (
                                        <tr key={idx}>
                                            <td>{p.project}</td>
                                            <td>{p.requirements}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(p.status)}`}>
                                                    {p.status || "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {activeTab === "internships" && (
                    <section>
                        <h2>My Internship Applications</h2>
                        {internships.length === 0 ? (
                            <p>You have not applied for any internships yet.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Domain</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {internships.map((i, idx) => (
                                        <tr key={idx}>
                                            <td>{i.internship || i.domain}</td>
                                            <td>{i.duration}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(i.status)}`}>
                                                    {i.status || "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {activeTab === "certificates" && (
                    <section>
                        <h2>My Certificates</h2>
                        {certificates.length === 0 ? (
                            <p>You have no issued certificates yet. Check back once your program is completed!</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Program / Internship</th>
                                        <th>Project Title</th>
                                        <th>Internship Certificate</th>
                                        <th>Project Certificate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedCertificates.map((g, idx) => (
                                        <tr key={idx}>
                                            <td>{g.title}</td>
                                            <td>{g.project_title || "N/A"}</td>
                                            <td>
                                                {g.internshipCert ? (
                                                    <a href={`${url}${g.internshipCert}`} target="_blank" rel="noreferrer" className="download-btn" download={`${g.title.replace(/\s+/g, '_')}_Internship_Certificate.pdf`}>
                                                        Download Internship
                                                    </a>
                                                ) : (
                                                    <span className="not-available">N/A</span>
                                                )}
                                            </td>
                                            <td>
                                                {g.projectCert ? (
                                                    <a href={`${url}${g.projectCert}`} target="_blank" rel="noreferrer" className="download-btn" download={`${g.title.replace(/\s+/g, '_')}_Project_Certificate.pdf`}>
                                                        Download Project
                                                    </a>
                                                ) : (
                                                    <span className="not-available">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default ClientDashboard;
