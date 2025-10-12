import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const getSearchParams=request.nextUrl.searchParams
        const limit=parseInt(getSearchParams.get("limit") ?? "0",10)
        const email=getSearchParams.get("email")

        const{isAuth}=await isAuthenticated({role:"user"})

        if(!isAuth)
            return response({success:false,status:401,message:"unauthenticated"})

        await connection()
      
        const orders=await Order.aggregate([
            {
                $match:{
                    deletedAt:null,email:email
                }
            },
            {
                $limit:limit
            },
            {
                $project:{
                    order_id:1,
                    total:1,
                    items:{$size:"$products"}
                }
            }
        ])
      
        if(orders.length===0)
            return response({success:false,status:404,message:"no order found"});
        
        return response({success:true,status:200,data:orders})

    } catch (error:any) {
        catchError({error})
    }
}