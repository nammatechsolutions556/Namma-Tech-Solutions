import React, { useState } from "react";
import axios from "axios";
import "./ApplicationModal.css";

const ApplicationModal = ({ 
    show, 
    closeModal, 
    selectedDomain, 
    selectedDuration, 
    selectedPrice, 
    url 
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
        interest: ""
    });
    const [resume, setResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    if (!show) return null;

    const handleChange = (e) => {
        if (e.target.name === "resume") {
            setResume(e.target.files[0]);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume) {
            alert("Please upload your resume.");
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("domain", selectedDomain);
        data.append("duration", selectedDuration);
        data.append("price", selectedPrice);
        data.append("college", formData.college);
        data.append("course", formData.course);
        data.append("interest", formData.interest);
        data.append("resume", resume);

        try {
            await axios.post(`${url}/api/applications`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Internship Application submitted successfully!");
            closeModal();
        } catch (error) {
            console.error("Error submitting internship application:", error);
            alert("Failed to submit application.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Internship Application</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Full Name" 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Email Address" 
                        required 
                    />
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Phone Number" 
                        required 
                    />
                    
                    <div className="readonly-fields">
                        <div className="field-group">
                            <label>Domain</label>
                            <input type="text" value={selectedDomain} readOnly />
                        </div>
                        <div className="field-group">
                            <label>Duration</label>
                            <input type="text" value={selectedDuration} readOnly />
                        </div>
                        <div className="field-group">
                            <label>Price</label>
                            <input type="text" value={selectedPrice} readOnly />
                        </div>
                    </div>

                    <input 
                        type="text" 
                        name="college" 
                        value={formData.college} 
                        onChange={handleChange} 
                        placeholder="College / University" 
                        required 
                    />
                    <input 
                        type="text" 
                        name="course" 
                        value={formData.course} 
                        onChange={handleChange} 
                        placeholder="Course (B.Tech / MCA / etc)" 
                        required 
                    />
                    <textarea
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        placeholder="Tell us about your interest"
                        rows="4"
                        required
                    ></textarea>

                    <div className="file-input-group">
                        <label>Upload Resume (PDF, DOC, DOCX)</label>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="submit-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
