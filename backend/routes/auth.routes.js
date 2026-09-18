import express from "express";

import {
  signUp,
  signIn,
  signOut,
  sendOtp,
  verifyOtp,
  resetPassword,
  googleSignup,
  googleSignin,
  //googleAuth
} from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);

authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-signup", googleSignup);
//authRouter.post("/google-auth", googleAuth);
authRouter.post("/google-signin", googleSignin);
export default authRouter;