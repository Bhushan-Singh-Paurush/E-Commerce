import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Product from "@/models/product.model";
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
        
        let items=await Product.find(filter,"-media").sort({createdAt:-1}).populate("category","name")

        if(items.length===0)
          return response({success:false,status:404,message:"Product not found"});
        
        items=items.map((ele)=>{
            return {
                    productName:ele.name,
                    slug:ele.slug,
                    MRP:ele.mrp,
                    sellingPrice:ele.sellingPrice,
                    Discount:ele.discount,
                    Media:ele.media,
                    categoryName:ele.category.name,
                    Description:ele.description,
                    deletedAt:ele.deletedAt,
                    _id:ele._id
            }
        })
        
             const numberOfProduct=await Product.countDocuments(filter)
        
        return response({success:true,status:200,message:"all categories",data:{items,noOfRows:numberOfProduct}});

    } catch (error) {
       return catchError({error})
    }
}
