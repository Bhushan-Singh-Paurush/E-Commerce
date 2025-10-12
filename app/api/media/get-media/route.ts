import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Media from "@/models/media.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthorized"});

        const searchParams=request.nextUrl.searchParams

        const pageNumber=parseInt(searchParams.get("page") ?? "0",10);
        const limit=parseInt(searchParams.get("limit") ?? "10",10);
        const deleteType=searchParams.get("deleteType");

  
        
        let filter:{deletedAt:null | {$ne:null}}={deletedAt:null}
       
        if(deleteType==="PD")
             filter={
                 deletedAt:{$ne:null}
            }    
        
        await connection();
        
        const mediaData=await Media.find(filter).sort({createdAt:-1,_id:-1}).skip(pageNumber*limit).limit(limit).lean()

        const totalMedia=await Media.countDocuments(filter)

        return NextResponse.json({
            success:true,
            status:200,
            mediaData:mediaData,
            hasMore: (pageNumber+1) * limit <totalMedia
        })

    } catch (error) {
        return  catchError({error})
}
}