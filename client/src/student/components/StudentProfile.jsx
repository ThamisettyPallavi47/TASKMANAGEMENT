import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const StudentProfile = () => {
    const [studentName, setStudentName] = useState("Student");
    const [studentDetails, setStudentDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setStudentName(response.data.username);
                    setStudentDetails(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };

        fetchProfile();
    }, []);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const firstLetter = studentName.charAt(0).toUpperCase();

    return (
        <div className="student-profile-container" onClick={toggleDetails}>
            <div className="profile-text-group">
                <span className="portal-name-large">Student Portal</span>
                <span className="student-name-small">{studentName}</span>
            </div>

            <div className="profile-avatar-square">
                {firstLetter}
            </div>

            {showDetails && (
                <div className="profile-dropdown">
                    <p><strong>Name:</strong> {studentName}</p>
                    {studentDetails && (
                        <>
                            <p><strong>ID:</strong> {studentDetails.studentId}</p>
                            <p><strong>Email:</strong> {studentDetails.email}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
