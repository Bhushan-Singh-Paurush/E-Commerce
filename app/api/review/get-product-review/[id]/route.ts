import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Review from "@/models/review.model";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>})
{
     try {
        const searchParams=request.nextUrl.searchParams
        const getParams=await params
        const product=getParams.id
      
        if(!product)
         return response({success:false,status:400,message:"product id not found"})

        const limit=parseInt(searchParams.get("limit") ?? '10',10)
        const page=parseInt(searchParams.get("page") ?? '0',10)
        const skip=page*limit

        const matchQuery={product:new ObjectId(product),deletedAt:null}

        await connection()

        const allReviews=await Review.aggregate([
         {
            $match:matchQuery
         },
         {
            $lookup:{
               from:"users",
               localField:"user",
               foreignField:"_id",
               as:"user"
            }
         },
         {
            $unwind:"$user"
         },
         {
            $skip:skip
         },
         {
            $limit:limit+1
         },
         {
            $sort:{rating:-1}
         },
         {
            $project:{
               rating:1,
               review:1,
               title:1,
               createdAt:1,
               userName:"$user.name",
               avatar:"$user.avatar",
            }
         }
        ])
        
       let hasMore=false 
       if(allReviews.length>limit){
          hasMore=true;
          allReviews.pop(); 
       }


        return response({success:true,status:200,data:{
         allReviews,
         hasMore
        }})

     } catch (error) {
      
      return  catchError({error})
     }
}