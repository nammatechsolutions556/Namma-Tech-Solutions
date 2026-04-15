import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import "./ManageProjects.css";

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        price: "",
    });

    const [video, setVideo] = useState(null);
    const [existingVideo, setExistingVideo] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await api.get("projects");
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked, starting validation...");

        // Validation
        if (!form.title || !form.category || !form.price || !form.description) {
            alert("Please fill in all required fields (Title, Category, Price, and Description).");
            return;
        }

        setIsSubmitting(true);
        console.log("Validation passed, constructing FormData...");

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("price", form.price);

        // Append new video
        if (video) {
            formData.append("video", video);
        }

        // Check for base64 images in the description (bloat)
        if (form.description.includes("data:image/") && form.description.includes(";base64,")) {
            alert("Warning: The description contains embedded images which are too large for the portal. Please remove the images from the text editor and upload them using the 'Upload Images' button instead.");
            setIsSubmitting(false);
            return;
        }

        // Append existing media if editing
        if (editingId) {
            if (existingVideo) {
                formData.append("existingVideo", existingVideo);
            }
        }

        try {
            console.log("Sending request to backend...");
            if (editingId) {
                await api.put(`projects/${editingId}`, formData);
                alert("Project updated successfully!");
            } else {
                await api.post("projects", formData);
                alert("Project added successfully!");
            }

            // Only clear and refresh on success
            setForm({ title: "", category: "", description: "", price: "" });
            setVideo(null);
            setExistingVideo(null);
            setEditingId(null);
            fetchProjects();
        } catch (error) {
            console.error("Error saving project", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to save project. Please check if you are logged in and try again.";
            alert(`Submission Error: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            category: project.category,
            description: project.description,
            price: project.price
        });
        setExistingVideo(project.video || null);
        setEditingId(project._id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project", error);
        }
    };

    return (
        <div className="manage-projects-container">
            <h2>Manage Projects</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Project Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <input
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <div className="rich-text-editor">
                    <ReactQuill
                        theme="snow"
                        value={form.description}
                        onChange={(content) => setForm({ ...form, description: content })}
                        placeholder="Write a detailed project description..."
                    />
                </div>

                <div className="file-upload-section">
                    <p>Current Video: {existingVideo ? "Yes" : "None"}</p>
                    <label>Upload Video (Optional, Max 1):</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : (editingId ? "Update Project" : "Add Project")}
                    </button>

                </div>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((p) => (
                        <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>{p.category}</td>
                            <td>{p.price}</td>

                            <td>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProjects;