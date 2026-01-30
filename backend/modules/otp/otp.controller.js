const { generateAlphaNumOtp } = require("../../services/genrateOtp");
const { Response } = require("../../services/response");
const sendEmail = require("../../services/sendMail");
const User = require("../auth/auth.model");
const OTP = require("./otp.model");

const generateOtp = async (req, res) => {
  try {
    const { email, type = "otp" } = req.body;

    if (!email) {
      return Response.error(res, 400, false, "Email is required");
    }

    await OTP.findOneAndDelete({ email, purpose: type });

    const otp = generateAlphaNumOtp();

    await OTP.create({
      email,
      purpose: type,
      otp,
    });

    await sendEmail(email, "otp", { otp });

    return Response.success(res, 200, true, `OTP sent to your email ${email}`);
  } catch (error) {
    console.error(error);
    return Response.error(res, 500, false, "Something went wrong");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    if (!email || !otp || !type) {
      return Response.error(res, 400, false, "All details are required");
    }
    const isVerify = await OTP.findOne({
      email,
      otp,
      purpose: type,
    });
    if (!isVerify) {
      return Response.error(res, 400, false, "Invalid or expired OTP");
    }
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );
    if (!user) {
      return Response.error(res, 404, false, "User not found");
    }
    await OTP.deleteOne({ _id: isVerify._id });
    const userData = {
      name: user.name,
      email: user.email,
    };
    return Response.success(
      res,
      200,
      true,
      "OTP verified successfully",
      userData,
    );
  } catch (error) {
    console.error(error);
    return Response.error(res, 500, false, "Internal Server Error");
  }
};

module.exports = { generateOtp, verifyOtp };
