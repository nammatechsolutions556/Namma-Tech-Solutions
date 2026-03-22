import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [viewProject, setViewProject] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectDomain: "", // For custom
    budget: "", // For custom
    requirements: ""
  });

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
  }, []);

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

  const openProjectModal = (title) => {
    const token = localStorage.getItem("nts_token");
    if (!token) {
      alert("Please login to request a project.");
      navigate("/login");
      return;
    }
    setSelectedProject(title);
    setFormData({ name: "", email: "", phone: "", projectDomain: "", budget: "", requirements: "" });
    setShowProjectModal(true);
  };

  const closeProjectModal = () => setShowProjectModal(false);

  const openDetailsModal = (project) => {
    setViewProject(project);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setViewProject(null);
  };

  const openCustomModal = () => {
    const token = localStorage.getItem("nts_token");
    if (!token) {
      alert("Please login to request a custom project.");
      navigate("/login");
      return;
    }
    setFormData({ name: "", email: "", phone: "", projectDomain: "", budget: "", requirements: "" });
    setShowCustomModal(true);
  };

  const closeCustomModal = () => setShowCustomModal(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Request (Ready Project)
  const handleReadySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/requests`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project: selectedProject,
        requirements: formData.requirements
      });
      alert("Request securely submitted!");
      closeProjectModal();
    } catch (error) {
      console.error("Error submitting ready request:", error);
      alert("Failed to submit request.");
    }
  };

  // Submit Request (Custom Project)
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/requests`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project: formData.projectDomain, // E.g., Web App Request
        budget: formData.budget,
        requirements: formData.requirements
      });
      alert("Custom Request securely submitted!");
      closeCustomModal();
    } catch (error) {
      console.error("Error submitting custom request:", error);
      alert("Failed to submit custom request.");
    }
  };

  return (
    <div className="projects-page">

      <h1>Available Projects</h1>

      <p>Browse ready-made projects or request a custom solution.</p>

      {/* Custom Project Button */}

      <button
        className="custom-project-btn"
        onClick={openCustomModal}
      >
        Request Custom Project
      </button>

      {/* Filters */}

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

      {/* Project Cards */}

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div className="project-card" key={project._id || project.id}>

            {project.images && project.images.length > 0 && (
              <img
                src={`${url}${project.images[0]}`}
                alt={project.title}
                className="portfolio-cover"
              />
            )}
            <h3>{project.title}</h3>
            <p className="domain">{project.category}</p>

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
              <button className="view-details-btn" onClick={() => openDetailsModal(project)}>
                View Details
              </button>
              <button
                className="request-btn"
                onClick={() => openProjectModal(project.title)}
              >
                Request This Project
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Ready Project Modal */}

      {showProjectModal && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Project Request</h2>

            <form onSubmit={handleReadySubmit}>

              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />

              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />

              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />

              <input type="text" value={selectedProject} readOnly />

              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Project Requirements"
                rows="4"
              ></textarea>

              <button className="submit-btn">Submit</button>

              <button
                type="button"
                className="close-btn"
                onClick={closeProjectModal}
              >
                Close
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Custom Project Modal */}

      {showCustomModal && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Request Custom Project</h2>

            <form onSubmit={handleCustomSubmit}>

              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />

              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />

              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />

              <input type="text" name="projectDomain" value={formData.projectDomain} onChange={handleChange} placeholder="Project Domain (Web / AI / Mobile)" required />

              <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Estimated Budget (₹)" required />

              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Describe your project idea"
                rows="4"
                required
              ></textarea>

              <button className="submit-btn">
                Submit Request
              </button>

              <button
                type="button"
                className="close-btn"
                onClick={closeCustomModal}
              >
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
              {viewProject.video && (
                <div className="video-container">
                  <video controls>
                    <source src={`${url}${viewProject.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {viewProject.images && viewProject.images.length > 0 && (
                <div className="image-grid">
                  {viewProject.images.map((img, idx) => (
                    <img key={idx} src={`${url}${img}`} alt={`${viewProject.title} ${idx + 1}`} />
                  ))}
                </div>
              )}
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

export default Projects;