import mongoose from "mongoose";

interface IOtp{
    otp:string,
    email:string,
    expiredAt:Date
}

const otpSchema=new mongoose.Schema<IOtp>({
        email:{
            type:String,
            required:true,
            trim:true
        },
        otp:{
            type:String,
            required:true,
            trim:true
        },
        expiredAt:{
            type:Date,
            default:()=>new Date(Date.now() + 10*60*1000)

        } 
})

otpSchema.index({expiredAt:1},{expireAfterSeconds:0})

const OTP=mongoose.models.OTP || mongoose.model("OTP",otpSchema)

export default OTP