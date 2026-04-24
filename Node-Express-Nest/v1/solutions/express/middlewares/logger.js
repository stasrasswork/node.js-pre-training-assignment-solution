let requestCounter = 0;

function logger(req, res, next) {
  if (!req.requestId) {
    requestCounter += 1;
    req.requestId = requestCounter;
  }
  req.middlewareStep = 1;

  console.log(
    `[req-${req.requestId}][step-${req.middlewareStep}] logger -> ${req.method} ${req.originalUrl}`
  );

  res.on("finish", () => {
    console.log(
      `[req-${req.requestId}][done] ${req.method} ${req.originalUrl} -> ${res.statusCode}`
    );
  });

  next();
}

module.exports = logger;