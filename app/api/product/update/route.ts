import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Product from "@/models/product.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})
        
        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"}); 
                
        const payload=await request.json();
        const{_id,...updateData}=payload

        if(!_id)
            return response({success:false,status:401,message:"user id not found"}); 
        
        
        await connection();
        
        
        const updatedProduct=await Product.findByIdAndUpdate(_id,{$set:updateData},{new:true,runValidators:true})
        

        if(!updatedProduct)
           return response({success:false,status:400,message:"Product not updated"});  
        
        
        return response({success:true,status:200,message:"Product updated successfully"})
        

    } catch (error:any) {
        console.log("this is error",error)
        catchError({error})
    }
}