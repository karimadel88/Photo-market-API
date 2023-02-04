const express = require("express");
const userRouter = express.Router();
const {
  signIn,
  signUp,
  signOut,
  getAll,
} = require("./../controllers/user.controller");

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.get("/signout", signOut);
userRouter.get("/users", getAll);

module.exports = userRouter;
