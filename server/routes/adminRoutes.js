const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   GET ALL STUDENTS (ADMIN ONLY)
   ===================================================== */
router.get("/students", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.find({ role: "student" })
      .select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =====================================================
   CREATE NEW STUDENT (ADMIN ONLY)
   ===================================================== */
router.post("/students", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId, username, email, password } = req.body;

    // Basic validation
    if (!studentId || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if studentId already exists
    const existingUser = await User.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    // Check email format
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Email must end with @gmail.com" });
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await User.create({
      studentId,
      username,
      email,
      password: hashedPassword,
      role: "student"
    });

    // Return without password
    const studentResponse = newStudent.toObject();
    delete studentResponse.password;

    res.status(201).json({
      message: "Student created successfully",
      student: studentResponse
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ message: error.message });
  }
});


/* =====================================================
   ASSIGN TASK TO STUDENT (ADMIN)
   ===================================================== */
router.post("/assign-task", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, studentId, startDate, endDate } = req.body;

    const task = await Task.create({
      title,
      description,
      studentId,
      startDate,
      endDate,
      taskType: "ADMIN",
      progress: 0,
      status: "Pending",
    });

    res.status(201).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =====================================================
   GET ALL ADMIN ASSIGNED TASKS
   ===================================================== */
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ taskType: "ADMIN" })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
