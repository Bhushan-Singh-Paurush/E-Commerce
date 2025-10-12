import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import User from "@/models/user.model";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {

    try {
        const{token}=await request.json()
    
        if(!token)
        return response({success:false,status:400,message:"missing token"});

        const secret=new TextEncoder().encode(process.env.SECRET)
    
        const decode=await jwtVerify(token,secret)
        
        const userId=decode.payload.userId

        await connection();

        const user=await User.findById(userId)
         
        if(!user)
            return response({success:false,status:404,message:"user not found"});

        user.isEmailVerified=true;

        await user.save();

         return response({success:true,status:200,message:"email verified successfully"}); 

    } catch (error) {
        catchError({error})
    }
}