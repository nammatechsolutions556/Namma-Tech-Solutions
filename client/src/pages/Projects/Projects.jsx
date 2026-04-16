import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { ProjectRequestModal, CustomProjectModal } from "../../components/ProjectModals/ProjectModals";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");

  const [projects, setProjects] = useState([]);

  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${url}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, [url]);

  const domains = useMemo(() => {
    const categories = projects
      .map((project) => project.category)
      .filter((category) => category && category.trim() !== "");
    const uniqueCategories = [...new Set(categories)];
    return ["All", ...uniqueCategories.sort()];
  }, [projects]);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  const openProjectModal = (e, title) => {
    e.stopPropagation();
    const token = localStorage.getItem("nts_token");
    if (!token) {
      alert("Please login to request a project.");
      navigate("/login");
      return;
    }
    setSelectedProject(title);
    setShowProjectModal(true);
  };

  const openCustomModal = () => {
    const token = localStorage.getItem("nts_token");
    if (!token) {
      alert("Please login to request a custom project.");
      navigate("/login");
      return;
    }
    setShowCustomModal(true);
  };

  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="projects-page">
      <h1>Available Projects</h1>
      <p>Browse ready-made projects or request a custom solution. Click on any project to view full details.</p>

      <button
        className="custom-project-btn"
        onClick={openCustomModal}
      >
        Request Custom Project
      </button>

      <div className="project-filters">
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

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div 
            className="project-card" 
            key={project._id || project.id}
            onClick={() => handleCardClick(project._id || project.id)}
          >
            {project.video && (
              <video
                src={project.video.startsWith('http') || project.video.startsWith('//') || project.video.includes('cloudinary.com') ? project.video : `${url}${project.video}`}
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
            <span className="category-badge">{project.category}</span>

            <div
              className="html-description-preview"
              dangerouslySetInnerHTML={{
                __html: project.description.length > 100
                  ? project.description.substring(0, 100) + '...'
                  : project.description
              }}
            />

            <h4 className="price">{project.price}</h4>

            <div className="card-actions">
              <button 
                className="view-details-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(project._id || project.id);
                }}
              >
                View Details
              </button>
              <button
                className="request-btn"
                onClick={(e) => openProjectModal(e, project.title)}
              >
                Request This Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modals */}
      <ProjectRequestModal 
        show={showProjectModal}
        closeModal={() => setShowProjectModal(false)}
        selectedProject={selectedProject}
        url={url}
      />

      <CustomProjectModal 
        show={showCustomModal}
        closeModal={() => setShowCustomModal(false)}
        url={url}
      />
    </div>
  );
};

export default Projects;