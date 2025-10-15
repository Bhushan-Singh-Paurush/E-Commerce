import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Product from "@/models/product.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
           return response({success:false,status:403,message:"Unauthenticated"}); 
        
        const getParams=await params
        const id=getParams.id
        if(!id)
            return response({success:false,status:401,message:"Missing or invalid input"});
        
        const filter={
            _id:id,
            deleteAt:null
        }

         await connection();
        
        const product=await Product.findOne(filter).populate("category").populate("media").lean()

        if(!product)
           return response({success:false,status:404,message:"Product not found"});


        return response({success:true,status:200,data:product});


    } catch (error) {
       return catchError({error})
    }
}