import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/StudentDashboard.css";
import dashboardService from "../../services/dashboardService";
import StudentLayout from "../components/StudentLayout";

import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [taskFilter, setTaskFilter] = useState("ALL");
  const [isActive, setIsActive] = useState(true); // Moved here

  /* ===== CALENDAR STATE ===== */
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    dashboardService.getStudentDashboard().then((res) => {
      setDashboardData(res.data);
    });
  }, []);

  /* ================= FILTERED TASKS ================= */
  const filteredTasks = useMemo(() => {
    if (!dashboardData) return [];

    if (taskFilter === "PERSONAL") {
      return dashboardData.workProgress.filter(
        (t) => t.taskType !== "ADMIN"
      );
    }

    if (taskFilter === "ADMIN") {
      return dashboardData.workProgress.filter(
        (t) => t.taskType === "ADMIN"
      );
    }

    return dashboardData.workProgress;
  }, [dashboardData, taskFilter]);

  /* ================= COUNTS ================= */
  const totalTasks = filteredTasks.length;
  const completed = filteredTasks.filter(t => t.progress === 100).length;
  const inProgress = filteredTasks.filter(t => t.progress > 0 && t.progress < 100).length;
  const pending = filteredTasks.filter(t => t.progress === 0).length;

  /* ================= MONTHLY LINE ================= */
  const monthlyTasks = useMemo(() => {
    const months = Array(12).fill(0);
    filteredTasks.forEach(task => {
      if (task.start) {
        months[new Date(task.start).getMonth()]++;
      }
    });
    return months;
  }, [filteredTasks]);

  /* ================= NEW CALENDAR TASK MAP ================= */
  const tasksByDate = useMemo(() => {
    const map = {};
    filteredTasks.forEach(task => {
      if (!task.end) return;

      const d = new Date(task.end);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [filteredTasks]);

  /* ================= TOP 4 WORK PROGRESS ================= */
  /* ================= TOP 4 WORK PROGRESS ================= */
  const topProgressTasks = useMemo(() => {
    if (!filteredTasks) return [];

    return [...filteredTasks]
      .filter(t => t.end && t.progress !== 100)   // remove completed tasks
      .sort((a, b) => new Date(a.end) - new Date(b.end)) // nearest deadline first
      .slice(0, 4); // only first 4 tasks
  }, [filteredTasks]);

  /* ================= TASK PERCENTAGE DATA ================= */

  const taskPercentageData = useMemo(() => {

    const completedPercent = totalTasks ? (completed / totalTasks) * 100 : 0;
    const progressPercent = totalTasks ? (inProgress / totalTasks) * 100 : 0;
    const pendingPercent = totalTasks ? (pending / totalTasks) * 100 : 0;

    return [
      completedPercent.toFixed(1),
      progressPercent.toFixed(1),
      pendingPercent.toFixed(1)
    ];

  }, [completed, inProgress, pending, totalTasks]);

  const openSummaryTasks = (status) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (taskFilter !== "ALL") params.set("type", taskFilter);
    navigate(`/student/task-summary?${params.toString()}`);
  };

  if (!dashboardData) return <p>Loading dashboard...</p>;

  /* ================= CALENDAR META ================= */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().setHours(0, 0, 0, 0);



  return (
    <StudentLayout>
      <div className="dashboard-header-row">
        <div className="header-text">
          <h2>Student Dashboard</h2>

          <p>
            Welcome back,{" "}
            <strong>{(dashboardData.studentName || "Student").toUpperCase()}</strong>
            {" "}! Here's what's happening today.
          </p>

          <div className="header-tabs">
            {["ALL", "PERSONAL", "ADMIN"].map((type) => (
              <button
                key={type}
                className={`tab-btn ${taskFilter === type ? "active" : ""}`}
                onClick={() => setTaskFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <section className="stats-grid">
        <div className="stat-card deep-blue clickable" onClick={() => openSummaryTasks(null)}>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <span className="stat-number">{totalTasks}</span>
            <p className="stat-sub">↗ 4% from last week</p>
          </div>
        </div>

        <div className="stat-card light-blue clickable" onClick={() => openSummaryTasks("IN_PROGRESS")}>
          <div className="stat-content">
            <h3>In Progress</h3>
            <span className="stat-number">{inProgress}</span>
            <p className="stat-sub" color="#fff">🕒 2 due today</p>
          </div>
        </div>

        <div className="stat-card red clickable" onClick={() => openSummaryTasks("PENDING")}>
          <div className="stat-content">
            <h3>Pending</h3>
            <span className="stat-number">{pending}</span>
            <p className="stat-sub">! Action required</p>
          </div>
        </div>

        <div className="stat-card green clickable" onClick={() => openSummaryTasks("COMPLETED")}>
          <div className="stat-content">
            <h3>Completed</h3>
            <span className="stat-number">{completed}</span>
            <p className="stat-sub">✔ 50% completion rate</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="main-grid">

        {/* ROW 1 LEFT: TOTAL WORK (Line Chart) */}
        <div className="grid-item line-chart-box">
          <div className="box-header">
            <h3>Total Work</h3>
            <div className="dot-indicators">
              <span className="dot purple"></span> Tasks
            </div>
          </div>

          <div className="chart-container-line">
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                  label: "Tasks",
                  data: monthlyTasks,
                  borderColor: "#8b5cf6", // Purple like image
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  tension: 0.4, // Smooth curve
                  pointRadius: 0,
                  fill: true
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: { display: false } // Hide Y axis as per image 1 style
                }
              }}
            />
          </div>

          <div className="chart-footer-centered">
            <h4>Work Progress</h4>
            <p>Activity tracked over the current year</p>
          </div>
        </div>


        {/* ===== ROW 1 RIGHT: CALENDAR (UPDATED) ===== */}
        <div className="grid-item calendar-box-modern">
          <div className="calendar-header-modern">
            <h3>Calendar</h3>
            <div className="calendar-nav">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
              <span className="month-year">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
            </div>
          </div>

          <div className="calendar-grid-modern">
            {["S", "M", "T", "W", "T", "F", "S"].map(d => (
              <span key={d} className="cal-head">{d}</span>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const key = `${year}-${month}-${day}`;
              const isPast = dateObj.setHours(0, 0, 0, 0) < today;
              const tasks = tasksByDate[key] || [];

              let highlightClass = "";
              if (tasks.length > 0) {
                const hasAdmin = tasks.some(t => t.taskType === "ADMIN");
                const hasPersonal = tasks.some(t => t.taskType !== "ADMIN");

                highlightClass = hasAdmin && hasPersonal
                  ? "calendar-both"
                  : hasAdmin
                    ? "calendar-admin"
                    : "calendar-personal";
              }

              return (
                <span
                  key={day}
                  className={`cal-day ${highlightClass} ${isPast ? "disabled" : ""}`}
                  title={tasks.map(t => t.title).join(", ")}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>


        {/* ROW 2 LEFT: TASK PERCENTAGE */}
        <div className="grid-item donut-box">
          <h3>Task Percentage</h3>
          <div className="donut-wrapper">

            <Doughnut
              data={{
                datasets: [{
                  data: taskPercentageData,
                  backgroundColor: [
                    "#10b981",
                    "#3b82f6",
                    "#ef4444"
                  ],
                  cutout: "80%"
                }]
              }}
            />
            <div className="donut-center-text">
              {/* <span className="percent">75%</span> */}
              <span className="label">DONE</span>
            </div>
          </div>

          <div className="donut-legend">
            <div className="legend-item"><span className="dot green"></span> Completed</div>
            <div className="legend-item"><span className="dot blue"></span> In Progress</div>
            <div className="legend-item"><span className="dot red"></span> Pending</div>
          </div>
        </div>
       
        {/* ===== WORK PROGRESS + STATUS ===== */}

        <div className="progress-status-wrapper ">

          {/* WORK PROGRESS */}
          <div className="work-progress-section ">

            <div className="work-progress-header">
              <h3>Work Progress</h3>
            </div>

            <div className="work-progress-grid">

              {topProgressTasks.map(task => (
                <div key={task._id} className="progress-task-card">

                  <div className="progress-task-header">
                    <span className="task-title">{task.title}</span>
                    <span className="task-percent">{task.progress}%</span>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>

                  <div className="task-due">
                    Due: {new Date(task.end).toISOString().split("T")[0]}
                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* WORKING STATUS */}
          <div className="status-box-modern">

            <h3>Working Status</h3>

            <div className="status-chart">
              <Doughnut
                data={{
                  labels: ["Active", "Idle"],
                  datasets: [
                    {
                      data: [isActive ? 70 : 30, isActive ? 30 : 70],
                      backgroundColor: ["#10b981", "#e5e7eb"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>

            <div className="status-toggle-row">
              <div className="status-indicator">
                <span className={`status-dot ${isActive ? "active-dot" : ""}`}></span>
                <span>Active</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* <div className="status-indicator idle-row">
              <span className="status-dot idle-dot"></span>
              {/* <span>Idle</span>
              <span className="idle-time">Started 2h ago</span> }
            </div> */}

          </div>

        </div>
      </div>

    </StudentLayout>
  );
};

export default StudentDashboard;
