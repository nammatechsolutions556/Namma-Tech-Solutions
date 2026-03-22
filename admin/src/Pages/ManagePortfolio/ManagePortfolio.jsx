import React, { useEffect, useState } from "react";
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

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchPortfolioProjects = async () => {
        try {
            const res = await api.get("/portfolio");
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

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("completed_date", form.completed_date);

        // Append new images
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        // Append new videos
        for (let i = 0; i < videos.length; i++) {
            formData.append("videos", videos[i]);
        }

        // Append existing media if editing
        if (editingId) {
            existingImages.forEach(img => formData.append("existingImages", img));
            existingVideos.forEach(vid => formData.append("existingVideos", vid));
        }

        try {
            if (editingId) {
                await api.put(`/portfolio/${editingId}`, formData);
            } else {
                await api.post("/portfolio", formData);
            }
        } catch (error) {
            console.error("Error saving portfolio project", error);
        }

        setForm({ title: "", category: "", description: "", price: "", completed_date: "" });
        setImages([]);
        setVideos([]);
        setExistingImages([]);
        setExistingVideos([]);
        setEditingId(null);
        fetchPortfolioProjects();
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            category: project.category,
            description: project.description,
            price: project.price || "",
            completed_date: project.completed_date ? project.completed_date.split('T')[0] : ""
        });
        setExistingImages(project.images || []);
        setExistingVideos(project.videos || []);
        setEditingId(project._id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/portfolio/${id}`);
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
                        <p>Current Images: {existingImages.length}</p>
                        <label>Upload Images (Max 20):</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 20))}
                        />
                    </div>

                    <div className="upload-group">
                        <p>Current Videos: {existingVideos.length}</p>
                        <label>Upload Videos (Max 2):</label>
                        <input
                            type="file"
                            multiple
                            accept="video/*"
                            onChange={(e) => setVideos(Array.from(e.target.files).slice(0, 2))}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    {editingId ? "Update Portfolio Project" : "Add Portfolio Project"}
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
