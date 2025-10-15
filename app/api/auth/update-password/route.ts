import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){

    try {
        const validationSchema=zSchema.pick({
              email:true,password:true
        })

        const payload=await request.json()

        const validData=validationSchema.safeParse(payload)

        if(!validData.success)
            return response({success:false,status:401,message:"Invalid or missing input"})

        const{email,password}=validData.data

        const user=await User.findOne({deletedAt:null,email}).select("+password")

        if(!user)
           return response({success:false,status:404,message:"User not found"})

        user.password=password

        await user.save();

            
        return response({success:true,status:200,message:"Password updated successfully"})


    } catch (error) {
        return catchError({error})
    }

}