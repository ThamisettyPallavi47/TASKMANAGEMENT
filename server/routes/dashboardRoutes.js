

const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/* =====================================================
   STUDENT DASHBOARD (JWT BASED)
   ===================================================== */
router.get("/student", authMiddleware, async (req, res) => {
  try {
    // ✅ CORRECT student id from JWT
    // const studentId = req.user.id;
    const studentId = req.user.studentId;

    // Fetch user name
    const user = await require("../models/User").findOne({ studentId });
    const studentName = user ? user.username : "Student";

    const tasks = await Task.find({ studentId });

    /* ================= MONTHLY TASK COUNT ================= */
    const monthlyTasks = Array(12).fill(0);
    tasks.forEach(task => {
      if (task.startDate) {
        const month = new Date(task.startDate).getMonth();
        monthlyTasks[month]++;
      }
    });

    /* ================= STATUS COUNTS ================= */
    const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.progress === 100).length;
    const inProgress = tasks.filter(
      t => t.progress > 0 && t.progress < 100
    ).length;
    const pending = tasks.filter(t => t.progress === 0).length;

    /* ================= RESPONSE ================= */
    res.json({
      totalTasks,
      completed,
      inProgress,
      pending,

      monthlyTasks,
      studentName,

      // 🔥 IMPORTANT: include taskType + correct field names
      workProgress: tasks.map(t => ({
        _id: t._id,
        title: t.title,
        progress: t.progress,
        start: t.startDate,
        end: t.endDate,
        taskType: t.taskType || "PERSONAL"
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
