import express from "express";
import {registerUser,loginUser,forgotPassword,verifyOtp,resetPassword} from "../controller/authController.js";
import {protect} from "../middleware/authMiddleware.js";
const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgot-password",forgotPassword);
router.post("/verify-otp",verifyOtp);
router.post("/reset-password",resetPassword);
router.get("/profile",protect,(req,res)=>{
    res.json({message:"Welcome to profile"});
});
router.get("/dashboard",protect,(req,res)=>{
    res.json({message:"Welcome to dashboard"});
});
export default router;