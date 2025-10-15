import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Variant from "@/models/variant.model";
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
        
        const variant=await Variant.findOne(filter).populate("product").populate("media").lean()

        if(!variant)
           return response({success:false,status:404,message:"Product not found"});


        return response({success:true,status:200,data:variant});


    } catch (error) {
      return  catchError({error})
    }
}