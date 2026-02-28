import React, { useState, useEffect } from "react";
import "./AdminProfile.css";

const AdminProfile = () => {
    const [adminName, setAdminName] = useState("Admin");
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Attempt to get name from local storage or use default
        const storedName = localStorage.getItem("username");
        if (storedName) {
            setAdminName(storedName);
        }
    }, []);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const firstLetter = adminName.charAt(0).toUpperCase();

    return (
        <div className="admin-profile-container" onClick={toggleDetails}>
            <div className="profile-text-group">
                <span className="portal-name-large">AdminPortal</span>
                <span className="admin-name-small">{adminName}</span>
            </div>

            <div className="profile-avatar-square">
                {firstLetter}
            </div>

            {showDetails && (
                <div className="profile-dropdown">
                    <p><strong>Name:</strong> {adminName}</p>
                    <p><strong>Role:</strong> Administrator</p>
                    <p><strong>Status:</strong> Active</p>
                    {/* Add logout or other details here if needed */}
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
