

const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   ADMIN ANALYTICS – ADMIN TASKS ONLY
   ===================================================== */
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    // 🔒 Allow admin only
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ FETCH ONLY ADMIN ASSIGNED TASKS
    const adminTasks = await Task.find({ taskType: "ADMIN" });

    /* ================= OVERALL ADMIN TASK STATS ================= */
    const total = adminTasks.length;
    const completed = adminTasks.filter(t => t.progress === 100).length;
    const inProgress = adminTasks.filter(
      t => t.progress > 0 && t.progress < 100
    ).length;
    const pending = adminTasks.filter(t => t.progress === 0).length;

    /* ================= STUDENT-WISE ADMIN TASK STATS ================= */
    const studentStats = {};

    adminTasks.forEach(task => {
      const sid = task.studentId;

      if (!studentStats[sid]) {
        studentStats[sid] = {
          studentId: sid,
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
        };
      }

      studentStats[sid].total++;

      if (task.progress === 100) {
        studentStats[sid].completed++;
      } else if (task.progress > 0) {
        studentStats[sid].inProgress++;
      } else {
        studentStats[sid].pending++;
      }
    });

    res.json({
      adminSummary: {
        total,
        completed,
        inProgress,
        pending,
      },
      studentWiseAdminTasks: Object.values(studentStats),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

router.get("/admin/monthly", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ taskType: "ADMIN" });

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize all months with 0
    const monthlyData = months.map((m) => ({
      month: m,
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
    }));

    tasks.forEach((task) => {
      // Use startDate if available, otherwise fallback to createdAt
      const dateStr = task.startDate || task.createdAt;

      if (!dateStr) return;

      const date = new Date(dateStr);

      // Safety check: if date is invalid, skip
      if (isNaN(date.getTime())) return;

      const monthIndex = date.getMonth(); // 0–11

      monthlyData[monthIndex].total += 1;

      if (task.progress === 100) {
        monthlyData[monthIndex].completed += 1;
      } else if (task.progress > 0) {
        monthlyData[monthIndex].inProgress += 1;
      } else {
        monthlyData[monthIndex].pending += 1;
      }
    });

    res.json(monthlyData);
  } catch (err) {
    console.error("Monthly analytics error:", err);
    res.status(500).json({ message: "Monthly analytics failed" });
  }
});



module.exports = router;
