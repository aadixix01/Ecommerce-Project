const otpTemplate = (otp) => `
  <div style="
    font-family: Arial, sans-serif; 
    max-width: 600px; 
    margin: auto; 
    padding: 20px; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    background-color: #f9f9f9;
    color: #333;
  ">
    <h2 style="color: #2a9d8f;">OTP Verification</h2>
    <p style="font-size: 16px;">Hi,</p>
    <p style="font-size: 16px;">Your OTP code is:</p>
    <p style="
      font-size: 28px; 
      font-weight: bold; 
      letter-spacing: 4px; 
      color: #e76f51;
      margin: 20px 0;
      text-align: center;
      background-color: #fff;
      padding: 10px 0;
      border-radius: 6px;
      border: 1px solid #e76f51;
    ">
      ${otp}
    </p>
    <p style="font-size: 14px; color: #555;">
      This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
    </p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
    <p style="font-size: 12px; color: #999; text-align: center;">
      If you did not request this, please ignore this email.
    </p>
  </div>
`;

module.exports = otpTemplate;
