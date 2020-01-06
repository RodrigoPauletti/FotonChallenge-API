const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const TaskController = require("./controllers/TaskController");

const authMiddleware = require("./middlewares/auth");

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/tasks", TaskController.index);
routes.get("/tasks/:id", TaskController.show);
routes.post("/tasks", TaskController.store);
routes.put("/tasks/:id", TaskController.update);
routes.delete("/tasks/:id", TaskController.destroy);

module.exports = routes;
