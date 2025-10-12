import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Media from "@/models/media.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:any}) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:401,message:"Unauthorized"})

        const getParams=await params
        const id=getParams.id
        
        const filter={
            deletedAt:null,
            _id:id
        }

        await connection();

        const media=await Media.findOne(filter).lean()

        if(!media)
            return response({success:false,status:404,message:"resource not found"})

        return response({success:true,status:200,message:"Media file found successfully",data:media})
        

    } catch (error:any) {
        return catchError({error:error})
    }
}