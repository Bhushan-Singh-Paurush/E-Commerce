import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Order from "@/models/order.model";

export async function GET() {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:401,message:"unauthenticated"});

        await connection()


        const statusData=await Order.aggregate([
              {
                $match:{deletedAt:null}
              },
              {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }
              },
              {
                $project:{
                    _id:0,
                    status:"$_id",
                    orders:"$count"
                }
              } 
        ])

        if(statusData.length===0)
             return response({success:false,status:404,message:"data not found"});
        

        return response({success:true,status:200,data:statusData})
    
    } catch (error:any) {
        catchError({error})
    }
}