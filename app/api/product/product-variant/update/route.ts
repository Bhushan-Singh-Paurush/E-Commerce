import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Variant from "@/models/variant.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})
        
        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"}); 
                
        const payload=await request.json();
        const{_id,...updateData}=payload

        if(!_id)
            return response({success:false,status:401,message:"Variant id not found"}); 
        
        
        await connection();
        
        
        const updateVariant=await Variant.findByIdAndUpdate(_id,{$set:updateData},{new:true,runValidators:true})
        

        if(!updateVariant)
           return response({success:false,status:400,message:"Variant not updated"});  
        
        
        return response({success:true,status:200,message:"Variant updated successfully"})
        

    } catch (error:any) {
        catchError({error})
    }
}