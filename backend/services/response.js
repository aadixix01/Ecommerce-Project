const Response = {
  success: (
    res,
    status = 200,
    success = true,
    message = "Success",
    data = null,
  ) => {
    return res.status(status).json({
      success,
      message,
      data,
    });
  },
  error: (
    res,
    status = 500,
    success = false,
    message = "Error",
    error = null,
  ) => {
    return res.status(status).json({
      success,
      message,
      error: error ? (typeof error === "string" ? error : error.message) : null,
    });
  },
};

module.exports = { Response };
