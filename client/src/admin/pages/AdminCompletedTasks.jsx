


import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminCompletedTasks.css";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  CheckSquare
} from "lucide-react";

const AdminCompletedTasks = () => {
  const token = localStorage.getItem("token");

  // Icon imports via lucide-react if available, otherwise fallback or ensure package.json has it.
  // Assuming imports are handled at top level. We need to add them.

  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentFilter, setStudentFilter] = useState("ALL");
  const [viewFilter, setViewFilter] = useState("VISIBLE"); // VISIBLE | HIDDEN | ALL

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🔒 Hidden tasks stored locally
  const [hiddenTaskIds, setHiddenTaskIds] = useState(() => {
    return JSON.parse(localStorage.getItem("hiddenCompletedTasks")) || [];
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axios.get("https://taskmanagement-w3gy.onrender.com/api/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const completed = res.data.filter((t) => t.progress === 100);
        setTasks(completed);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "https://taskmanagement-w3gy.onrender.com/api/admin/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchCompletedTasks();
    fetchStudents();
  }, [token]);

  /* ================= HIDE TASK (NO POPUP) ================= */
  const handleHide = (taskId) => {
    const updated = [...hiddenTaskIds, taskId];
    setHiddenTaskIds(updated);
    localStorage.setItem("hiddenCompletedTasks", JSON.stringify(updated));
  };

  /* ================= UNHIDE TASK ================= */
  const handleUnhide = (taskId) => {
    const updated = hiddenTaskIds.filter((id) => id !== taskId);
    setHiddenTaskIds(updated);
    localStorage.setItem("hiddenCompletedTasks", JSON.stringify(updated));
  };

  /* ================= FILTER LOGIC ================= */
  const filteredTasks = tasks.filter((task) => {
    if (studentFilter !== "ALL" && task.studentId !== studentFilter) {
      return false;
    }

    const isHidden = hiddenTaskIds.includes(task._id);

    if (viewFilter === "VISIBLE") return !isHidden;
    if (viewFilter === "HIDDEN") return isHidden;

    return true;
  });

  /* ================= PAGINATION LOGIC ================= */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* ================= STATS CALCULATION ================= */
  // "This Week" - Tasks completed in the last 7 days.
  // Assuming 'endDate' is a valid date string.
  const completedThisWeek = tasks.filter(t => {
    const completedDate = new Date(t.endDate);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return completedDate >= oneWeekAgo;
  }).length;

  const stats = {
    total: tasks.length,
    visible: tasks.length - hiddenTaskIds.length,
    hidden: hiddenTaskIds.length,
    week: completedThisWeek
  };

  // Note: 'visible' stat might be slightly inaccurate if hidden tasks are deleted from DB but IDs remain in local storage, 
  // but for now it's fine based on local state. A better way:
  const actualHiddenCount = tasks.filter(t => hiddenTaskIds.includes(t._id)).length;
  const actualVisibleCount = tasks.length - actualHiddenCount;

  return (
    <AdminLayout>
      <div className="completed-tasks-header">
        <h2 className="page-title">Completed Admin Tasks</h2>
        <p className="page-subtitle">Track and manage completed tasks.</p>
      </div>

      {/* ================= STATS ROW ================= */}
      <div className="stats-row">
        {/* TOTAL */}
        <div className="stat-card-white border-blue">
          <div className="icon-box bg-blue-light">
            <ClipboardList size={22} className="text-blue" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Completed</span>
            <h3>{stats.total}</h3>
          </div>
          <span className="stat-status text-blue">ALL TIME</span>
        </div>

        {/* VISIBLE */}
        <div className="stat-card-white border-green">
          <div className="icon-box bg-green-light">
            <Eye size={22} className="text-green" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Visible Tasks</span>
            <h3>{actualVisibleCount}</h3>
          </div>
          <span className="stat-status text-green">ACTIVE</span>
        </div>

        {/* HIDDEN */}
        <div className="stat-card-white border-red">
          <div className="icon-box bg-red-light">
            <EyeOff size={22} className="text-red" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Hidden Tasks</span>
            <h3>{actualHiddenCount}</h3>
          </div>
          <span className="stat-status text-red">ARCHIVED</span>
        </div>

        {/* THIS WEEK */}
        <div className="stat-card-white border-purple">
          <div className="icon-box bg-purple-light">
            <CheckCircle2 size={22} className="text-purple" />
          </div>
          <div className="stat-details">
            <span className="stat-label">This Week</span>
            <h3>{stats.week}</h3>
          </div>
          <span className="stat-trend text-purple">RECENT</span>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="admin-completed-filter">
        <select
          value={studentFilter}
          onChange={(e) => {
            setStudentFilter(e.target.value);
            setCurrentPage(1); // Reset page on filter change
          }}
        >
          <option value="ALL">All Students</option>
          {students.map((s) => (
            <option key={s._id} value={s.studentId}>
              {s.studentId} - {s.username}
            </option>
          ))}
        </select>

        <select
          value={viewFilter}
          onChange={(e) => {
            setViewFilter(e.target.value);
            setCurrentPage(1); // Reset page on filter change
          }}
          style={{ marginLeft: "10px" }}
        >
          <option value="VISIBLE">Visible Tasks</option>
          <option value="HIDDEN">Hidden Tasks</option>
          <option value="ALL">All Tasks</option>
        </select>
      </div>

      {/* ================= TASK LIST ================= */}
      <div className="completed-task-grid">
        {currentTasks.length === 0 && (
          <p className="no-task">No tasks available</p>
        )}

        {currentTasks.map((task) => {
          const isHidden = hiddenTaskIds.includes(task._id);

          return (
            <div
              key={task._id}
              className={`completed-task-card fade-in ${isHidden ? "hidden-task" : ""
                }`}
            >
              <div className="completed-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4>{task.title}</h4>
                  <CheckSquare size={18} color="#16a34a" />{/* Green tick */}
                </div>

                {isHidden ? (
                  <button
                    className="unhide-btn"
                    onClick={() => handleUnhide(task._id)}
                    title="Unhide Task"
                  >
                    <Eye size={18} />
                  </button>
                ) : (
                  <button
                    className="hide-btn"
                    onClick={() => handleHide(task._id)}
                    title="Hide Task"
                  >
                    <EyeOff size={18} />
                  </button>
                )}
              </div>

              <p>{task.description}</p>

              <p className="student-id">
                Student: <strong>{task.studentId}</strong>
              </p>

              <p className="completed-date">
                Completed on: {task.endDate}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= PAGINATION CONTROLS ================= */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCompletedTasks;