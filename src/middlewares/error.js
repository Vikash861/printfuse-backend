module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    statusCode: 500,
    status: "failed",
    data: null,
    message: err.message || "Internal Server Error"
  });
};
