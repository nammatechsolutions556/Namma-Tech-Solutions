import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Portfolio.css";

const Portfolio = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [viewProject, setViewProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [domains, setDomains] = useState(["All"]);

    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${url}/api/portfolio`);
                const fetchedProjects = response.data;
                setProjects(fetchedProjects);

                // Extract unique categories (domains) from projects for the filter tabs
                const uniqueCategories = ["All", ...new Set(fetchedProjects.map(p => p.category).filter(Boolean))];
                setDomains(uniqueCategories);

            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects =
        filter === "All"
            ? projects
            : projects.filter((project) => project.category === filter);

    const openModal = (title) => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to request a project.");
            navigate("/login");
            return;
        }
        setSelectedProject(title);
        setShowModal(true);
    };

    const openDetailsModal = (project) => {
        setViewProject(project);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setViewProject(null);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="portfolio-page">
            <h1>Our Portfolio</h1>

            <p>
                Explore some of the projects developed by Namma Tech Solutions.
            </p>

            {/* Filter Buttons */}
            <div className="portfolio-filters">
                {domains.map((domain, index) => (
                    <button
                        key={index}
                        className={filter === domain ? "active-filter" : ""}
                        onClick={() => setFilter(domain)}
                    >
                        {domain}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className="portfolio-grid">
                {filteredProjects.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#9ca3af", gridColumn: "1 / -1" }}>No projects added yet.</p>
                ) : (
                    filteredProjects.map((project) => (
                        <div className="portfolio-card" key={project._id}>
                            {project.video && (
                                <video
                                    src={`${url}${project.video}`}
                                    className="portfolio-cover"
                                    muted
                                    loop
                                    onMouseOver={(e) => e.target.play()}
                                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                />
                            )}
                            <h3>{project.title}</h3>
                            <p className="domain">{project.category}</p>

                            <div
                                className="html-description-preview"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />

                            {project.price && (
                                <p style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '1rem' }}>
                                    ₹{project.price}
                                </p>
                            )}

                            <div className="card-actions">
                                <button className="view-details-btn" onClick={() => openDetailsModal(project)}>
                                    View Details
                                </button>
                                <button className="request-btn" onClick={() => openModal(project.title)}>
                                    Request Similar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Popup Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Request Similar Project</h2>
                        <form>
                            <input type="text" placeholder="Full Name" required />
                            <input type="email" placeholder="Email Address" required />
                            <input type="tel" placeholder="Phone Number" required />
                            <input
                                type="text"
                                value={selectedProject}
                                readOnly
                            />
                            <textarea
                                placeholder="Describe your project requirements"
                                rows="4"
                            ></textarea>
                            <button className="submit-btn" type="button" onClick={() => {
                                alert("Success! Your request has been recorded.");
                                closeModal();
                            }}>
                                Submit Request
                            </button>
                            <button type="button" className="close-btn" onClick={closeModal}>
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Project Details Modal */}
            {showDetailsModal && viewProject && (
                <div className="modal-overlay details-overlay">
                    <div className="modal details-modal">
                        <h2>{viewProject.title}</h2>
                        <span className="domain-badge">{viewProject.category}</span>

                        <div className="media-gallery">
                            <div className="active-media-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                                {viewProject.video ? (
                                    <video controls autoPlay muted key={viewProject.video} style={{ maxWidth: '100%', maxHeight: '80vh', width: 'auto', height: 'auto', borderRadius: '1.5rem', boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)' }}>
                                        <source src={`${url}${viewProject.video}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="no-media-placeholder">
                                        <p style={{ color: '#94a3b8' }}>No video demo available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="full-html-description"
                            dangerouslySetInnerHTML={{ __html: viewProject.description }}
                        />

                        <button type="button" className="close-btn details-close-btn" onClick={closeDetailsModal}>
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;