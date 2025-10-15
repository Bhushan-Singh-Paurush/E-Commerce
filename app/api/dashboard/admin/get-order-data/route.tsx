import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";


export async function GET() {
  try {
       const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

      
      await connection()

      const orders=await Order.aggregate([
             {
                $match:{deletedAt:null,status:{$in:["Processing","Shipped","Delivered"]}}
             },
             {
                $group:{
                      _id:{
                         year:{$year:"$createdAt"},
                         month:{$month:"$createdAt"}
                      },
                      count:{$sum:1}
                }
             },
             {
                $sort:{
                    "_id.year":1,
                    "_id.month":1
                }
             }
      ])


      if(orders.length===0)
         return response({success:false,status:404,message:"orders not found"});

      return response({success:true,status:200,data:orders});

  } catch (error) {
    return catchError({error})
  }
}
