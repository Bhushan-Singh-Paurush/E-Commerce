import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:any}) {
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
           return response({success:false,status:403,message:"Unauthenticated"}); 
        
        const{id}=await params
        
        if(!id)
            return response({success:false,status:401,message:"Missing or invalid input"});
        
        const filter={
            _id:id,
            deleteAt:null
        }

         await connection();
        
        const category=await Coupon.findOne(filter)

        if(!category)
           return response({success:false,status:404,message:"Category not found"});


        return response({success:true,status:200,data:category});


    } catch (error:any) {
        catchError({error})
    }
}