import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { ProjectRequestModal } from "../../components/ProjectModals/ProjectModals";
import "./ProjectDetail.css";

const ProjectDetail = () => {
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
                const response = await axios.get(`${url}/api/projects/${id}`);
                setProject(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setActiveMedia({ type: 'image', url: response.data.images[0] });
                } else if (response.data.video) {
                    setActiveMedia({ type: 'video', url: response.data.video });
                }
            } catch (error) {
                console.error("Failed to load project details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, url]);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!project) return <div className="error-message">Project not found.</div>;

    const handleRequest = () => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to request this project.");
            navigate("/login");
            return;
        }
        setShowModal(true);
    };

    return (
        <div className="project-detail-page">
            <div className="detail-container">
                <button className="back-btn" onClick={() => navigate("/projects")}>
                    &larr; Back to Projects
                </button>

                <div className="detail-header">
                    <div className="header-text">
                        <span className="category-badge">{project.category}</span>
                        <h1>{project.title}</h1>
                    </div>
                    <div className="header-price">
                        <span className="price-label">Project Price</span>
                        <span className="price-value">{project.price}</span>
                    </div>
                </div>

                <div className="detail-main-content">
                    <div className="media-showcase">
                        <div className="active-media-container">
                            {activeMedia?.type === 'image' ? (
                                <img src={`${url}${activeMedia.url}`} alt={project.title} />
                            ) : activeMedia?.type === 'video' ? (
                                <video controls autoPlay muted key={activeMedia.url}>
                                    <source src={`${url}${activeMedia.url}`} type="video/mp4" />
                                </video>
                            ) : null}
                        </div>
                        
                        <div className="media-thumbnails">
                            {project.images?.map((img, idx) => (
                                <div 
                                    key={`img-${idx}`} 
                                    className={`thumb ${activeMedia?.url === img ? 'active' : ''}`}
                                    onClick={() => setActiveMedia({ type: 'image', url: img })}
                                >
                                    <img src={`${url}${img}`} alt={`Thumbnail ${idx + 1}`} />
                                </div>
                            ))}
                            {project.video && (
                                <div 
                                    className={`thumb video-thumb ${activeMedia?.url === project.video ? 'active' : ''}`}
                                    onClick={() => setActiveMedia({ type: 'video', url: project.video })}
                                >
                                    <div className="play-icon">▶</div>
                                    <span className="video-label">Watch Demo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-and-action">
                        <div className="description-section">
                            <h3>About the Project</h3>
                            <div 
                                className="full-html-description"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        </div>

                        <div className="action-card">
                            <h3>Interesting in this project?</h3>
                            <p>Get this ready-made solution or request enhancements specifically for your needs.</p>
                            <button className="request-large-btn" onClick={handleRequest}>
                                Request This Project
                            </button>
                            <ul className="project-features">
                                <li>✓ Full Source Code</li>
                                <li>✓ Setup & Deployment Guide</li>
                                <li>✓ 1 Month Free Support</li>
                                <li>✓ Customization Available</li>
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

export default ProjectDetail;
