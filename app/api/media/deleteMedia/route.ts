import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Media from "@/models/media.model";
import { NextRequest } from "next/server";
import { cloudinary } from "../../sign-cloudinary-params/route";
import mongoose from "mongoose"
export async function PUT(request:NextRequest) {
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthorized"});

        const payload=await request.json()

        const ids=payload.ids 
        const deleteType=payload.deleteType

        if(!Array.isArray(ids) || ids.length==0)
            return response({success:false,status:401,message:"Invaild or missing input"});
        
        await connection()

        const media=await Media.find({_id:{$in:ids}})

        if(!media)
            return response({success:false,status:404,message:"Resource not found"});
           
        if(!["SD","RSD"].includes(deleteType))
            return response({success:false,status:401,message:"Invaild delete option. Delete type should be SD or RSD"});

        if(deleteType==="SD")
            await Media.updateMany({_id:{$in:ids}},{$set:{deletedAt:new Date().toISOString()}})
        else
            await Media.updateMany({_id:{$in:ids}},{$set:{deletedAt:null}})

        return response({success:true,status:200,message:`${deleteType==="SD" ? "Data move into the trash" : "data restore"}`});
   
   
    } catch (error) {
        return catchError({error})
    }
    
}
export async function DELETE(request:NextRequest) {
    
    const session=await mongoose.startSession()
    session.startTransaction()
    
    try {
        
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthorized"});

        const payload=await request.json()

        const ids=payload.ids 
        const deleteType=payload.deleteType

        if(!Array.isArray(ids) || ids.length==0)
            return response({success:false,status:401,message:"Invaild or missing input"});
        
        await connection()

        const media=await Media.find({_id:{$in:ids}}).session(session).lean()

        if(media.length==0)
            return response({success:false,status:404,message:"Resource not found"});

           
        if(deleteType!=="PD")
            return response({success:false,status:401,message:"Invaild delete option. Delete type should be PD"});

            
        
        
        await Media.deleteMany({_id:{$in:ids}}).session(session)

        const public_ids=media.map((item)=>item.public_id)
        
        await cloudinary.api.delete_resources(public_ids)
        
        await session.commitTransaction();
        
        
        return response({success:true,status:200,message:"data deleted successfully"});

    } catch (error) {
        await session.abortTransaction()
        return catchError({error})

    }finally{
         session.endSession()
    }
    
}