const { Router } = require("express");
//const mongoose = require('mongoose')
const router = require('../controllers/admin-controllers.js')
const userRoutes = require("./user_routes.js");
const chatRoutes = require("./chat-routes.js");

const appRouter = Router();

appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/chat", chatRoutes); //domain/api/v1/chats
appRouter.use("/api/users", router)//domain/api/v1/admin
appRouter.use("api/users/:userId/chats",router)//doamin/api/v1/admin
module.exports = appRouter;
