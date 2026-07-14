const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    otp_created_at: {
      type: Date,
    },
<<<<<<< HEAD
    otpExpiry: {
      type: Date,
    },
=======
>>>>>>> 4ed39a7 (Deploying)
    status: {
      type: String,
      default: "active",
    },
    token: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Visitor", "Student"],
      default: "Visitor",
    },
  },
<<<<<<< HEAD
  { timestamps: true },
=======
  { timestamps: true }
>>>>>>> 4ed39a7 (Deploying)
);

module.exports = mongoose.model("User", userSchema);
