import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:any}) {
    try {
        
        const getParam=await params
        
        const order_id=getParam.orderId
       
        if(!order_id)
            return response({success:false,status:400,message:"Order Id is not found"});

        await connection()

        const order=await Order.findOne({order_id})

        if(!order)
            return response({success:false,status:404,message:"Order not found"});

        return response({success:true,status:200,data:order});
 

    } catch (error:any) {
        catchError({error})
    }
}