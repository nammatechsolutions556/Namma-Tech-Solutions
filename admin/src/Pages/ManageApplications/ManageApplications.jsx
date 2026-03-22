import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { exportToExcel } from "../../utils/exportToExcel";
import "./ManageApplications.css";

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchApplications = async () => {
        try {
            const res = await api.get("/applications");
            setApplications(res.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/applications/${id}`, { status });
            fetchApplications();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteApplication = async (id) => {
        try {
            await api.delete(`/applications/${id}`);
            fetchApplications();
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    const filteredApplications = applications.filter((a) => {
        const matchesSearch =
            (a.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.internship || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || a.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        const dataToExport = filteredApplications.map(a => ({
            Name: a.name,
            Email: a.email,
            Internship: a.internship,
            Status: a.status || "Pending",
        }));
        exportToExcel(dataToExport, "Internship_Applications");
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredApplications.map((a) => a._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to ${action} ${selectedIds.length} items?`)) return;
        try {
            if (action === 'delete') {
                await Promise.all(selectedIds.map(id => api.delete(`/applications/${id}`)));
            } else {
                const status = action === 'approve' ? 'Approved' : 'Rejected';
                await Promise.all(selectedIds.map(id => api.put(`/applications/${id}`, { status })));
            }
            fetchApplications();
            setSelectedIds([]);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            alert("Failed to perform bulk action");
        }
    };

    return (
        <div className="manage-applications-container">
            <h2>Internship Applications</h2>

            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Internship..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <button className="export-btn" onClick={handleExport}>
                    Export to Excel
                </button>
            </div>

            {selectedIds.length > 0 && (
                <div className="table-controls" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <span style={{ color: '#60a5fa', fontWeight: '500' }}>{selectedIds.length} selected</span>
                    <button className="approve-btn" onClick={() => handleBulkAction('approve')}>Approve Selected</button>
                    <button className="reject-btn" style={{ background: '#f59e0b' }} onClick={() => handleBulkAction('reject')}>Reject Selected</button>
                    <button className="delete-btn" onClick={() => handleBulkAction('delete')}>Delete Selected</button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Internship</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredApplications.map((a) => (
                        <tr key={a._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(a._id)}
                                    onChange={() => handleSelect(a._id)}
                                />
                            </td>
                            <td>{a.name}</td>
                            <td>{a.email}</td>
                            <td>{a.internship}</td>
                            <td>
                                {a.resume_url ? (
                                    <div className="resume-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${a.resume_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-btn"
                                            style={{
                                                padding: '4px 8px',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                color: '#60a5fa',
                                                borderRadius: '4px',
                                                textDecoration: 'none',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            View
                                        </a>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${a.resume_url}`}
                                            download
                                            className="download-btn"
                                            style={{
                                                padding: '4px 8px',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                color: '#34d399',
                                                borderRadius: '4px',
                                                textDecoration: 'none',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Download
                                        </a>
                                    </div>
                                ) : (
                                    <span style={{ color: '#64748b', fontStyle: 'italic' }}>No resume</span>
                                )}
                            </td>
                            <td>
                                <span className={`status-badge ${a.status ? a.status.toLowerCase() : 'pending'}`}>
                                    {a.status || "Pending"}
                                </span>
                            </td>

                            <td className="action-buttons">
                                <button className="approve-btn" onClick={() => updateStatus(a._id, "Approved")}>
                                    Approve
                                </button>

                                <button className="reject-btn" onClick={() => updateStatus(a._id, "Rejected")}>
                                    Reject
                                </button>

                                <button className="delete-btn" onClick={() => deleteApplication(a._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredApplications.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                                No applications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageApplications;