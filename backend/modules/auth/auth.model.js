const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone number  is required"],
      unique: true,
      maxLength: 12,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1,
    },
    password: {
      type: String,
      required: true,
    },
    secrectKey: {
      type: String,
    },
    publicKey: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    twoFaAuth: {
      type: Boolean,
      default: false,
    },
    isVender: {
      type: Boolean,
      default: false,
    },
    vendorId: {
      type: String,
      unique: true,
      lowercase: true,
      default: null,
    },
    twoFaSecret: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", authSchema);
module.exports = User;
