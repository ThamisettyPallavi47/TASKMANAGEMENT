
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardList, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import AdminLayout from "../components/AdminLayout";
import "./styles/AdminDashboard.css";


const COLORS = ["#10b981", "#3b82f6", "#ef4444"]; // Completed, InProgress, Pending

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("ALL");
 
  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
    fetchMonthlyAnalytics();
    fetchProfile(); 
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/profile",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAdminName(res.data.username);
  } catch (error) {
    console.error("Error fetching admin profile", error);
  }
};
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/analytics/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Analytics API response:", res.data);
      setAnalytics(res.data);
     
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMonthlyAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/analytics/admin/monthly",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMonthlyData(res.data);
    } catch (error) {
      console.error("Error fetching monthly analytics", error);
    }
  };

  if (!analytics) return <div className="loading">Loading...</div>;

  const { adminSummary, studentWiseAdminTasks, recentAdminTasks } = analytics;

  // Filter logic
  const getStats = () => {
    if (selectedStudent === "ALL") {
      return adminSummary;
    }
    const student = studentWiseAdminTasks.find(
      (s) => s.studentId === selectedStudent
    );
    return student || { total: 0, completed: 0, inProgress: 0, pending: 0 };
  };

  const stats = getStats();

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "In Progress", value: stats.inProgress },
    { name: "Pending", value: stats.pending },
  ];

  // Top Performers Logic
  const topPerformers = [...studentWiseAdminTasks]
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="admin-header-container">
        <div className="header-content">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">Overview of student progress and tasks.</p>
 <p className="admin-name">
  Welcome back,{" "}
  <strong text-blue>{(adminName || "Admin").toUpperCase()}</strong>
  {" "}! Here's what's happening today.
</p>

          <div className="filter-wrapper">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="student-filter"
            >
              <option value="ALL">All Students</option>
              {students.map((s) => (
                <option key={s._id} value={s.studentId}>
                  {s.username}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="stats-row">
        {/* TOTAL */}
        <div
          className="stat-card total-gradient"
          onClick={() => navigate("/admin/task-summary?status=ALL")}
        >
          <div className="stat-info">
            <span>Total Tasks</span>
            <h3>{stats.total}</h3>
          </div>
        </div>

        {/* IN PROGRESS */}
        <div
          className="stat-card progress-gradient"
          onClick={() => navigate("/admin/task-summary?status=IN_PROGRESS")}
        >
          <div className="stat-info">
            <span>In Progress</span>
            <h3>{stats.inProgress}</h3>
          </div>
        </div>

        {/* PENDING */}
        <div
          className="stat-card pending-gradient"
          onClick={() => navigate("/admin/task-summary?status=PENDING")}
        >
          <div className="stat-info">
            <span>Pending</span>
            <h3>{stats.pending}</h3>
          </div>
        </div>

        {/* COMPLETED */}
        <div
          className="stat-card completed-gradient"
          onClick={() => navigate("/admin/task-summary?status=COMPLETED")}
        >
          <div className="stat-info">
            <span>Completed</span>
            <h3>{stats.completed}</h3>
          </div>
        </div>
      </div>


      {/* CHARTS SECTION */}
      <div className="charts-row">
        {/* Monthly Line Chart */}
        <div className="chart-card line-chart-container">
          <div className="chart-header">
            <h3>Total Work (Monthly)</h3>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="inProgress" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card pie-chart-container">
          <h3>Task Percentage</h3>
          <div className="pie-wrapper">
            <div className="chart-inner-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                        stroke="none"
                        cornerRadius={10}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text Overlay */}
              <div className="chart-center-text">
                <span className="efficiency-value">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
                <span className="efficiency-label">EFFICIENCY</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="custom-legend">
              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-dot" style={{ backgroundColor: COLORS[0] }}></span>
                  <span className="legend-label">Completed</span>
                </div>
                <span className="legend-value">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>

              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-dot" style={{ backgroundColor: COLORS[1] }}></span>
                  <span className="legend-label">In Progress</span>
                </div>
                <span className="legend-value">
                  {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                </span>
              </div>

              <div className="legend-item">
                <div className="legend-left">
                  <span className="legend-dot" style={{ backgroundColor: COLORS[2] }}></span>
                  <span className="legend-label">Pending</span>
                </div>
                <span className="legend-value">
                  {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: RECENT ACTIVITY & TOP PERFORMERS */}
      <div className="bottom-row">
        {/* Recent Activity */}
        <div className="info-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentAdminTasks && recentAdminTasks.length > 0 ? (
              recentAdminTasks.map((task, i) => (
                <div key={i} className="activity-item">
                  <span className="bullet">•</span>
                  <div>
                    <span className="activity-title">{task.title}</span>
                    <span className="activity-student"> ({task.studentId})</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="info-card top-performers">
          <h3>Top Performers</h3>
          <div className="performers-list">
            {topPerformers && topPerformers.length > 0 ? (
              topPerformers.map((student, i) => (
                <div key={i} className="performer-item">
                  <span className="medal">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "👤"}
                  </span>
                  <div>
                    <span className="performer-id">{student.studentId}</span>
                    <span className="performer-stats"> - {student.completed} completed</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
