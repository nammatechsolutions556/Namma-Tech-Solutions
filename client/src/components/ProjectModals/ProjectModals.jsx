import React, { useState } from "react";
import axios from "axios";
import "./ProjectModals.css";

// --- Project Request Modal (For Ready Projects) ---
export const ProjectRequestModal = ({ show, closeModal, selectedProject, url }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        requirements: ""
    });
    const [submitting, setSubmitting] = useState(false);

    if (!show) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${url}/api/requests`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                project: selectedProject,
                requirements: formData.requirements
            });
            alert("Request securely submitted!");
            closeModal();
        } catch (error) {
            console.error("Error submitting ready request:", error);
            alert("Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal project-modal">
                <h2>Project Request</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                    <div className="field-group">
                        <label>Selected Project</label>
                        <input type="text" value={selectedProject} readOnly />
                    </div>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Project Requirements / Customizations"
                        rows="4"
                    ></textarea>
                    <button className="submit-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                    <button type="button" className="close-btn" onClick={closeModal}>Close</button>
                </form>
            </div>
        </div>
    );
};

// --- Custom Project Modal (For New Ideas) ---
export const CustomProjectModal = ({ show, closeModal, url }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectDomain: "",
        budget: "",
        requirements: ""
    });
    const [submitting, setSubmitting] = useState(false);

    if (!show) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${url}/api/requests`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                project: formData.projectDomain,
                budget: formData.budget,
                requirements: formData.requirements
            });
            alert("Custom Request securely submitted!");
            closeModal();
        } catch (error) {
            console.error("Error submitting custom request:", error);
            alert("Failed to submit custom request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal project-modal">
                <h2>Request Custom Project</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                    <input type="text" name="projectDomain" value={formData.projectDomain} onChange={handleChange} placeholder="Project Domain (Web / AI / Mobile)" required />
                    <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Estimated Budget (₹)" required />
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Describe your project idea and specific requirements"
                        rows="4"
                        required
                    ></textarea>
                    <button className="submit-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Custom Request"}
                    </button>
                    <button type="button" className="close-btn" onClick={closeModal}>Close</button>
                </form>
            </div>
        </div>
    );
};
