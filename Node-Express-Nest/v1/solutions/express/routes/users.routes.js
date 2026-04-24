const express = require("express");
const router = express.Router();

router.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { active } = req.query;

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  if (active !== "true" && active !== "false") {
    return res
      .status(400)
      .json({ error: 'active must be "true" or "false"' });
  }

  const status = active === "true" ? "active" : "inactive";
  return res.json({ message: `User ${id} is ${status}.` });
});

module.exports = router;