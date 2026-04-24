function validateTodoBody(req, res, next) {
  const { title } = req.body || {};
  
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }

  next();
}

module.exports = validateTodoBody;