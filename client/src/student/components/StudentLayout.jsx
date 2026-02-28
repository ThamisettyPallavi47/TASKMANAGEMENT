import { useNavigate, useLocation } from "react-router-dom";
import "../pages/styles/StudentDashboard.css";
// import logoCircle from "../../assets/logo-circle.png"; // Removing old logo
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  BarChart2,
  CheckCircle,
  Settings,
  Plus
} from "lucide-react";
import StudentProfile from "./StudentProfile";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">

        {/* BRAND */}
        <div className="brand-logo">

          <span className="brand-text">StudiIn</span>
        </div>

        {/* MENU */}
        <ul className="menu">
          <li
            className={`menu-item ${isActive("/student") ? "active" : ""}`}
            onClick={() => navigate("/student")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </li>

          <li
            className={`menu-item ${isActive("/student/tasks") ? "active" : ""}`}
            onClick={() => navigate("/student/tasks")}
          >
            <ClipboardList size={20} />
            <span>My Tasks</span>
          </li>

          <li
            className={`menu-item ${isActive("/student/progress") ? "active" : ""}`}
            onClick={() => navigate("/student/progress")}
          >
            <TrendingUp size={20} />
            <span>Progress</span>
          </li>

          <li
            className={`menu-item ${isActive("/student/completed-tasks") ? "active" : ""}`}
            onClick={() => navigate("/student/completed-tasks")}
          >
            <CheckCircle size={20} />
            <span>Completed Tasks</span>
          </li>

          <li
            className={`menu-item ${isActive("/student/analytics") ? "active" : ""}`}
            onClick={() => navigate("/student/analytics")}
          >
            <BarChart2 size={20} />
            <span>Analytics</span>
          </li>

          <li
            className={`menu-item ${isActive("/student/settings") ? "active" : ""}`}
            onClick={() => navigate("/student/settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>

        {/* BOTTOM BUTTON */}
        <div className="sidebar-footer">
          <button
            className="assign-btn"
            onClick={() => navigate("/student/add-task")}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

      </aside>

      <main className="main-content">
        {location.pathname !== "/student/settings" &&
          location.pathname !== "/student/task-summary" && (
            <StudentProfile />
          )}
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
