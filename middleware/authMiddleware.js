import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const protect=async(req,res,next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded._id).select("-password");
        next();
    }
    catch(error){
        console.log("JWT Error:",error.message);
        return res.status(401).json({message:"Token invalid"});
    }
};