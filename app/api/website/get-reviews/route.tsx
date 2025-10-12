import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Review from "@/models/review.model";

export async function GET() {
  try {
      await connection()

      const reviews=await Review.find({deletedAt:null}).populate({
        path:"user",
        select:"name",
        
      }).sort({rating:-1}).limit(10)

      if(reviews.length===0)
         return response({success:false,status:404,message:"orders not found"});

      return response({success:true,status:200,data:reviews});

  } catch (error:any) {
    catchError({error})
  }
}
