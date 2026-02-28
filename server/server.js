require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// --------------------
// Middleware
// --------------------
// CORS configuration - Allow frontend (localhost:3000) to access backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --------------------
// Database
// --------------------
connectDB();

// --------------------
// Routes
// --------------------
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// ✅ Chat route (Gemini)
app.use("/api/chat", require("./routes/chatRoutes"));


// --------------------
// Health check (optional but helpful)
// --------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "Backend running" });
});

// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("[GLOBAL ERROR]", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong"
  });
});

// --------------------
// Unhandled promise rejections
// --------------------
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// --------------------
// Start server
// --------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat API → http://localhost:${PORT}/api/chat`);
  console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

});
