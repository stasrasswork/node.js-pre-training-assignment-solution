const { recordRequest } = require("../services/metricsService");

function metrics(req, res, next) {
  req.middlewareStep = (req.middlewareStep || 0) + 1;
  console.log(
    `[req-${req.requestId}][step-${req.middlewareStep}] metrics -> tracking request`
  );

  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    recordRequest(req.method, res.statusCode, durationMs);
  });

  next();
}

module.exports = metrics;