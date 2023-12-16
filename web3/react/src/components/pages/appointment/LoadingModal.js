import React from 'react';
import './LoadingModal.css'; // Import the CSS for styling

const LoadingModal = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <div className="loading-modal-overlay">
            <div className="loading-modal-content">
                <div className="loading-spinner"></div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default LoadingModal;
