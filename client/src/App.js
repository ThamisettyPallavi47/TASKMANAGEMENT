

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import studentRoutes from "./student/studentRoutes";
import adminRoutes from "./admin/adminRoutes";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";

import Footer from "./components/Footer";

import ChatWidget from "./chatbot-integration/ChatWidget";

function App() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <BrowserRouter>
            <Routes>
                {/* ================= AUTH ================= */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ================= STUDENT ROUTES ================= */}
                {studentRoutes.map((route, index) => (
                    <Route
                        key={`student-${index}`}
                        path={route.path}
                        element={
                            token && role === "student"
                                ? route.element
                                : <Navigate to="/login" />
                        }
                    />
                ))}

                {/* ================= ADMIN ROUTES ================= */}
                {adminRoutes.map((route, index) => (
                    <Route
                        key={`admin-${index}`}
                        path={route.path}
                        element={
                            token && role === "admin"
                                ? route.element
                                : <Navigate to="/login" />
                        }
                    />
                ))}

                {/* ================= DEFAULT ================= */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <Footer />
            <ChatWidget />
        </BrowserRouter>
    );
}

export default App;
