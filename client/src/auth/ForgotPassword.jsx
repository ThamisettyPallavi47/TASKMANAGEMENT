import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./styles/ModernAuth.css";
import logoCircle from "../assets/logo-circle.png";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!email.endsWith("@gmail.com")) {
            setError("Please enter a valid Gmail address.");
            setLoading(false);
            return;
        }

        try {
            await authService.forgotPassword({ email });
            setMessage("Verification code sent to your email.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await authService.resetPassword({ email, otp, password });
            setMessage("Password updated successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modern-auth-container">
            <div className="auth-card-wrapper">
                {/* LEFT PANEL */}
                <div className="auth-left">
                    <div className="auth-brand">
                        <div className="brand-icon">
                            <img src={logoCircle} alt="Logo" />
                        </div>
                        <span className="brand-text">StudiIn</span>
                    </div>

                    <h1>Secure your<br />account.</h1>
                    <p>Reset your password to regain access to your dashboard.</p>
                </div>

                {/* RIGHT PANEL */}
                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2>Forgot Password?</h2>
                        <p className="sub-text">
                            {step === 1
                                ? "Enter your email to receive a verification code."
                                : "Enter the code sent to your email and your new password."}
                        </p>

                        {message && <p className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
                        {error && <p className="error-message">{error}</p>}

                        {step === 1 ? (
                            <form onSubmit={handleSendEmail}>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <span className="material-icons input-icon">email</span>
                                        <input
                                            type="email"
                                            placeholder="name@gmail.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? "Sending..." : "Send Verification Code"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="input-group">
                                    <label>Verification Code (OTP)</label>
                                    <div className="input-wrapper">
                                        <span className="material-icons input-icon">vpn_key</span>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>New Password</label>
                                    <div className="input-wrapper">
                                        <span className="material-icons input-icon">lock</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            className="toggle-password material-icons"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Confirm Password</label>
                                    <div className="input-wrapper">
                                        <span className="material-icons input-icon">lock_clock</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        )}

                        <div className="auth-footer">
                            Remember your password? <Link to="/login">Login</Link>
                        </div>

                        <div className="bottom-copyright">
                            © {new Date().getFullYear()} StudiIn Learning Systems. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
