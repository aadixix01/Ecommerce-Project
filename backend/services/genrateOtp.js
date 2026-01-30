const crypto = require("crypto");

const generateAlphaNumOtp = (length = 8) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .toUpperCase()
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
};

module.exports = { generateAlphaNumOtp };
