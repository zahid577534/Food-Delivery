import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { get } from "mongoose";
import { getCurrentUser } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

export default userRouter;