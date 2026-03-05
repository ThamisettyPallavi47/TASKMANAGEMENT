import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Users,
  Zap,
  UserPlus,
  MoreVertical,

} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import StatsCard from "../components/StatsCard";
import Pagination from "../components/Pagination";
import AddStudentModal from "../components/AddStudentModal";
import "./styles/Students.css";

const Students = () => {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 5;

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    fetchStudents();
    fetchAdminTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      // Fallback to empty array if API fails or returns non-array
      const res = await axios.get(
        "https://taskmanagement-w3gy.onrender.com/api/admin/students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setStudents([]);
    }
  };

  const fetchAdminTasks = async () => {
    try {
      const res = await axios.get(
        "https://taskmanagement-w3gy.onrender.com/api/admin/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentAdded = (newStudent) => {
    // Optimistically add to list or refresh
    setStudents((prev) => [newStudent, ...prev]);
    setIsModalOpen(false); // Close modal after successful addition
  };

  /* ================= FILTER & PAGINATION ================= */
  const filteredStudents = students.filter(student =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.studentId && student.studentId.toString().includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const studentTasks = selectedStudent
    ? tasks.filter((t) => t.studentId === selectedStudent.studentId)
    : [];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id) => {
    const colors = ["#E0E7FF", "#FEF3C7", "#D1FAE5", "#FEE2E2", "#FCE7F3"]; // Light bg colors
    const textColors = ["#4F46E5", "#D97706", "#059669", "#DC2626", "#DB2777"]; // Matching text colors
    const index = id ? id.toString().charCodeAt(0) % colors.length : 0;
    return { bg: colors[index], text: textColors[index] };
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <div className="header-left">
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">Manage and track student progress</p>

          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add Student
            </button>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <StatsCard
          icon={Users}
          title="Total Students"
          value={students.length.toLocaleString()}
          trend="+12%"
          iconBg="#E0E7FF"
          iconColor="#4F46E5"
          trendLabel=""
        />
        <StatsCard
          icon={Zap}
          title="Active Today"
          value="456"
          trend="+5%"
          iconBg="#F3E8FF"
          iconColor="#9333EA"
        />
        <StatsCard
          icon={UserPlus}
          title="New Signups"
          value="12"
          trend=""
          trendLabel="Last 24h"
          iconBg="#FFEDD5"
          iconColor="#F97316"
        />
      </div>

      <div className="students-container">
        {/* ================= STUDENTS LIST ================= */}
        <div className="students-list-section">
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => {
                    const colors = getRandomColor(student.studentId);
                    return (
                      <tr key={student._id}>
                        <td className="id-cell">{student.studentId || "N/A"}</td>
                        <td>
                          <div className="student-info">
                            <div
                              className="avatar-circle"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {getInitials(student.username)}
                            </div>
                            <span className="student-name">{student.username}</span>
                          </div>
                        </td>
                        <td className="email-cell">{student.email}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn-primary"
                              onClick={() => setSelectedStudent(student)}
                            >
                              View Tasks
                            </button>
                            <button className="more-btn">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={filteredStudents.length}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* ================= TASKS PANEL ================= */}
        {selectedStudent && (
          <div className="tasks-sidebar">
            <div className="tasks-header">
              <h3>Tasks for {selectedStudent.username}</h3>
              <button onClick={() => setSelectedStudent(null)}>Close</button>
            </div>

            {studentTasks.length === 0 ? (
              <p className="no-task">No admin tasks assigned.</p>
            ) : (
              <ul className="task-list">
                {studentTasks.map((task) => (
                  <li key={task._id} className="task-item">
                    <div className="task-top">
                      <h4>{task.title}</h4>
                      <span className={`status-badge ${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>
                    <p>{task.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ================= ADD STUDENT MODAL ================= */}
      {isModalOpen && (
        <AddStudentModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleStudentAdded}
        />
      )}
    </AdminLayout>
  );
};

export default Students;
