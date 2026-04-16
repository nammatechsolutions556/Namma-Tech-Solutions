import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import "./ManagePortfolio.css";

const ManagePortfolio = () => {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        price: "",
        completed_date: ""
    });

    const videoInputRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [existingVideo, setExistingVideo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editingId, setEditingId] = useState(null);

    const fetchPortfolioProjects = async () => {
        try {
            const res = await api.get("portfolio");
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching portfolio projects", error);
        }
    };

    useEffect(() => {
        fetchPortfolioProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Portfolio submit button clicked...");

        if (!form.title || !form.category || !form.description) {
            alert("Please fill in all required fields (Title, Category, and Description).");
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        console.log("Validation passed, constructing FormData for portfolio...");

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("completed_date", form.completed_date);

        if (video) formData.append("video", video);
        if (editingId && existingVideo) formData.append("existingVideo", existingVideo);

        try {
            console.log("Sending portfolio request to backend...");

            const axiosConfig = {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                        console.log(`Portfolio Upload Progress: ${percentCompleted}%`);
                    }
                }
            };

            if (editingId) {
                await api.put(`portfolio/${editingId}`, formData, axiosConfig);
                alert("Portfolio project updated successfully!");
            } else {
                await api.post("portfolio", formData, axiosConfig);
                alert("Portfolio project added successfully!");
            }

            setForm({ title: "", category: "", description: "", price: "", completed_date: "" });
            setVideo(null);
            setExistingVideo(null);
            setEditingId(null);
            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }
            fetchPortfolioProjects();
        } catch (error) {
            console.error("Error saving portfolio project", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to save project. Please check network logs.";
            alert(`Submission Error: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            category: project.category,
            description: project.description,
            price: project.price || "",
            completed_date: project.completed_date ? project.completed_date.split('T')[0] : ""
        });
        setExistingVideo(project.video || null);
        setEditingId(project._id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`portfolio/${id}`);
            fetchPortfolioProjects();
        } catch (error) {
            console.error("Error deleting portfolio project", error);
        }
    };

    return (
        <div className="manage-portfolio-container">
            <h2>Manage Portfolio Projects</h2>

            <form onSubmit={handleSubmit} className="portfolio-form">
                <div className="form-group">
                    <input
                        placeholder="Project Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Category (e.g., Web Development)"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        placeholder="Price (Optional)"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Completed Date"
                        value={form.completed_date}
                        onChange={(e) => setForm({ ...form, completed_date: e.target.value })}
                    />
                </div>

                <div className="rich-text-editor">
                    <ReactQuill
                        theme="snow"
                        value={form.description}
                        onChange={(content) => setForm({ ...form, description: content })}
                        placeholder="Write a detailed project description..."
                    />
                </div>

                <div className="file-upload-section">
                    <div className="upload-group">
                        <p>Current Video: {existingVideo ? "Yes" : "None"}</p>
                        <label>Upload Video (Optional, Max 1):</label>
                        <input
                            type="file"
                            accept="video/*"
                            ref={videoInputRef}
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting 
                        ? (uploadProgress > 0 ? `Processing (${uploadProgress}%)...` : "Processing...") 
                        : (editingId ? "Update Portfolio Project" : "Add Portfolio Project")}
                </button>
            </form>

            <table className="portfolio-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Completed Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((p) => (
                        <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>{p.category}</td>
                            <td>{p.completed_date ? new Date(p.completed_date).toLocaleDateString() : 'N/A'}</td>

                            <td>
                                <button className="edit-action" onClick={() => handleEdit(p)}>Edit</button>
                                <button className="delete-action" onClick={() => handleDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePortfolio;
