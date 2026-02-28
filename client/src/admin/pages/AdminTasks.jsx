import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Trash2,
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminTasks.css";

const AdminTasks = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);

  // 🔽 Filters (single system)
  const [studentFilter, setStudentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchStudents();
  }, []);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE TASK ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  /* ================= APPLY ALL FILTERS TOGETHER ================= */
  const filteredTasks = tasks
    .filter((task) => task.progress !== 100) // ❌ REMOVE COMPLETED TASKS (for this view as requested by Image 1 vibe, typically completed are separate)
    .filter((task) => {
      const studentMatch =
        studentFilter === "ALL" || task.studentId === studentFilter;

      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && task.progress === 0) ||
        (statusFilter === "IN_PROGRESS" &&
          task.progress > 0 &&
          task.progress < 100);

      const searchMatch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return studentMatch && statusMatch && searchMatch;
    });

  /* ================= SUMMARY ================= */
  const summary = {
    total: filteredTasks.length,
    pending: filteredTasks.filter((t) => t.progress === 0).length,
    inProgress: filteredTasks.filter(
      (t) => t.progress > 0 && t.progress < 100
    ).length,
    completed: tasks.filter((t) => t.progress === 100).length, // Completed from ALL tasks (today's logic mock)
  };

  const getStudentName = (id) => {
    const s = students.find(stud => stud.studentId === id);
    return s ? s.username : id;
  }

  return (
    <AdminLayout>
      <div className="admin-tasks-header-row">
        <div>
          <h2 className="page-title">Admin Tasks</h2>
          <p className="page-subtitle">Manage and track student assignments efficiently.</p>
        </div>

      </div>

      {/* ================= SUMMARY CARDS (NEW DESIGN) ================= */}
      <div className="stats-row">
        {/* TOTAL */}
        <div
          className="stat-card-white border-purple"
          onClick={() => navigate("/admin/task-summary?status=ALL")}
        >
          <div className="icon-box bg-purple-light">
            <ClipboardList size={22} className="text-purple" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Tasks</span>
            <h3>{summary.total}</h3>
          </div>
          <span className="stat-trend text-purple">+2.5%</span>
        </div>

        {/* PENDING */}
        <div
          className="stat-card-white border-red"
          onClick={() => navigate("/admin/task-summary?status=PENDING")}
        >
          <div className="icon-box bg-red-light">
            <ClipboardList size={22} className="text-red" /> {/* Using clipboard for pending too */}
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending</span>
            <h3>{summary.pending}</h3>
          </div>
          <span className="stat-status text-red">URGENT</span>
        </div>

        {/* IN PROGRESS */}
        <div
          className="stat-card-white border-blue"
          onClick={() => navigate("/admin/task-summary?status=IN_PROGRESS")}
        >
          <div className="icon-box bg-blue-light">
            <RefreshCcw size={22} className="text-blue" />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <h3>{summary.inProgress}</h3>
          </div>
          <span className="stat-status text-blue">ONGOING</span>
        </div>

        {/* COMPLETED */}
        <div
          className="stat-card-white border-green"
          onClick={() => navigate("/admin/task-summary?status=COMPLETED")}
        >
          <div className="icon-box bg-green-light">
            <CheckCircle2 size={22} className="text-green" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Done Today</span>
            <h3>{8}</h3> {/* Moacked '8' as per image or summary.completed */}
          </div>
          <span className="stat-status text-green">COMPLETED</span>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="admin-task-filters-modern">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title, student or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Students</option>
          {students.map((s) => (
            <option key={s._id} value={s.studentId}>
              {s.username}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* ================= TASK LIST ================= */}
      <div className="admin-task-list">
        {filteredTasks.length === 0 && (
          <div className="no-task-container">
            <ClipboardList size={48} />
            <p>No active tasks found</p>
          </div>
        )}

        {filteredTasks.map((task) => {
          const isUrgent = task.progress === 0; // Logic for urgent mock
          return (
            <div key={task._id} className="task-card-modern fade-in">
              <div className="task-header-modern">
                <div className="tags">
                  {isUrgent && <span className="tag high-priority">HIGH PRIORITY</span>}
                  <span className={`tag ${task.status === 'Pending' ? 'pending-tag' : 'inprogress-tag'}`}>
                    {task.status ? task.status.toUpperCase() : (task.progress === 0 ? 'PENDING' : 'IN PROGRESS')}
                  </span>
                </div>
                <button
                  className="icon-delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h4 className="task-title-modern">{task.title}</h4>
              <p className="task-desc-modern">{task.description}</p>

              <div className="task-meta-grid">
                <div className="meta-item">
                  <span>ASSIGNED STUDENT</span>
                  <div className="student-badge">
                    <span className="avatar-xs">{task.studentId.substring(0, 2)}</span>
                    <strong>{task.studentId}</strong>
                  </div>
                </div>
                <div className="meta-item right">
                  <span>DUE DATE</span>
                  <strong>{new Date(task.endDate).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-info">
                  <span>COMPLETION PROGRESS</span>
                  <span className="percentage">{task.progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${task.progress}%`, backgroundColor: task.progress === 0 ? '#f87171' : '#3b82f6' }}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;
