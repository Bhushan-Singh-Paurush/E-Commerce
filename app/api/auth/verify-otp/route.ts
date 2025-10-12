import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import OTP from "@/models/otp.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){

    try {
        
        const validationSchema=zSchema.pick({
            email:true,otp:true
        })

        const payload=await request.json()
        
        const validData=validationSchema.safeParse(payload)

        if(!validData.success)
            return response({success:false,status:401,message:"Invaild or missing input"})

        const{email,otp}=validData.data

        await connection()

        const checkOTP=await OTP.findOne({email,otp})
        
        if(!checkOTP)
            return response({success:false,status:404,message:"Invalid OTP or Expire OTP"})

        
        return response({success:true,status:200,message:"Verified OTP Successfully"})


       

    } catch (error) {
        
        catchError({error})
    }

}