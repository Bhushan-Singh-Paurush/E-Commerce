import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Review from "@/models/review.model";



export async function GET() {
  try {
       const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});
      
      await connection()

      const reviews=await Review.find({deletedAt:null}).populate({
        path:"product",
        select:"name media",
        populate:{
            path:"media",
            select:"secure_url"
        }
      }).sort({createdAt:-1,rating:-1}).limit(10)

      if(reviews.length===0)
         return response({success:false,status:404,message:"orders not found"});

      return response({success:true,status:200,data:reviews});

  } catch (error) {
    return catchError({error})
  }
}
