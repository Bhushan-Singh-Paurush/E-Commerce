import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";
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
        
        const items=await Order.aggregate([
            {
                $match:filter
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $project:{
                    _id:"$order_id",
                    order_id:1, 
                    payment_id:1,
                    name:1,
                    email:1,
                    phone:1,
                    country:1, 
                    state:1,
                    city:1,
                    pinCode:1, 
                    totalItems:{$size:'$products'},
                    subTotal:1, 
                    discount:1, 
                    couponDiscount:1,
                    total:1,
                    status:1,
                }
            }
        ])

       
        if(items.length===0)
          return response({success:false,status:404,message:"category not found"});
        
        const numberOfOrder=await Order.countDocuments(filter)
        
        return response({success:true,status:200,message:"all categories",data:{items,noOfRows:numberOfOrder}});

    } catch (error) {
       
       return catchError({error})
    }
}
