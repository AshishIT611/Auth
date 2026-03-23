import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    userId:{
        type:Number,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    department:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["employee","support_engineer"],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
export default mongoose.model("User",userSchema);