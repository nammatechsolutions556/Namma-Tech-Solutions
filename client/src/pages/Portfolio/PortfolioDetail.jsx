import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { ProjectRequestModal } from "../../components/ProjectModals/ProjectModals";
import "./PortfolioDetail.css";

const PortfolioDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeMedia, setActiveMedia] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${url}/api/portfolio/${id}`);
                setProject(response.data);
                if (response.data.video) {
                    setActiveMedia({ type: 'video', url: response.data.video });
                }
            } catch (error) {
                console.error("Failed to load portfolio details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, url]);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!project) return <div className="error-message">Portfolio item not found.</div>;

    const handleRequest = () => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to request a project.");
            navigate("/login");
            return;
        }
        setShowModal(true);
    };

    return (
        <div className="project-detail-page">
            <div className="detail-container">
                <button className="back-btn" onClick={() => navigate("/portfolio")}>
                    &larr; Back to Portfolio
                </button>

                <div className="detail-header">
                    <div className="header-text">
                        <span className="category-badge">{project.category}</span>
                        <h1>{project.title}</h1>
                    </div>
                    {project.price && (
                        <div className="header-price">
                            <span className="price-label">Estimated Value</span>
                            <span className="price-value">{project.price}</span>
                        </div>
                    )}
                </div>

                <div className="detail-main-content">
                    <div className="media-showcase">
                        <div className="active-media-container">
                            {activeMedia?.type === 'video' ? (
                                <video controls autoPlay muted key={activeMedia.url}>
                                    <source src={`${url}${activeMedia.url}`} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="no-media-placeholder">
                                    <p>No video demo available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-and-action">
                        <div className="description-section">
                            <h3>Project Overview</h3>
                            <div 
                                className="full-html-description"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        </div>

                        <div className="action-card">
                            <h3>Want something similar?</h3>
                            <p>We can build a tailored solution based on this project or create something entirely new for you.</p>
                            <button className="request-large-btn" onClick={handleRequest}>
                                Request Similar Project
                            </button>
                            <ul className="project-features">
                                <li>✓ Modern Architecture</li>
                                <li>✓ Scalable Solutions</li>
                                <li>✓ Expert Consultation</li>
                                <li>✓ Ongoing Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ProjectRequestModal 
                show={showModal}
                closeModal={() => setShowModal(false)}
                selectedProject={project.title}
                url={url}
            />
        </div>
    );
};

export default PortfolioDetail;
