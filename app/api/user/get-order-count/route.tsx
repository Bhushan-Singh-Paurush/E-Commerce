import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const getSearchParams=request.nextUrl.searchParams
        const email=getSearchParams.get("email")

        const{isAuth}=await isAuthenticated({role:"user"})

        if(!isAuth)
            return response({success:false,status:401,message:"unauthenticated"})

        await connection()
      
       const count=await Order.countDocuments({email,deletedAt:null}) 

        return response({success:true,status:200,data:{count}})

    } catch (error:any) {
        catchError({error})
    }
}