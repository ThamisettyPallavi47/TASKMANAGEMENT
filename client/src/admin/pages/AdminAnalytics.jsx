import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ClipboardList,
  Clock,
  RefreshCcw,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminAnalytics.css";

const COLORS = ["#58d68d", "#5dade2", "#f1948a"];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  // Mock date range for display
  const [dateRange, setDateRange] = useState("Oct 1, 2023 - Oct 31, 2023");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/analytics/admin",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  if (!data) return null;

  const { adminSummary, studentWiseAdminTasks } = data;

  /* ================= FILTERED DATA ================= */
  let filteredStudents =
    selectedStudent === "ALL"
      ? studentWiseAdminTasks
      : studentWiseAdminTasks.filter(
        (s) => s.studentId === selectedStudent
      );

  if (statusFilter !== "ALL") {
    filteredStudents = filteredStudents.map((s) => ({
      ...s,
      total:
        statusFilter === "PENDING"
          ? s.pending
          : statusFilter === "IN_PROGRESS"
            ? s.inProgress
            : s.completed,
    }));
  }

  const summary = filteredStudents.reduce(
    (acc, s) => {
      acc.total += s.total;
      acc.pending += s.pending;
      acc.inProgress += s.inProgress;
      acc.completed += s.completed;
      return acc;
    },
    { total: 0, pending: 0, inProgress: 0, completed: 0 }
  );

  const pieData = [
    { name: "Completed", value: summary.completed },
    { name: "In Progress", value: summary.inProgress },
    { name: "Pending", value: summary.pending },
  ];

  // Calculate completion rate for visualization
  const completionRate = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;

  return (
    <AdminLayout>
      {/* ================= HEADER SECTION ================= */}
      <div className="analytics-header">
        <div>
          <h2 className="page-title">Admin Analytics</h2>
          <p className="page-subtitle">Monitor student performance and task status.</p>
        </div>

        <div className="analytics-filters">
          

          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Students</option>
            {studentWiseAdminTasks.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.studentId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= STATS CARDS (WHITE DESIGN) ================= */}
      <div className="stats-row">
        {/* TOTAL */}
        <div
          className="stat-card-white border-purple"
          onClick={() => navigate("/admin/task-summary?status=ALL")}
        >
          <div className="stat-top">
            <span className="stat-label">TOTAL TASKS</span>
            <div className="icon-box-sm bg-purple-light">
              <ClipboardList size={18} className="text-purple" />
            </div>
          </div>
          <h3>{summary.total}</h3>
          <span className="stat-sub text-green">
            <span className="stat-sub text-green">↗</span> 12% increase from last week
          </span>
        </div>

        {/* PENDING */}
        <div
          className="stat-card-white border-red"
          onClick={() => navigate("/admin/task-summary?status=PENDING")}
        >
          <div className="stat-top">
            <span className="stat-label">PENDING</span>
            <div className="icon-box-sm bg-red-light">
              <Clock size={18} className="text-red" />
            </div>
          </div>
          <h3>{summary.pending}</h3>
          <span className="stat-sub text-red">Needs immediate attention</span>
        </div>

        {/* IN PROGRESS */}
        <div
          className="stat-card-white border-blue"
          onClick={() => navigate("/admin/task-summary?status=IN_PROGRESS")}
        >
          <div className="stat-top">
            <span className="stat-label">IN PROGRESS</span>
            <div className="icon-box-sm bg-blue-light">
              <RefreshCcw size={18} className="text-blue" />
            </div>
          </div>
          <h3>{summary.inProgress}</h3>
          <span className="stat-sub text-blue">Actively being worked on</span>
        </div>

        {/* COMPLETED */}
        <div
          className="stat-card-white border-green"
          onClick={() => navigate("/admin/task-summary?status=COMPLETED")}
        >
          <div className="stat-top">
            <span className="stat-label">COMPLETED</span>
            <div className="icon-box-sm bg-green-light">
              <CheckCircle2 size={18} className="text-green" />
            </div>
          </div>
          <h3>{summary.completed}</h3>
          <span className="stat-sub text-green">
            <span className="stat-sub text-green">✓</span> {completionRate}% completion rate
          </span>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="analytics-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Task Completion Status</h3>
          </div>

          <div className="pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text Overlay */}
            <div className="pie-center-text">
              <span className="pie-percent">{completionRate}%</span>
              <span className="pie-label">GOAL</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Student-wise Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredStudents} barCategoryGap={20}>
              <XAxis dataKey="studentId" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend />
              <Bar dataKey="completed" fill="#58d68d" barSize={12} radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#5dade2" barSize={12} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f1948a" barSize={12} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABLE (DRILL-DOWN) ================= */}
      <div className="table-card">
        <div className="table-header-row">
          <h3>Student-wise Admin Task Summary</h3>

        </div>

        <table>
          <thead>
            <tr>
              <th align="left">STUDENT</th>
              <th>TOTAL</th>
              <th>PENDING</th>
              <th>IN PROGRESS</th>
              <th>COMPLETED</th>
            </tr>
          </thead>
          <tbody>
            {studentWiseAdminTasks.map((s) => (
              <tr
                key={s.studentId}
                className={
                  selectedStudent === s.studentId ? "active-row" : ""
                }
                onClick={() => setSelectedStudent(s.studentId)}
              >
                <td className="student-cell">
                  <div className="student-avatar-sm">{s.studentId.substring(0, 2)}</div>
                  <div>
                    <div className="student-id-text">{s.studentId}</div>
                  </div>
                </td>
                <td>{s.total}</td>
                <td>
                  <span className="badge-pill pending">{s.pending}</span>
                </td>
                <td>
                  <span className="badge-pill progress">{s.inProgress}</span>
                </td>
                <td>
                  <span className="badge-pill completed">{s.completed}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
