

const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/student", authMiddleware, async (req, res) => {
  try {
    // const studentId = req.user.id;
    const studentId = req.user.studentId;
    const { type } = req.query;

    let query = { studentId };

    if (type === "PERSONAL") {
      query.taskType = { $in: ["PERSONAL", null] };
    }

    if (type === "ADMIN") {
      query.taskType = "ADMIN";
    }

    const tasks = await Task.find(query);

    res.json({
      total: tasks.length,
      completed: tasks.filter(t => t.progress === 100).length,
      inProgress: tasks.filter(t => t.progress > 0 && t.progress < 100).length,
      pending: tasks.filter(t => t.progress === 0).length,
      personal: tasks.filter(t => t.taskType !== "ADMIN").length,
      admin: tasks.filter(t => t.taskType === "ADMIN").length,
      progressTrend: tasks.map((t, i) => ({
        label: `Task ${i + 1}`,
        progress: t.progress
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =====================================================
   ADMIN ANALYTICS (NEW – ADDED)
   ===================================================== */
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const adminTasks = await Task.find({ taskType: "ADMIN" });

    /* ================= SUMMARY ================= */
    const adminSummary = {
      total: adminTasks.length,
      completed: adminTasks.filter(t => t.progress === 100).length,
      inProgress: adminTasks.filter(
        t => t.progress > 0 && t.progress < 100
      ).length,
      pending: adminTasks.filter(t => t.progress === 0).length,
    };

    /* ================= STUDENT-WISE COMPLETED ================= */
    const studentWiseAdminTasks = [];

    adminTasks.forEach((task) => {
      let student = studentWiseAdminTasks.find(
        (s) => s.studentId === task.studentId
      );

      if (!student) {
        student = {
          studentId: task.studentId,
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
        };
        studentWiseAdminTasks.push(student);
      }

      student.total += 1;

      if (task.progress === 100) {
        student.completed += 1;
      } else if (task.progress > 0) {
        student.inProgress += 1;
      } else {
        student.pending += 1;
      }
    });

    /* ================= RECENT ADMIN TASKS ================= */
    const recentAdminTasks = await Task.find({
      taskType: "ADMIN",
      progress: 100,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title studentId endDate updatedAt");

    res.json({
      adminSummary,
      studentWiseAdminTasks,
      recentAdminTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
