import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { exportToExcel } from "../../utils/exportToExcel";
import "./ManageCertificates.css";

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        title: "",
        projectTitle: "",
        certType: "Internship",
        university: "",
        domain: "",
        startDate: "",
        endDate: "",
        gainedSkills: "",
        referenceNumber: "",
        companyName: "Namma Tech Solutions"
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCertificates = async () => {
        try {
            const res = await api.get("/certificates");
            setCertificates(res.data);
        } catch (error) {
            console.error("Error fetching certificates", error);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e, forcedType = null) => {
        if (e) e.preventDefault();

        const typeToUse = forcedType || form.certType;

        // Basic validation
        if (!form.name || !form.email || !form.title || !typeToUse) {
            alert("Name, Email, and Course Title are required");
            return;
        }

        if (typeToUse === "Internship" && !form.projectTitle) {
            alert("Internship Project Title is required");
            return;
        }

        setIsGenerating(true);
        try {
            const submitData = { ...form, certType: typeToUse };
            if (editingId) {
                await api.put(`/certificates/${editingId}`, submitData);
                alert("Certificate updated successfully!");
                setEditingId(null);
            } else {
                await api.post("/certificates", submitData);
                alert(`${typeToUse} certificate generated successfully!`);
            }

            fetchCertificates();
            setForm({
                name: "", email: "", title: "", projectTitle: "", certType: "Internship",
                university: "", domain: "", startDate: "", endDate: "", gainedSkills: "",
                referenceNumber: "", companyName: "Namma Tech Solutions"
            });
        } catch (error) {
            console.error("Error saving certificate", error);
            alert("Failed to process certificate.");
        } finally {
            setIsGenerating(false);
        }
    };

    const editCertificate = (cert) => {
        setEditingId(cert._id);
        setForm({
            name: cert.name || "",
            email: cert.email || "",
            title: cert.title || (cert.internship ? cert.internship.split(" (Project")[0] : ""),
            projectTitle: cert.project_title || "",
            certType: cert.cert_type || "Internship",
            university: cert.university || "",
            domain: cert.domain || "",
            startDate: cert.start_date ? cert.start_date.split('T')[0] : "",
            endDate: cert.end_date ? cert.end_date.split('T')[0] : "",
            gainedSkills: cert.gained_skills || "",
            referenceNumber: cert.reference_number || "",
            companyName: cert.company_name || "Namma Tech Solutions"
        });
        window.scrollTo(0, 0);
    };

    const deleteCertificate = async (id) => {
        if (!window.confirm("Are you sure you want to delete this certificate?")) return;
        try {
            await api.delete(`/certificates/${id}`);
            fetchCertificates();
        } catch (error) {
            console.error("Error deleting certificate", error);
            alert("Failed to delete certificate.");
        }
    };

    const sendCertificate = async (id) => {
        if (!window.confirm("Send this certificate to the client's email?")) return;
        try {
            await api.post(`/certificates/${id}/send`);
            alert("Certificate sent successfully!");
            fetchCertificates();
        } catch (error) {
            console.error("Error sending certificate", error);
            alert("Failed to send. Ensure SMTP is configured, but DB was updated.");
            fetchCertificates();
        }
    };

    const filteredCertificates = certificates.filter((c) => {
        const matchesSearch =
            (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.internship || "").toLowerCase().includes(searchTerm.toLowerCase());

        const certType = c.cert_type || "Internship";
        const matchesType = typeFilter === "All" || certType === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleExport = () => {
        const dataToExport = filteredCertificates.map(c => ({
            Name: c.name,
            Email: c.email,
            "Course Title": c.title || c.internship,
            "Project Title": c.project_title || "",
            "Cert Type": c.cert_type || "Internship",
            "University Name": c.university || "",
            "Field/Domain": c.domain || "",
            "Start Date": c.start_date ? new Date(c.start_date).toLocaleDateString() : "",
            "End Date": c.end_date ? new Date(c.end_date).toLocaleDateString() : "",
            "Ref Number": c.reference_number || "",
            "Sent Status": c.is_sent ? "Sent" : "Pending"
        }));
        exportToExcel(dataToExport, "Certificates");
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredCertificates.map((c) => c._id));
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
        if (!window.confirm(`Are you sure you want to ${action} ${selectedIds.length} certificates?`)) return;
        try {
            if (action === 'delete') {
                await Promise.all(selectedIds.map(id => api.delete(`/certificates/${id}`)));
                alert("Deleted successfully!");
            } else if (action === 'sendEmail') {
                await Promise.all(selectedIds.map(id => api.post(`/certificates/${id}/send`)));
                alert("Emails trigger sent!");
            }
            fetchCertificates();
            setSelectedIds([]);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            alert("Some actions failed to complete");
            fetchCertificates();
        }
    };

    return (
        <div className="manage-certificates-container">
            <h2>{editingId ? "Edit Certificate" : "Generate Certificates"}</h2>

            <form onSubmit={handleSubmit} className="certificate-form">
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Client Name *</label>
                        <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Client Email *</label>
                        <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Course / Project Level *</label>
                        <input name="title" placeholder="E.g. Web Development" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Internship Project Title *</label>
                        <input name="projectTitle" placeholder="E-Commerce App" value={form.projectTitle} onChange={handleChange} />
                        <small style={{ color: '#94a3b8' }}>Only for Internship certificates</small>
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>University Name</label>
                        <input name="university" placeholder="XYZ University" value={form.university} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Field / Domain</label>
                        <input name="domain" placeholder="Software Engineering" value={form.domain} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Gained Skills</label>
                        <input name="gainedSkills" placeholder="React, Node.js, MongoDB" value={form.gainedSkills} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Reference Number</label>
                        <input name="referenceNumber" placeholder="REF-12345" value={form.referenceNumber} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input name="companyName" placeholder="Namma Tech Solutions" value={form.companyName} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ opacity: 0, pointerEvents: 'none' }}>
                        <label>Placeholder</label>
                        <input disabled />
                    </div>
                </div>

                <div className="form-actions">
                    {editingId ? (
                        <button type="button" onClick={(e) => handleSubmit(e, form.certType)} disabled={isGenerating}>
                            {isGenerating ? "Updating..." : "Update Certificate"}
                        </button>
                    ) : (
                        <>
                            <button type="button" onClick={(e) => handleSubmit(e, "Internship")} disabled={isGenerating}>
                                {isGenerating ? "Processing..." : "Generate Internship Certificate"}
                            </button>
                            <button type="button" className="secondary-btn" onClick={(e) => handleSubmit(e, "Project")} disabled={isGenerating}>
                                {isGenerating ? "Processing..." : "Generate Project Certificate"}
                            </button>
                        </>
                    )}
                    {editingId && (
                        <button type="button" className="del-btn" onClick={() => {
                            setEditingId(null);
                            setForm({ name: "", email: "", title: "", projectTitle: "", certType: "Internship", university: "", domain: "", startDate: "", endDate: "", gainedSkills: "", referenceNumber: "", companyName: "Namma Tech Solutions" });
                        }}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="certificate-list-header">
                <div>
                    <input
                        type="checkbox"
                        className="header-checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length === filteredCertificates.length && filteredCertificates.length > 0}
                    />
                    <h3>Existing Certificates</h3>
                </div>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or Course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="All">All Types</option>
                        <option value="Internship">Internship</option>
                        <option value="Project">Project</option>
                        <option value="Both">Both</option>
                    </select>

                    <button className="export-btn" onClick={handleExport}>
                        Export HTML
                    </button>
                    <button className="export-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => {
                        const dataToExport = filteredCertificates.map(c => ({
                            Name: c.name,
                            Email: c.email,
                            "Course Title": c.title || c.internship,
                            "Project Title": c.project_title || "",
                            "Cert Type": c.cert_type || "Internship",
                            "University Name": c.university || "",
                            "Field/Domain": c.domain || "",
                            "Start Date": c.start_date ? new Date(c.start_date).toLocaleDateString() : "",
                            "End Date": c.end_date ? new Date(c.end_date).toLocaleDateString() : "",
                            "Ref Number": c.reference_number || "",
                            "Sent Status": c.is_sent ? "Sent" : "Pending"
                        }));
                        exportToExcel(dataToExport, "Certificates_Excel");
                    }}>
                        Export to Excel
                    </button>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="bulk-actions-bar">
                    <span>{selectedIds.length} selected</span>
                    <button className="approve-btn" onClick={() => handleBulkAction('sendEmail')}>Send Email</button>
                    <button className="delete-btn" onClick={() => handleBulkAction('delete')}>Delete Selected</button>
                </div>
            )}

            <ul className="certificate-list">
                {filteredCertificates.map((c) => (
                    <li key={c._id} className="certificate-item">
                        <input
                            type="checkbox"
                            className="item-checkbox"
                            checked={selectedIds.includes(c._id)}
                            onChange={() => handleSelect(c._id)}
                        />
                        <div className="cert-info">
                            <strong>{c.name}</strong> ({c.email})
                            <br />
                            <span className="cert-title">{c.internship || c.title}</span>
                            {c.is_sent && <span className="status-badge-sent">Sent to Client</span>}
                        </div>
                        <div className="cert-actions">
                            <a href={`http://localhost:5000${c.certificateUrl}`} target="_blank" rel="noopener noreferrer" className="view-btn">
                                View PDF
                            </a>
                            <button className="edit-btn" onClick={() => editCertificate(c)}>Edit</button>
                            <button className="send-btn" onClick={() => sendCertificate(c._id)}>Send Email</button>
                            <button className="del-btn" onClick={() => deleteCertificate(c._id)}>Delete</button>
                        </div>
                    </li>
                ))}
                {filteredCertificates.length === 0 && (
                    <li className="certificate-item" style={{ justifyContent: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No certificates found matching your criteria.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ManageCertificates;