

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");

// const router = express.Router();

// const passwordRegex =
//   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// /* ================= FORGOT PASSWORD ================= */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.endsWith("@gmail.com")) {
//       return res.status(400).json({
//         message: "Please enter a valid Gmail address",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found with this email",
//       });
//     }

//     // Generate 6-digit OTP
//     const resetToken = crypto.randomInt(100000, 999999).toString();

//     // Expiry: 10 minutes
//     const resetExpires = Date.now() + 10 * 60 * 1000;

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = resetExpires;

//     await user.save();

//     const message = `
// 🔐 StudiIn Password Reset

// Your OTP Code: ${resetToken}

// This code will expire in 10 minutes.

// If you did not request this, please ignore this email.

// - StudiIn Team
// `;

//     await sendEmail({
//       email: user.email,
//       subject: "StudiIn Password Reset OTP",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Verification code sent to your email",
//     });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ================= RESET PASSWORD ================= */
// router.post("/reset-password", async (req, res) => {
//   try {
//     const { email, otp, password } = req.body;

//     if (!email || !otp || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const user = await User.findOne({
//       email,
//       resetPasswordToken: otp,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid or expired OTP",
//       });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be 8+ chars, include uppercase, number & special character",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password reset successful",
//     });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ================= SIGNUP ================= */
// router.post("/signup", async (req, res) => {
//   try {
//     const { studentId, username, email, password, role } = req.body;

//     if (!email.endsWith("@gmail.com")) {
//       return res.status(400).json({
//         message: "Email must end with @gmail.com",
//       });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be 8+ chars, include uppercase, number & special character",
//       });
//     }

//     const exists = await User.findOne({ studentId });

//     if (exists) {
//       return res.status(400).json({
//         message: "Student ID already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       studentId,
//       username,
//       email,
//       password: hashedPassword,
//       role: role || "student",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Signup successful",
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ================= LOGIN ================= */
// router.post("/login", async (req, res) => {
//   try {
//     const { studentId, password } = req.body;

//     const user = await User.findOne({ studentId });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     const token = jwt.sign(
//       {
//         studentId: user.studentId,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user: {
//         studentId: user.studentId,
//         username: user.username,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  console.log("🔥 Forgot password API triggered");

  try {
    const { email } = req.body;

    console.log("📧 Email received:", email);

    if (!email || !email.endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Please enter a valid Gmail address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    console.log("✅ User found:", user.email);

    /* Generate OTP */
    const resetToken = crypto.randomInt(100000, 999999).toString();

    /* Expiry: 10 minutes */
    const resetExpires = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await user.save({ validateBeforeSave: false });

    console.log("📨 OTP generated:", resetToken);

    const message = `
      <div style="font-family:Arial;padding:20px">
        <h2>🔐 StudiIn Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>Your OTP Code:</p>

        <h1 style="
          letter-spacing:4px;
          background:#f4f4f4;
          padding:10px;
          display:inline-block;
        ">
          ${resetToken}
        </h1>

        <p>This OTP will expire in <b>10 minutes</b>.</p>

        <p>If you did not request this, please ignore this email.</p>

        <br>

        <p>Regards,<br><b>StudiIn Team</b></p>
      </div>
    `;

    console.log("📧 Sending email to:", user.email);

    await sendEmail({
      email: user.email,
      subject: "StudiIn Password Reset OTP",
      message,
    });

    console.log("✅ Email function executed");

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);

    res.status(500).json({
      message: "Failed to send verification email",
    });
  }
});


/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    console.log("🔐 Reset password request:", email);

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Invalid or expired OTP");

      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars, include uppercase, number & special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log("✅ Password reset successful");

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;