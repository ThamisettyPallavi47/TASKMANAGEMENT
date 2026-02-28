

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // ✅ FIX: studentId must be STRING
    studentId: {
      type: String,
      required: true,
    },

    taskType: {
      type: String,
      enum: ["PERSONAL", "ADMIN"],
      default: "PERSONAL",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },

    progress: { type: Number, default: 0 },

    comments: [
      {
        text: String,
        date: { type: Date, default: Date.now },
      },
    ],

    startDate: String,
    endDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
