import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Review from "@/models/review.model";
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


         const items=await Review.aggregate([
            {
                $match:filter
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $lookup:{
                    from:"products",
                    localField:"product",
                    foreignField:"_id",
                    as:"product"
                }
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
                $project:{
                    product:"$product.name",
                    user:"$user.name",
                    title:1,
                    rating:1,
                    review:1
                }
            }
         ])
        
       
        if(items.length===0)
          return response({success:false,status:404,message:"Review not found"});
        
             const numberOfReview=await Review.countDocuments(filter)
        
        return response({success:true,status:200,message:"all Reviews",data:{items,noOfRows:numberOfReview}});

    } catch (error) {
      return  catchError({error})
    }
}
