const { transporter } = require("../config/mail.config");
const otpTemplate = require("../templates/Otp.template");

const sendEmail = async (toEmail, type, data = {}) => {
  try {
    let subject = "";
    let html = "";

    switch (type) {
      case "otp":
        subject = "Your OTP Code";
        html = otpTemplate(data.otp);
        break;
      default:
        throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: toEmail,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
