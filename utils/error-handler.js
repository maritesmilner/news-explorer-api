module.exports.handleError = (err, res) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      status: 'error',
      statusCode: statusCode,
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
};