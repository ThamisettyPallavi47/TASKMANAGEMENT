import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import "./styles/ModernAuth.css";
import logoCircle from "../assets/logo-circle.png";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* 🔐 PASSWORD VALIDATION */
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  // 🆔 Student ID → 10 chars, alphanumeric
  const validateStudentId = (id) => {
    const regex = /^[A-Z0-9]{10}$/;
    return regex.test(id);
  };

  /* 📧 GMAIL VALIDATION */
  const validateEmail = (email) => {
    return email.endsWith("@gmail.com");
  };

  /* 🔄 HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form };

    if (name === "studentId") {
      updatedForm[name] = value.toUpperCase();
    } else {
      updatedForm[name] = value;
    }

    setForm(updatedForm);

    if (name === "studentId") {
      if (!validateStudentId(value)) {
        setErrorMessage("Student ID must be 10 chars, alphanumeric");
      } else {
        setErrorMessage("");
      }
    }

    if (name === "password") {
      if (!validatePassword(value)) {
        setErrorMessage("Password must be at least 8 chars, include 1 uppercase, 1 number, 1 special char");
      } else {
        setErrorMessage("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        setErrorMessage("Passwords do not match");
      } else {
        setErrorMessage("");
      }
    }

    if (name === "email") {
      if (!validateEmail(value)) {
        setErrorMessage("Email must end with @gmail.com");
      } else {
        setErrorMessage("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setErrorMessage("Email must end with @gmail.com");
      return;
    }

    if (!validatePassword(form.password)) {
      setErrorMessage("Password requirement not met");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await authService.signup(form);
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
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

          <h1>Join the learning<br />revolution.</h1>
          <p>Create your account to start organized task tracking and productivity management.</p>

          <div className="auth-features">
            <div className="feature-item">
              <span className="material-icons" style={{ fontSize: '16px' }}>check_circle</span>
              Student Dashboard
            </div>
            <div className="feature-item">
              <span className="material-icons" style={{ fontSize: '16px' }}>check_circle</span>
              Progress Tracking
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Create Account</h2>
            <p className="sub-text">Fill in your details to get started.</p>

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
                    name="studentId"
                    placeholder="Eg: STU1234567"
                    required
                    value={form.studentId}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">person</span>
                  <input
                    name="username"
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">email</span>
                  <input
                    name="email"
                    placeholder="name@gmail.com"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">lock</span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    required
                    onChange={handleChange}
                  />
                  <span
                    className="toggle-password material-icons"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">lock_outline</span>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    onChange={handleChange}
                  />
                  <span
                    className="toggle-password material-icons"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="input-group">
                <label>Role</label>
                <div className="input-wrapper">
                  <span className="material-icons input-icon">group</span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="signup-btn">Sign Up</button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
