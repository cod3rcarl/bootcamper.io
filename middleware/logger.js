// This is middleware,  it always takes req, res and next
// Logs request to console

// This is replaced in the main code by Morgan
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );

  next();
};

module.exports = logger;
