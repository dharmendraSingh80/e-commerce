//manage routes/path to ProductController

import express from "express";
import UserController from "./user.controller.js";

//initialize express router
const userRouter = express.Router();

const userController = new UserController();
//all the paths to controller methods

userRouter.post(
  "/signup",

  userController.signUp
);
userRouter.post("/signin", userController.signIn);
export default userRouter;
