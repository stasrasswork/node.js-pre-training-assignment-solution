function customHeader(req, res, next) {
  req.middlewareStep = (req.middlewareStep || 0) + 1;

  console.log(
    `[req-${req.requestId}][step-${req.middlewareStep}] customHeader -> set X-Custom-Header`
  );

  res.setHeader("X-Custom-Header", "express-task");
  next();
}

module.exports = customHeader;