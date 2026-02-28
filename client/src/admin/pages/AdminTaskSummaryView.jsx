import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Calendar, ChevronLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminTaskSummary.css";

const AdminTaskSummaryView = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // read query params
  const params = new URLSearchParams(location.search);
  const status = params.get("status"); // ALL | PENDING | IN_PROGRESS | COMPLETED

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data));
  }, [token]);

  /* ================= FILTER LOGIC ================= */
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // status filter logic
    if (status === "PENDING") {
      result = result.filter((t) => t.progress === 0);
    }
    if (status === "IN_PROGRESS") {
      result = result.filter((t) => t.progress > 0 && t.progress < 100);
    }
    if (status === "COMPLETED") {
      result = result.filter((t) => t.progress === 100);
    }

    return result;
  }, [tasks, status]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <AdminLayout>
      <div className="summary-container">
        <div className="summary-header">
          <div>
            <h2>Admin Task Summary</h2>
            <p className="showing-text">
              Showing <b>{status || "ALL"}</b> admin tasks
            </p>
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> BACK
          </button>
        </div>

        {filteredTasks.length === 0 && (
          <div className="no-tasks">
            <p>No tasks found for this category.</p>
          </div>
        )}

        <div className="summary-grid">
          {filteredTasks.map((task) => (
            <div key={task._id} className="task-card-modern">
              <div className="card-top">
                <span className="task-badge badge-admin">
                  ADMIN
                </span>
              </div>

              <h4 className="task-title">{task.title}</h4>
              <p className="task-desc">{task.description}</p>

              <div className="task-meta">
                <div className="date-row">
                  <Calendar size={14} />
                  <span>Due: {formatDate(task.endDate)}</span>
                </div>
                <div className="date-row" style={{ marginTop: '5px' }}>
                  <User size={14} />
                  <span>Student ID: {task.studentId}</span>
                </div>
              </div>

              <div className="task-progress-row">
                <div className="progress-label">
                  <span>Progress</span>
                  <span className="percent">{task.progress}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: "#6366f1"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTaskSummaryView;
