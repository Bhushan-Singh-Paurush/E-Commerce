import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
         const{isAuth}=await isAuthenticated({role:"admin"})

         if(!isAuth)
            return response({success:false,status:401,message:"unauthenticated"})
        
        const{status,order_id}=await request.json()

        
        if(!status || !order_id)
            return response({success:false,status:400,message:"missing or invalid input"});

        await connection()


        
        const order=await Order.findOne({order_id})

        if(!order)
        return  response({success:false,status:404,message:"order not found"});

        order.status=status

        await order.save()
 
        return response({success:true,status:200,message:"status updated"});
 

    } catch (error) {
       return  catchError({error})
    }
}