import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import ApplicationModal from "../../components/ApplicationModal/ApplicationModal";
import "./InternshipDetail.css";

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDur, setSelectedDur] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const response = await axios.get(`${url}/api/internships/${id}`);
                setInternship(response.data);
                if (response.data.durations && response.data.durations.length > 0) {
                    setSelectedDur(response.data.durations[0].duration);
                }
            } catch (error) {
                console.error("Failed to load internship details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();
    }, [id, url]);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!internship) {
        return <div className="error-message">Internship not found.</div>;
    }

    const currentDurationObj = internship.durations.find(d => d.duration === selectedDur);
    const price = currentDurationObj ? currentDurationObj.price : "N/A";

    const handleApply = () => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to apply for an internship.");
            navigate("/login");
            return;
        }
        setShowModal(true);
    };

    return (
        <div className="internship-detail-page">
            <div className="detail-container">
                <button className="back-btn" onClick={() => navigate("/internships")}>
                    &larr; Back to Internships
                </button>

                <div className="detail-content">
                    <div className="info-section">
                        <h1>{internship.title}</h1>
                        <div className="badges">
                            <span className="badge">Internship</span>
                            <span className="badge">Certificate Included</span>
                            <span className="badge">Remote / In-office</span>
                        </div>

                        <div
                            className="full-description"
                            dangerouslySetInnerHTML={{ __html: internship.description }}
                        />

                        <div className="certificate-info">
                            <h3>Certification & Benefits</h3>
                            <ul>
                                <li>Official Internship Completion Certificate</li>
                                <li>Project Completion Certificate</li>
                                <li>Hands-on experience with real-world projects</li>
                                <li>Mentorship from industry experts</li>
                                <li>Job Offer (based on performance)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="action-sidebar">
                        <div className="sticky-card">
                            <h3>Ready to Start?</h3>
                            <p>Select your preferred duration and secure your spot today.</p>

                            <div className="duration-picker">
                                <label>Duration</label>
                                <select
                                    value={selectedDur}
                                    onChange={(e) => setSelectedDur(e.target.value)}
                                >
                                    {internship.durations.map((d, i) => (
                                        <option key={i} value={d.duration}>{d.duration}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="price-display">
                                <span className="label">Program Fee</span>
                                <span className="value">{price}</span>
                            </div>

                            <button className="apply-now-large" onClick={handleApply}>
                                Apply Now
                            </button>

                            <p className="guarantee">
                                <i className="shield-icon"></i> 100% Secure Application
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationModal
                show={showModal}
                closeModal={() => setShowModal(false)}
                selectedDomain={internship.title}
                selectedDuration={selectedDur}
                selectedPrice={price}
                url={url}
            />
        </div>
    );
};

export default InternshipDetail;
