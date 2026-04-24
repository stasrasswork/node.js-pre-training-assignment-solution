const express = require("express");
const router = express.Router();
const { getSnapshot } = require("../services/metricsService");

router.get("/metrics", (req, res) => {
  return res.json({
    success: true,
    data: getSnapshot(),
  });
});

module.exports = router;