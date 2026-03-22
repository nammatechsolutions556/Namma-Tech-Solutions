import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { exportToExcel } from "../../utils/exportToExcel";
import "./ClientEnquiries.css";

const ClientEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchEnquiries = async () => {
        try {
            const res = await api.get("/contact");
            setEnquiries(res.data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/contact/${id}`, { status });
            fetchEnquiries();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteEnquiry = async (id) => {
        try {
            await api.delete(`/contact/${id}`);
            fetchEnquiries();
        } catch (error) {
            console.error("Error deleting enquiry:", error);
        }
    };

    const filteredEnquiries = enquiries.filter((e) => {
        const matchesSearch =
            (e.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.subject || "").toLowerCase().includes(searchTerm.toLowerCase());

        const currentStatus = e.status || "Pending";
        const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        const dataToExport = filteredEnquiries.map(e => ({
            Name: e.name,
            Email: e.email,
            Mobile: e.mobile,
            Subject: e.subject,
            Message: e.message,
            Status: e.status || "Pending",
        }));
        exportToExcel(dataToExport, "Client_Enquiries");
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredEnquiries.map((enq) => enq._id));
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
                await Promise.all(selectedIds.map(id => api.delete(`/contact/${id}`)));
            } else {
                const status = action === 'mark read' ? 'Read' : 'Resolved';
                await Promise.all(selectedIds.map(id => api.put(`/contact/${id}`, { status })));
            }
            fetchEnquiries();
            setSelectedIds([]);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            alert("Failed to perform bulk action");
        }
    };

    return (
        <div className="client-enquiries-container">
            <h2>Client Enquiries</h2>

            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search Name, Email, Subject..."
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
                    <option value="Read">Read</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <button className="export-btn" onClick={handleExport}>
                    Export to Excel
                </button>
            </div>

            {selectedIds.length > 0 && (
                <div className="table-controls" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <span style={{ color: '#60a5fa', fontWeight: '500' }}>{selectedIds.length} selected</span>
                    <button className="approve-btn" onClick={() => handleBulkAction('mark read')}>Mark Read Selected</button>
                    <button className="reject-btn" style={{ background: '#3b82f6' }} onClick={() => handleBulkAction('resolved')}>Resolved Selected</button>
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
                                checked={selectedIds.length === filteredEnquiries.length && filteredEnquiries.length > 0}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredEnquiries.map((e) => (
                        <tr key={e._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(e._id)}
                                    onChange={() => handleSelect(e._id)}
                                />
                            </td>
                            <td>{e.name}</td>
                            <td>{e.email}</td>
                            <td>{e.mobile}</td>
                            <td>{e.subject}</td>
                            <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={e.message}>
                                {e.message}
                            </td>
                            <td>
                                <span className={`status-badge ${(e.status || "pending").toLowerCase()}`}>
                                    {e.status || "Pending"}
                                </span>
                            </td>

                            <td className="action-buttons">
                                <button className="approve-btn" onClick={() => updateStatus(e._id, "Read")}>
                                    Mark Read
                                </button>

                                <button className="reject-btn" style={{ background: '#3b82f6' }} onClick={() => updateStatus(e._id, "Resolved")}>
                                    Resolved
                                </button>

                                <button className="delete-btn" onClick={() => deleteEnquiry(e._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                                No enquiries found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientEnquiries;
