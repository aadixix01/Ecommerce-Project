const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailIsworking = async () => {
  transporter.verify((error, success) => {
    if (error) {
      console.error(" Mail transporter not ready:", error);
    } else {
      console.log(" Mail transporter is ready to send emails");
    }
    console.log({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
    });
  });
};

module.exports = { mailIsworking, transporter };
