const { generateSecret, generate, verify } = require("otplib");
const dotenv = require("dotenv");
dotenv.config();
const qrcode = require("qrcode");
const {
  QRCodeStyling,
} = require("qr-code-styling/lib/qr-code-styling.common.js");
const { JSDOM } = require("jsdom");
const nodeCanvas = require("canvas");
const { generateToken } = require("../../services/jwt");
const { Response } = require("../../services/response");
const User = require("./auth.model");
const bcrypt = require("bcrypt");
const fs = require("fs");

const enable2FAForUser = async (user) => {
  try {
    let secret = user.twoFaSecret;

    if (!secret) {
      secret = generateSecret();
      console.log(
        "Generated new 2FA secret:",
        secret,
        "length:",
        secret.length,
      );

      user.twoFaSecret = secret;
      const updatedUser = await user.save();

      if (!updatedUser?.twoFaSecret) {
        throw new Error("Failed to save 2FA secret to database");
      }

      console.log("2FA secret saved successfully for user:", user._id);
    }

    if (secret.length < 16) {
      throw new Error(`Secret is too short (${secret.length} chars)`);
    }

    const appName = process.env.QRAPPNAME || "WishGeeks";
    const label = `${appName}:${user.email}`;
    const issuer = encodeURIComponent(appName);

    const otpauth =
      `otpauth://totp/${encodeURIComponent(label)}?` +
      `secret=${secret}&` +
      `issuer=${issuer}&` +
      `algorithm=SHA1&` +
      `digits=6&` +
      `period=30`;

    const options = {
      width: 350,
      height: 350,
      data: otpauth,
      image: process.env.pannelLogo,

      backgroundOptions: {
        color: "#ffffff",
      },

      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.58,
        margin: 10,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: "rounded",
        color: "#2B1360",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#2382DC",
      },

      cornersDotOptions: {
        type: "dot",
        color: "#2B1360",
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    };
    const qrCode = new QRCodeStyling({
      jsdom: JSDOM,
      nodeCanvas,
      ...options,
    });

    const pngBuffer = await qrCode.getRawData("png");
    const qrDataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    return qrDataUrl;
  } catch (err) {
    console.error("Error in enable2FAForUser:", err);
    throw new Error(`2FA setup failed: ${err.message}`);
  }
};
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return Response.error(res, 400, false, "All fields are required");
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return Response.error(
        res,
        400,
        false,
        "Email already exists! Please login",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    await user.save();

    return Response.success(res, 201, true, "User created successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Register error:", error);
    return Response.error(
      res,
      500,
      false,
      "Internal server error",
      error.message,
    );
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return Response.error(res, 400, false, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.error(res, 404, false, "User not found. Please sign up");
    }

    if (!user.isVerified) {
      return Response.error(res, 429, false, "Please verify your email first");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return Response.error(res, 401, false, "Invalid email or password");
    }

    const qrCodeUrl = await enable2FAForUser(user);

    if (!user.twoFaSecret) {
      return Response.error(res, 500, false, "Failed to setup 2FA secret");
    }

    if (user.twoFaAuth !== true) {
      return Response.success(
        res,
        200,
        true,
        "Please complete 2FA verification",
        {
          requires2FA: true,
          qrcode: qrCodeUrl,
          userId: user._id.toString(),
          message:
            "Scan this QR code with Google Authenticator, then enter the code below",
        },
      );
    }

    return Response.success(res, 200, true, "Enter your 2FA code", {
      requires2FA: true,
      userId: user._id.toString(),
      message: "Open Google Authenticator and enter the 6-digit code",
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.error(
      res,
      500,
      false,
      "Internal server error",
      error.message,
    );
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { otp, userId } = req.body;
    if (!otp || !userId) {
      return Response.error(res, 400, false, "OTP and userId are required");
    }

    const user = await User.findById(userId).select("-password -role -wallet");
    if (!user) {
      return Response.error(res, 404, false, "User not found");
    }

    console.log("User found for 2FA verify:", {
      userId: user._id,
      hasTwoFaSecret: !!user.twoFaSecret,
      twoFaSecretLength: user.twoFaSecret?.length ?? 0,
      twoFaSecretValue: user.twoFaSecret
        ? user.twoFaSecret.substring(0, 10) + "..."
        : "missing",
    });

    if (!user.twoFaSecret || user.twoFaSecret.length < 16) {
      return Response.error(
        res,
        400,
        false,
        "2FA is not properly configured. Please login again to setup 2FA.",
      );
    }

    const tokenStr = String(otp).trim().replace(/\s/g, "");

    console.log("[DEBUG OTP VERIFY] Input OTP:", tokenStr);
    console.log(
      "[DEBUG OTP VERIFY] Secret (first 10 chars):",
      user.twoFaSecret.substring(0, 10),
    );
    console.log(
      "[DEBUG OTP VERIFY] Current server time:",
      new Date().toISOString(),
    );

    let verificationResult;
    try {
      verificationResult = await verify({
        token: tokenStr,
        secret: user.twoFaSecret,
        options: {
          window: 1,
          digits: 6,
          step: 30,
          algorithm: "sha1",
        },
      });

      console.log("[DEBUG OTP VERIFY] verify() returned:", verificationResult);
      console.log(
        "[DEBUG OTP VERIFY] typeof verificationResult:",
        typeof verificationResult,
      );
    } catch (verifyErr) {
      console.error("[DEBUG OTP VERIFY] verify() threw error:", verifyErr);
      return Response.error(
        res,
        500,
        false,
        "2FA verification failed internally",
        verifyErr.message,
      );
    }

    const isValid = verificationResult?.valid === true;

    if (!isValid) {
      return Response.error(res, 401, false, "Invalid or expired OTP");
    }

    user.twoFaAuth = true;
    await user.save();

    const token = await generateToken(user);
    res.cookie("adm@12", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return Response.success(res, 200, true, "Login successful", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify login error:", error);
    return Response.error(
      res,
      500,
      false,
      "Internal server error",
      error.message,
    );
  }
};

module.exports = {
  registerUser,
  userLogin,
  verifyLogin,
};
