import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { ProjectRequestModal } from "../../components/ProjectModals/ProjectModals";
import "./Portfolio.css";

const Portfolio = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
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
    }, [url]);

    const filteredProjects =
        filter === "All"
            ? projects
            : projects.filter((project) => project.category === filter);

    const openRequestModal = (title) => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to request a project.");
            navigate("/login");
            return;
        }
        setSelectedProject(title);
        setShowModal(true);
    };

    const handleViewDetails = (id) => {
        navigate(`/portfolio/${id}`);
    };

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
                        <div 
                            className="portfolio-card" 
                            key={project._id}
                            onClick={() => handleViewDetails(project._id)}
                        >
                            {project.video && (
                                <video
                                    src={`${url}${project.video}`}
                                    className="portfolio-cover"
                                    muted
                                    loop
                                    onMouseOver={(e) => {
                                        const video = e.target;
                                        if (video.readyState >= 2) {
                                            const playPromise = video.play();
                                            if (playPromise !== undefined) {
                                                playPromise.catch(() => { /* Soft fail for interrupted playback */ });
                                            }
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        const video = e.target;
                                        video.pause();
                                        video.currentTime = 0;
                                    }}
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
                                    {project.price}
                                </p>
                            )}

                            <div className="card-actions">
                                <button className="view-details-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(project._id);
                                }}>
                                    View Details
                                </button>
                                <button className="request-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    openRequestModal(project.title);
                                }}>
                                    Request Similar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Project Request Modal */}
            <ProjectRequestModal 
                show={showModal}
                closeModal={() => setShowModal(false)}
                selectedProject={selectedProject}
                url={url}
            />
        </div>
    );
};

export default Portfolio;