import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Review from "@/models/review.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
     try {
        const{isAuth}=await isAuthenticated({role:"user"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

        const validform=zSchema.pick({
            review:true,rating:true,title:true,product:true,user:true,
        })

        const payload=await request.json()
        
        const isValid=validform.safeParse(payload)

        if(!isValid.success)
           return response({success:false,status:401,message:"invalid and missing input"}); 
     
    const{review,rating,title,product,user}=isValid.data

    const newReview=await Review.create({review,rating,title,product,user})

    if(!newReview)
        return response({success:false,status:400,message:"Review not created"}); 
    
    return response({success:true,status:200,message:"Review created successfully"});

    } catch (error) {
       return catchError({error})
     }
}