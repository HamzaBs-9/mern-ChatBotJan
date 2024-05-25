const { Router } = require("express");
const {
  getAllUsers,
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
} = require("../controllers/user-controllers.js");
const { verifyToken } = require("../utils/token-manager.js");

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup",  userSignup);
userRoutes.post("/login",  userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

module.exports = userRoutes;
