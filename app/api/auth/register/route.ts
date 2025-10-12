import { connection } from "@/lib/DB_Connection";
import { sendMail } from "@/lib/mailSender";
import {catchError, response} from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/user.model";
import { emailVerificationLink } from "@/templates/emailVerificationLink";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";


export async function POST(request:NextRequest){
    try {
        const validationSchema=zSchema.pick({
            name:true,password:true,email:true
        })
        
        const payload=await request.json()
        
        const ValidData=validationSchema.safeParse(payload)

        if(!ValidData.success){
           return response({success:false,status:401,message:"Invalid or missing input fields",data:ValidData.error})
        }

        const{email,name,password}=ValidData.data

        await connection()

        const user=await User.findOne({email})

        if(user)
           return  response({success:false,status:409,message:"user already register"});
        

        const newUser=await User.create({name,email,password})

        const secret=new TextEncoder().encode(process.env.SECRET)
        
                
        const token=await new SignJWT({userId:newUser._id.toString()})
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({alg:"HS256"})
        .sign(secret)
        
        const link=`${process.env.NEXT_PUBLIC_URL}/auth/verify-email/${token}`
        
        await sendMail({subject:"Email verification mail",reciver:email,body:emailVerificationLink({link})})

        return response({success:true,status:200,message:"Registration success please verify your email"})
    
    } catch (error) {
        return catchError({error})
    }
}