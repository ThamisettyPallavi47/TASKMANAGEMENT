//new profile+password

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findOne(
    { studentId: req.user.studentId },
    "-password"
  );

  res.json(user);
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, async (req, res) => {
  const { username, email } = req.body;

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json({
      message: "Email must end with @gmail.com",
    });
  }

  await User.findOneAndUpdate(
    { studentId: req.user.studentId },
    { username, email }
  );

  res.json({ message: "Profile updated successfully" });
});

/* ================= CHANGE PASSWORD ================= */
router.put("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findOne({
    studentId: req.user.studentId,
  });

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(400).json({
      message: "Old password is incorrect",
    });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be 8+ chars with uppercase, number & special char",
    });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  res.json({
    message: "Password changed successfully. Please login again.",
  });
});

module.exports = router;
