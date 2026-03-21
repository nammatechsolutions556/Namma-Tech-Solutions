import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Internships.css";

const InternshipCard = ({ item, openModal }) => {
    // Database durations format: [{duration: "X Months", price: "Y"}]
    const durationsArray = item.durations || [];
    const defaultDuration = durationsArray.length > 0 ? durationsArray[0].duration : "";
    const [selectedDur, setSelectedDur] = useState(defaultDuration);

    // Find corresponding price
    const currentDurationObj = durationsArray.find(d => d.duration === selectedDur);
    const price = currentDurationObj ? currentDurationObj.price : "N/A";

    return (
        <div className="internship-card">
            <h3>{item.title}</h3>
            <div
                className="html-description-preview"
                dangerouslySetInnerHTML={{ __html: item.description }}
            />

            {/* Duration Dropdown */}
            {durationsArray.length > 0 && (
                <>
                    <label>Duration</label>
                    <select
                        value={selectedDur}
                        onChange={(e) => setSelectedDur(e.target.value)}
                    >
                        {durationsArray.map((d, i) => (
                            <option key={i} value={d.duration}>
                                {d.duration}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* Price */}
            <p className="price">
                Price: <strong>{price}</strong>
            </p>

            <p className="certificate">
                Certificates: Internship + Project Completion
            </p>

            <button
                className="apply-btn"
                onClick={() => openModal(item.title, selectedDur, price)}
            >
                Apply Now
            </button>
        </div>
    );
};

const Internships = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
        interest: ""
    });
    const [resume, setResume] = useState(null);

    // Dynamic DB Internships
    const [internships, setInternships] = useState([]);

    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`${url}/api/internships`);
                setInternships(response.data);
            } catch (error) {
                console.error("Failed to load internships:", error);
            }
        };
        fetchInternships();
    }, []);

    // Filter logic
    const filteredInternships = useMemo(() => {
        return internships.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, internships]);

    // Handle outside click to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const suggestions = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return internships
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => item.title)
            .slice(0, 5);
    }, [searchTerm, internships]);

    const openModal = (domain, duration, price) => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to apply for an internship.");
            navigate("/login");
            return;
        }
        setSelectedDomain(domain);
        setSelectedDuration(duration);
        setSelectedPrice(price);
        setFormData({ name: "", email: "", phone: "", college: "", course: "", interest: "" });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setResume(null);
    };

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
        }
    };

    return (
        <div className="internship-page">
            <h1>Internship Programs</h1>
            <p>Select duration to see the price.</p>

            <div className="search-container" ref={searchRef}>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for internships..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm("")}>×</button>
                    )}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    setShowSuggestions(false);
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="internship-grid">
                {filteredInternships.length > 0 ? (
                    filteredInternships.map((item, index) => (
                        <InternshipCard
                            key={item._id || index}
                            item={item}
                            openModal={openModal}
                        />
                    ))
                ) : (
                    <div className="no-results">No internships found matching {searchTerm}</div>
                )}
            </div>

            {/* Modal */}

            {showModal && (
                <div className="modal-overlay">

                    <div className="modal">

                        <h2>Internship Application</h2>

                        <form onSubmit={handleSubmit}>

                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />

                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />

                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />

                            <input type="text" value={selectedDomain} readOnly />

                            <input type="text" value={selectedDuration} readOnly />

                            <input type="text" value={selectedPrice} readOnly />

                            <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="College / University" required />

                            <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Course (B.Tech / MCA / etc)" required />

                            <textarea
                                name="interest"
                                value={formData.interest}
                                onChange={handleChange}
                                placeholder="Tell us about your interest"
                                rows="4"
                                required
                            ></textarea>

                            <div className="file-input-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Upload Resume (PDF, DOC, DOCX)</label>
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    required
                                    style={{
                                        padding: '0.5rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        width: '100%'
                                    }}
                                />
                            </div>

                            <button className="submit-btn">
                                Submit Application
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
            )}

        </div>
    );
};

export default Internships;
