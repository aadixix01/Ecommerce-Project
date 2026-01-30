const express = require("express");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../../middleware/auth.middleware");
const { registerUser, userLogin, verifyLogin } = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), userLogin);
authRouter.post("/verifylogin", verifyLogin);

module.exports = authRouter;
