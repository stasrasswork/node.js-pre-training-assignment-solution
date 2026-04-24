const express = require("express");

const logger = require("./middlewares/logger");
const timer = require("./middlewares/timer");
const customHeader = require("./middlewares/customHeader");
const errorHandler = require("./middlewares/errorHandler");
const metricsMiddleware = require("./middlewares/metrics");

const usersRoutes = require("./routes/users.routes");
const todosRoutes = require("./routes/todos.routes");
const metricsRoutes = require("./routes/metrics.routes");

const app = express();

app.use(express.json());
app.use(logger);
app.use(timer);
app.use(customHeader);
app.use(metricsMiddleware);

app.use(usersRoutes);
app.use(todosRoutes);
app.use(metricsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;