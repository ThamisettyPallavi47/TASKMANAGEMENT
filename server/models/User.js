
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Force uppercase in DB
    },
    username: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      match: /@gmail\.com$/, // ✅ email validation
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
