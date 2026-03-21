import React, { useState, useEffect } from "react";
import api from "../../services/api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./ManageInternships.css";

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [durations, setDurations] = useState([{ duration: "", price: "" }]);

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const [editingId, setEditingId] = useState(null);

    const fetchInternships = async () => {
        try {
            const res = await api.get("/internships");
            setInternships(res.data);
        } catch (error) {
            console.error("Error fetching internships:", error);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const addDuration = () => {
        setDurations([...durations, { duration: "", price: "" }]);
    };

    const updateDuration = (index, field, value) => {
        const updated = [...durations];
        updated[index][field] = value;
        setDurations(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            durations,
        };

        try {
            if (editingId) {
                await api.put(`/internships/${editingId}`, payload);
            } else {
                await api.post("/internships", payload);
            }
        } catch (error) {
            console.error("Failed to save internship data:", error);
        }

        setForm({ title: "", description: "" });
        setDurations([{ duration: "", price: "" }]);
        setEditingId(null);

        fetchInternships();
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/internships/${id}`);
            fetchInternships();
        } catch (error) {
            console.error("Failed to delete internship:", error);
        }
    };

    return (
        <div className="manage-internships-container">
            <h2>Manage Internships</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Internship Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <div style={{ marginBottom: "1.5rem" }}>
                    <ReactQuill
                        theme="snow"
                        value={form.description}
                        onChange={(content) =>
                            setForm({ ...form, description: content })
                        }
                        placeholder="Detailed internship description..."
                    />
                </div>

                <h4>Durations & Price</h4>

                {durations.map((d, i) => (
                    <div key={i}>
                        <input
                            placeholder="Duration"
                            value={d.duration}
                            onChange={(e) =>
                                updateDuration(i, "duration", e.target.value)
                            }
                        />

                        <input
                            placeholder="Price"
                            value={d.price}
                            onChange={(e) =>
                                updateDuration(i, "price", e.target.value)
                            }
                        />
                    </div>
                ))}

                <button type="button" onClick={addDuration}>
                    Add Duration
                </button>

                <button type="submit">
                    {editingId ? "Update Internship" : "Add Internship"}
                </button>
            </form>

            <ul>
                {internships.map((i) => (
                    <li key={i._id}>
                        {i.title}
                        <button onClick={() => handleDelete(i._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageInternships;