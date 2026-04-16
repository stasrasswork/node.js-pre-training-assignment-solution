// Express.js error handler middleware for ToDo API
// TODO: implement
function errorHandler(err, req, res, next) {
    res.status(500).json({ error: err.message });
}
module.exports = errorHandler; 