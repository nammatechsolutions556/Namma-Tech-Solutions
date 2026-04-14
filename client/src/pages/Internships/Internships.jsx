import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import ApplicationModal from "../../components/ApplicationModal/ApplicationModal";
import "./Internships.css";

const InternshipCard = ({ item, openModal }) => {
    const navigate = useNavigate();
    const durationsArray = item.durations || [];
    const defaultDuration = durationsArray.length > 0 ? durationsArray[0].duration : "";
    const [selectedDur, setSelectedDur] = useState(defaultDuration);

    const currentDurationObj = durationsArray.find(d => d.duration === selectedDur);
    const price = currentDurationObj ? currentDurationObj.price : "N/A";

    const handleCardClick = () => {
        navigate(`/internships/${item._id}`);
    };

    const handleApplyClick = (e) => {
        e.stopPropagation();
        openModal(item.title, selectedDur, price);
    };

    const handleDurationChange = (e) => {
        e.stopPropagation();
        setSelectedDur(e.target.value);
    };

    return (
        <div className="internship-card" onClick={handleCardClick}>
            <h3>{item.title}</h3>
            <div
                className="html-description-preview"
                dangerouslySetInnerHTML={{ __html: item.description }}
            />

            {/* Duration Dropdown */}
            {durationsArray.length > 0 && (
                <div className="duration-selector" onClick={(e) => e.stopPropagation()}>
                    <label>Duration</label>
                    <select
                        value={selectedDur}
                        onChange={handleDurationChange}
                    >
                        {durationsArray.map((d, i) => (
                            <option key={i} value={d.duration}>
                                {d.duration}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Price */}
            <p className="price">
                Price: <strong>{price}</strong>
            </p>

            <p className="certificate">
                Certificates: Internship + Project Completion
            </p>

            <button
                className="apply-btn"
                onClick={handleApplyClick}
            >
                Apply Now
            </button>
        </div>
    );
};

const Internships = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Dynamic DB Internships
    const [internships, setInternships] = useState([]);

    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get(`${url}/api/internships`);
                setInternships(response.data);
            } catch (error) {
                console.error("Failed to load internships:", error);
            }
        };
        fetchInternships();
    }, [url]);

    // Filter logic
    const filteredInternships = useMemo(() => {
        return internships.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, internships]);

    // Handle outside click to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const suggestions = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return internships
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => item.title)
            .slice(0, 5);
    }, [searchTerm, internships]);

    const openModal = (domain, duration, price) => {
        const token = localStorage.getItem("nts_token");
        if (!token) {
            alert("Please login to apply for an internship.");
            navigate("/login");
            return;
        }
        setSelectedDomain(domain);
        setSelectedDuration(duration);
        setSelectedPrice(price);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="internship-page">
            <h1>Internship Programs</h1>
            <p>Select duration to see the price. Click on any program to view full details.</p>

            <div className="search-container" ref={searchRef}>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for internships..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm("")}>×</button>
                    )}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    setShowSuggestions(false);
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="internship-grid">
                {filteredInternships.length > 0 ? (
                    filteredInternships.map((item, index) => (
                        <InternshipCard
                            key={item._id || index}
                            item={item}
                            openModal={openModal}
                        />
                    ))
                ) : (
                    <div className="no-results">No internships found matching "{searchTerm}"</div>
                )}
            </div>

            <ApplicationModal 
                show={showModal}
                closeModal={closeModal}
                selectedDomain={selectedDomain}
                selectedDuration={selectedDuration}
                selectedPrice={selectedPrice}
                url={url}
            />
        </div>
    );
};

export default Internships;