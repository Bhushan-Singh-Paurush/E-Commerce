import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})
        
        if(!isAuth)
            return response({success:false,status:403,message:"Unauthonticated"});

        const payload=await request.json();

        const ids=payload.ids;
        const deleteType=payload.deleteType; 

        if(!ids || !deleteType  || ids.length===0)
            return response({success:false,status:401,message:"invalid or missing input"});

        

        if(deleteType==="PD")
           return response({success:false,status:404,message:"Delete type must be SD or RSD"}); 
      
        
        
        if(deleteType==="SD")
            await Coupon.updateMany({_id:{$in:ids}},{deletedAt:new Date().toISOString()})
        else
            await Coupon.updateMany({_id:{$in:ids}},{deletedAt:null})
    
        
        return response({success:true,status:200,message:`${deleteType==="SD" ? "Data deleted successfully" : "Restore data successfully"}`}); 
        
    
    } catch (error) {
       return catchError({error})
    }
}
export async function DELETE(request:NextRequest) {
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})
        
        if(!isAuth)
            return response({success:false,status:403,message:"Unauthonticated"});

        const payload=await request.json();

        const ids=payload.ids;
        const deleteType=payload.deleteType; 

        if(!ids || !deleteType  || ids.length===0)
            return response({success:false,status:401,message:"invalid or missing input"});

        

        if(deleteType!=="PD")
           return response({success:false,status:404,message:"Delete type must be PD"}); 

        await Coupon.deleteMany({_id:{$in:ids}});
        
        return response({success:true,status:200,message:"Data is paramently delete"}); 
        
    
    } catch (error) {
       return catchError({error})
    }
}

