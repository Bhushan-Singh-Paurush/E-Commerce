import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});
        
        const searchParams=request.nextUrl.searchParams
        const deleteType =searchParams.get("deleteType")
       
       
        let filter:{ deletedAt:{$ne:null} | null,role:string}={deletedAt:null,role:"user"}

        if(deleteType==="PD")
            filter={
               deletedAt:{$ne:null},
               role:"user" 
            }

        await connection();

        const items=await User.find(filter).sort({createdAt:-1}).lean()
        
        if(items.length===0)
            return response({success:false,status:400,message:"No Customer found"});

        const numberOfProduct=await User.countDocuments(filter)
        

        return  response({success:true,status:200,message:"all Customers",data:{items,noOfRows:numberOfProduct}});
    
    } catch (error) {
       return catchError({error})
    }
}