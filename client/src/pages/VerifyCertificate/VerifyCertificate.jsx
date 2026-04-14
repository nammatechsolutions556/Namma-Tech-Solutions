import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
    const { referenceNumber } = useParams();
    const { url } = useContext(StoreContext);
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.get(`${url}/api/certificates/verify/${referenceNumber}`);
                setCertificate(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Verification failed. Please try again.");
                setLoading(false);
            }
        };
        verify();
    }, [referenceNumber, url]);

    if (loading) {
        return (
            <div className="verify-page">
                <div className="verify-container loading">
                    <div className="spinner"></div>
                    <p>Verifying Certificate authenticity...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="verify-page">
                <div className="verify-container error">
                    <div className="error-icon">❌</div>
                    <h1>Verification Failed</h1>
                    <p className="error-message">{error}</p>
                    <p className="warning-text">This certificate is not issued by Namma Tech Solutions. Please beware of fraudulent documents.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-page">
            <div className="verify-container success">
                <div className="success-icon">✅</div>
                <h1>Certificate Verified</h1>
                <p className="subtitle">This certificate is authentic and was issued by Namma Tech Solutions.</p>
                
                <div className="certificate-details">
                    <div className="detail-row">
                        <span>Candidate Name:</span>
                        <strong>{certificate.name}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Certificate Type:</span>
                        <strong>{certificate.cert_type}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Domain:</span>
                        <strong>{certificate.domain || certificate.internship}</strong>
                    </div>
                    {certificate.project_title && (
                        <div className="detail-row">
                            <span>Project:</span>
                            <strong>{certificate.project_title}</strong>
                        </div>
                    )}
                    <div className="detail-row">
                        <span>University:</span>
                        <strong>{certificate.university}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Reference No:</span>
                        <strong>{certificate.reference_number}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Issue Date:</span>
                        <strong>{new Date(certificate.created_at).toLocaleDateString()}</strong>
                    </div>
                </div>

                <div className="verify-actions">
                    <a 
                        href={`${url}${certificate.certificateUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="view-btn"
                        download={`${certificate.name.replace(/\s+/g, '_')}_Certificate.pdf`}
                    >
                        View Original Certificate (PDF)
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
