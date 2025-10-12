import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Review from "@/models/review.model";
import { NextRequest } from "next/server";
import mongoose from "mongoose"
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const productId = searchParams.get("productId");

    if (!productId)
      return response({
        success: false,
        status: 400,
        message: "Missing product Id",
      });

    await connection();

    const ratingData = await Review.aggregate([
      {
        $match: { product:new mongoose.Types.ObjectId(productId), deletedAt: null },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $project:{
            rating:"$_id",
            count:1,
            _id:0
        }
      }
    ]);


    return response({success:true,status:200,data:ratingData})


  } catch (error:any) {
     catchError({error})
  }
}
