import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Category from "@/models/category.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";

export async function GET() {
  try {
       const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

      
      await connection()

      const[totalCategory,totalProduct,TotalCustomers,totalOrders]=await Promise.all(
                   [ Category.countDocuments({deletedAt:null}),
                   Product.countDocuments({deletedAt:null}),
                   User.countDocuments({deletedAt:null,role:"user"}),
                   Order.countDocuments({deletedAt:null})]
      )
      
      return response({success:true,status:200,data:{totalCategory,totalProduct,TotalCustomers,totalOrders}})
 
  } catch (error) {
    return catchError({error})
  }
}
