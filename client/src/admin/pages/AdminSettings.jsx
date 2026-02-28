
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/authHeader";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminSettings.css";
import { LogOut } from "lucide-react";

const EyeIcon = ({ open }) => {
  return open ? (
    /* 👁 Eye Open */
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    /* 🚫 Eye Closed */
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 1.42-.42" />
      <path d="M9.88 5.08A9.77 9.77 0 0 1 12 5c6 0 10 7 10 7a18.36 18.36 0 0 1-3.22 4.33" />
      <path d="M6.61 6.61A18.36 18.36 0 0 0 2 12s4 7 10 7a9.77 9.77 0 0 0 2.12-.23" />
    </svg>
  );
};

const AdminSettings = () => {
  const navigate = useNavigate();

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    studentId: "",
    role: "",
  });

  const [editProfile, setEditProfile] = useState(false);

  /* ================= PASSWORD ================= */
  const [editPassword, setEditPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: authHeader(),
      })
      .then((res) => setProfile(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  /* ================= PASSWORD VALIDATION ================= */
  const validatePasswordLive = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain one uppercase letter";
    if (!/\d/.test(password)) return "Must contain one number";
    if (!/[@$!%*?&]/.test(password))
      return "Must contain one special character";
    return "";
  };

  /* ================= PROFILE UPDATE ================= */
  const handleProfileSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/profile",
        profile,
        { headers: authHeader() }
      );
      setEditProfile(false);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= PASSWORD UPDATE ================= */
  const handlePasswordChange = async () => {
    setMessage("");

    if (!passwordForm.oldPassword) {
      setMessage("Old password is required");
      return;
    }

    if (passwordError) {
      setMessage("Fix password errors before submitting");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/user/change-password",
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: authHeader() }
      );

      localStorage.clear();
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AdminLayout>
      <div className="settings-wrapper">

        {/* HEADER SECTION */}
        <div className="settings-header">
          <div>
            <h2 className="page-title">Settings</h2>
            <p className="page-subtitle">Manage your profile and security preferences</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="settings-container">
          {/* ================= PROFILE SETTINGS ================= */}
          <div className="settings-card">
            <div className="card-header">
              <h3>Profile Settings</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  editProfile ? handleProfileSave() : setEditProfile(true)
                }
              >
                {editProfile ? "Save Changes" : "Edit"}
              </button>
            </div>

            <div className="profile-edit-grid">
              <div className="profile-fields">
                <label>Full Name</label>
                <input
                  className="animated-input"
                  value={profile.username}
                  disabled={!editProfile}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                />

                <label>Email Address</label>
                <input
                  className="animated-input"
                  value={profile.email}
                  disabled={!editProfile}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />

                <label>Admin ID</label>
                <input className="animated-input" value={profile.studentId} disabled />

                <label>Role</label>
                <input className="animated-input" value={profile.role} disabled />
              </div>
            </div>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="settings-card">
            <div className="card-header">
              <h3>Change Password</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  editPassword
                    ? handlePasswordChange()
                    : setEditPassword(true)
                }
              >
                {editPassword ? "Save" : "Edit"}
              </button>
            </div>

            {/* OLD PASSWORD */}
            <div className="password-field">
              <label className="password-label-sm">Old Password</label>
              <input
                className="animated-input"
                type={showPassword.old ? "text" : "password"}
                disabled={!editPassword}
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />
              <span
                className="toggle-eye"
                onClick={() =>
                  setShowPassword({ ...showPassword, old: !showPassword.old })
                }
              >
                <EyeIcon open={showPassword.old} />
              </span>
            </div>

            {/* NEW PASSWORD */}
            <div className="password-field">
              <label className="password-label-sm">New Password</label>
              <input
                className="animated-input"
                type={showPassword.new ? "text" : "password"}
                disabled={!editPassword}
                value={passwordForm.newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setPasswordForm({ ...passwordForm, newPassword: value });
                  setPasswordError(validatePasswordLive(value));
                }}
              />
              <span
                className="toggle-eye"
                onClick={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
              >
                <EyeIcon open={showPassword.new} />
              </span>
            </div>

            {passwordError && <p className="error-text">{passwordError}</p>}

            {/* CONFIRM PASSWORD */}
            <div className="password-field">
              <label className="password-label-sm">Confirm Password</label>
              <input
                className="animated-input"
                type={showPassword.confirm ? "text" : "password"}
                disabled={!editPassword}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <span
                className="toggle-eye"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
              >
                <EyeIcon open={showPassword.confirm} />
              </span>
            </div>
          </div>
        </div>

        {message && <p className="global-message">{message}</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
