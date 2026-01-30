const express = require("express");
const { generateOtp, verifyOtp } = require("./otp.controller");
const otpRouter = express.Router();

otpRouter.post("/sendOtp", generateOtp);
otpRouter.post("/verifyOtp", verifyOtp);

module.exports = otpRouter;
