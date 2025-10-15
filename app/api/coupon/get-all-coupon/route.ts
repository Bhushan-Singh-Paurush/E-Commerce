import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest){
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});
        
        const searchParams=request.nextUrl.searchParams
        const deleteType=searchParams.get("deleteType");

       let filter:{
        deletedAt:null | {$ne:null}
       }={
        deletedAt:null
       }

       if(deleteType==="PD")
        filter={
        deletedAt:{$ne:null}
        }

         await connection();
        
        const items=await Coupon.find(filter).sort({createdAt:-1})

        if(items.length===0)
          return response({success:false,status:404,message:"Coupon not found"});
        
             const numberOfProduct=await Coupon.countDocuments(filter)

        
             return response({success:true,status:200,message:"all categories",data:{items,noOfRows:numberOfProduct}});

    } catch (error) {
       
       return catchError({error})
    }
}
