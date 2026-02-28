



import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./styles/AssignTask.css";

const AssignTask = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    studentIds: [], // ✅ multiple students
    startDate: "",
    endDate: "",
  });

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data))
      .catch(console.error);
  }, [token]);

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= STUDENT TOGGLE ================= */
  const toggleStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((s) => s !== id)
        : [...prev.studentIds, id],
    }));
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setForm((prev) => ({
        ...prev,
        startDate: value,
        endDate: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.studentIds.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      await Promise.all(
        form.studentIds.map((studentId) =>
          axios.post(
            "http://localhost:5000/api/admin/assign-task",
            {
              title: form.title,
              description: form.description,
              studentId,
              startDate: form.startDate,
              endDate: form.endDate,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      setSuccessMessage("Task assigned successfully");
      setForm({
        title: "",
        description: "",
        studentIds: [],
        startDate: "",
        endDate: "",
      });

      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="add-task-wrapper">
        <div className="add-task-container">
          <h2>Assign Task</h2>

          <form onSubmit={handleSubmit} className="task-form">
          
<div className="multi-select" ref={dropdownRef}>
  <label className="field-label">Select Students</label>

  <div
    className="multi-select-input"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
    <span>
      {form.studentIds.length === 0
        ? "Select students"
        : `${form.studentIds.length} student(s) selected`}
    </span>
    <span className="arrow">▾</span>
  </div>

  {dropdownOpen && (
    <div className="multi-select-dropdown">
      {students.map((s) => (
        <label key={s._id} className="dropdown-item">
          <input
            type="checkbox"
            checked={form.studentIds.includes(s.studentId)}
            onChange={() => toggleStudent(s.studentId)}
          />
          <span>
            {s.studentId} – {s.username}
          </span>
        </label>
      ))}
    </div>
  )}
</div>


            {/* TITLE */}
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              required
              value={form.title}
              onChange={handleChange}
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Task Description"
              value={form.description}
              onChange={handleChange}
            />

            {/* START DATE */}
            <div className="date-field">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                min={today}
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* END DATE */}
            <div className="date-field">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                min={form.startDate || today}
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Assign Task</button>

            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AssignTask;
