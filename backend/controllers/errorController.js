module.exports = (err, req, res, next) => {
  console.log(err.statusCode);
  console.log(err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};
