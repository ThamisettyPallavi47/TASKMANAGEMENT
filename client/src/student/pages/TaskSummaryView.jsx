import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import StudentLayout from "../components/StudentLayout";
import { Calendar } from "lucide-react";
import "./styles/MyTasks.css"; // Reuse modern styles

const TaskSummaryView = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // read query params
  const params = new URLSearchParams(location.search);
  const status = params.get("status"); // ALL | PENDING | IN_PROGRESS | COMPLETED
  const type = params.get("type");     // ALL | PERSONAL | ADMIN

  useEffect(() => {
    taskService.getMyTasks().then(res => setTasks(res.data));
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // type filter
    if (type === "PERSONAL") {
      result = result.filter(
        t => t.taskType === "PERSONAL" || !t.taskType
      );
    }

    if (type === "ADMIN") {
      result = result.filter(t => t.taskType === "ADMIN");
    }

    // status filter
    if (status === "PENDING") {
      result = result.filter(t => t.progress === 0);
    }

    if (status === "IN_PROGRESS") {
      result = result.filter(t => t.progress > 0 && t.progress < 100);
    }

    if (status === "COMPLETED") {
      result = result.filter(t => t.progress === 100);
    }

    return result;
  }, [tasks, status, type]);

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <StudentLayout>
      <div className="mytasks-container">
        <div className="page-header">
          <div className="header-content">
            <h2>Task Summary</h2>
            <p className="subtitle">
              Showing: <b>{status ? status.replace("_", " ") : "ALL"}</b> tasks
              {type && <> | Type: <b>{type}</b></>}
            </p>
          </div>
          <button className="filter-btn active" onClick={() => navigate(-1)}>⬅ Back</button>
        </div>

        <div className="task-grid">
          {filteredTasks.length === 0 && <p>No tasks found matching criteria.</p>}

          {filteredTasks.map(task => (
            <div key={task._id} className="task-card-modern">
              <div className="card-top">
                <span className={`task-badge ${task.taskType === "ADMIN" ? "badge-admin" : "badge-personal"}`}>
                  {task.taskType || "PERSONAL"}
                </span>
              </div>

              <h4 className="task-title">{task.title}</h4>
              <p className="task-desc">{task.description}</p>

              <div className="task-meta">
                <div className="date-row">
                  <Calendar size={14} />
                  <span>Due: {formatDate(task.endDate)}</span>
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
                      backgroundColor: task.taskType === "ADMIN" ? "#6366f1" : "#10b981"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default TaskSummaryView;
