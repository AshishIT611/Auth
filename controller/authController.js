import User from "../models/user.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import {setOtp,getOtp,deleteOtp} from "../utils/otpStore.js";
export const registerUser=async(req,res)=>{
    try{
        const {fullName,department,role,email,password,confirmPassword}=req.body;
        if(!fullName || !department || !role || !email || !password || !confirmPassword){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password!==confirmPassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"User already exists"});
        }
        const lastUser=await User.findOne().sort({userId:-1});
        let newUserId=101;
        if(lastUser){
            newUserId=lastUser.userId+1;
        }
        const hasedPassword=await bcrypt.hash(password,10);
        const user=new User({
            userId:newUserId,
            fullName,
            department,
            role,
            email,
            password:hasedPassword
        });
        await user.save();
        res.status(201).json({
            message:"User registered successfully",
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};  
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email,isDeleted:false});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const checkPassword=await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            {
                id:user.userId,
                role:user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user.userId,
                fullName:user.fullName,
                role:user.role
            }
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};
export const forgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email,isDeleted:false});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const otp=Math.floor(1000+Math.random()*9000).toString();
        setOtp(email,otp);
        await sendEmail(email,otp);
        res.json({message:"OTP sent successfully"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};
export const verifyOtp=async(req,res)=>{
    try{
        const {email,otp}=req.body;
        const record=getOtp(email);
        if(!record){
            return res.status(400).json({message:"OT not found"});
        }
        if(record.expire<Date.now){
            deleteOtp(email);
            return res.status(400).json({message:"OTP expired"});
        }
        if(record.otp!==otp){
            return res.status(400).json({message:"Invalid OTP"});
        }
        res.json({message:"OTP verified"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};
export const resetPassword=async(req,res)=>{
    try{
        const {email,password,confirmPassword}=req.body;
        if(password!==confirmPassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
        const record=getOtp(email);
        if(!record){
            return res.status(400).json({message:"OTP verification required"});
        }
        const user=await User.findOne({email});
        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword;
        await user.save();
        deleteOtp(email);
        res.json({message:"Password reset successful"});
    }
    catch(eror){
        res.status(500).json({error:error.message});
    }
};