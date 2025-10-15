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
                $match:{deletedAt:null}
             },
             {
                 $sort:{createdAt:-1}  
             },
             {
                $limit:20
             },
             {
                $project:{
                  order_id:1, 
                  payment_id:1,
                  totalItem:{$size:"$products"},
                  status:1,
                  total:1  
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
