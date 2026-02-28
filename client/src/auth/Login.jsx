

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import "./styles/ModernAuth.css";
import logoCircle from "../assets/logo-circle.png";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await authService.login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Login failed"
      );
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

          <h1>Elevate your learning<br />journey.</h1>
          <p>The all-in-one educational task management dashboard designed for modern students.</p>

          <div className="auth-features">
            <div className="feature-item">
              <span className="material-icons" style={{ fontSize: '16px' }}>check_circle</span>
              Task Tracking
            </div>
            <div className="feature-item">
              <span className="material-icons" style={{ fontSize: '16px' }}>check_circle</span>
              Analytics
            </div>
            <div className="feature-item">
              <span className="material-icons" style={{ fontSize: '16px' }}>check_circle</span>
              Productivity
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p className="sub-text">Please enter your details to sign in to your account.</p>

            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Student ID */}
              <div className="input-group">
                <label>Student ID</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">badge</span>
                  <input
                    placeholder="Enter Student ID"
                    required
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        studentId: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <span
                    className="toggle-password material-icons"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="login-btn">Login</button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Sign Up</Link>
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

export default Login;
