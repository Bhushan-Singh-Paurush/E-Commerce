import { connection } from "@/lib/DB_Connection";
import { sendMail } from "@/lib/mailSender";
import otpGeneration from "@/lib/otpGeneration";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import OTP from "@/models/otp.model";
import User from "@/models/user.model";
import { otpEmail } from "@/templates/otpEmail";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
       try {
         
           const vaildationSchema=zSchema.pick({
            email:true,
           })
           
           const payload=await request.json()
           
           const validData=vaildationSchema.safeParse(payload)
           
           if(!validData.success)
            return response({success:false,status:401,message:"Invalid or missing input"})
            
           const{email}=validData.data

           await connection()

           const user=await User.findOne({deletedAt:null,email}).lean()

           if(!user)
            return response({success:false,status:404,message:"user not found"})

           await OTP.deleteMany({email})
           
           const otp=otpGeneration()

           const mailStatus=await sendMail({subject:"Password Verification OTP",reciver:email,body:otpEmail({otp})}) 
       
           if(!mailStatus)
            return response({success:false,status:400,message:"Failer to send OTP re-try"})
       
           
           await OTP.create({email,otp})

           return response({success:true,status:200,message:"OTP is send to your Email. Please verify it"})
       
           
        } catch (error) {
          return catchError({error}) 
       }
}