import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { exportToExcel } from "../../utils/exportToExcel";
import "./ManageRequests.css";

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/requests");
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/requests/${id}`, { status });
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteRequest = async (id) => {
        try {
            await api.delete(`/requests/${id}`);
            fetchRequests();
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };

    const filteredRequests = requests.filter((r) => {
        const matchesSearch =
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.project.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || r.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        const dataToExport = filteredRequests.map(r => ({
            Name: r.name,
            Email: r.email,
            Project: r.project,
            Status: r.status || "Pending",
        }));
        exportToExcel(dataToExport, "Client_Requests");
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredRequests.map((r) => r._id));
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
                await Promise.all(selectedIds.map(id => api.delete(`/requests/${id}`)));
            } else {
                const status = action === 'approve' ? 'Approved' : 'Rejected';
                await Promise.all(selectedIds.map(id => api.put(`/requests/${id}`, { status })));
            }
            fetchRequests();
            setSelectedIds([]);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            alert("Failed to perform bulk action");
        }
    };

    return (
        <div className="manage-requests-container">
            <h2>Client Requests</h2>

            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Project..."
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
                                checked={selectedIds.length === filteredRequests.length && filteredRequests.length > 0}
                            />
                        </th>
                        <th>Name</th>
                        <th>Project</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredRequests.map((r) => (
                        <tr key={r._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(r._id)}
                                    onChange={() => handleSelect(r._id)}
                                />
                            </td>
                            <td>{r.name}</td>
                            <td>{r.project}</td>
                            <td>{r.email}</td>
                            <td>
                                <span className={`status-badge ${r.status ? r.status.toLowerCase() : 'pending'}`}>
                                    {r.status || "Pending"}
                                </span>
                            </td>

                            <td className="action-buttons">
                                <button className="approve-btn" onClick={() => updateStatus(r._id, "Approved")}>
                                    Approve
                                </button>

                                <button className="reject-btn" onClick={() => updateStatus(r._id, "Rejected")}>
                                    Reject
                                </button>

                                <button className="delete-btn" onClick={() => deleteRequest(r._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                                No requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageRequests;