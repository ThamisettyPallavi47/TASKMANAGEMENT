
const express = require("express");
const Task = require("../models/Task");
const calculatePriority = require("../utils/priorityUtil");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ADD TASK (PERSONAL) */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,

      // ✅ FIX
      studentId: req.user.studentId,

      priority: calculatePriority(req.body.endDate),
      progress: 0,
      status: "Pending",
      taskType: "PERSONAL",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET TASKS */
router.get("/student", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      studentId: req.user.studentId,
    }).sort({
      priority: 1,
      endDate: 1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* UPDATE PROGRESS */
router.put("/progress/:id", authMiddleware, async (req, res) => {
  try {
    const { progress, comment } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.studentId !== req.user.studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (progress < task.progress) {
      return res.status(400).json({
        message: "Progress cannot be decreased",
      });
    }

    task.progress = progress;
    task.status = progress === 100 ? "Completed" : "In Progress";
    task.priority = calculatePriority(task.endDate);

    if (comment) {
      task.comments.push({ text: comment });
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* DELETE TASK */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.studentId !== req.user.studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
