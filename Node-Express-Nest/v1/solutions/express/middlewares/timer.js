function timer(req, res, next) {
  const start = Date.now();
  req.middlewareStep = (req.middlewareStep || 0) + 1;

  console.log(
    `[req-${req.requestId}][step-${req.middlewareStep}] timer -> started`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[req-${req.requestId}] timer -> ${duration}ms (${res.statusCode})`
    );
  });

  next();
}

module.exports = timer;