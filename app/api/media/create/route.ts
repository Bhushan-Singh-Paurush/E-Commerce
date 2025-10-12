import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Media from "@/models/media.model";
import { NextRequest } from "next/server";
import { cloudinary } from "../../sign-cloudinary-params/route";



export async function POST(request:NextRequest) {
   

        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
        {
            return response({success:false,status:403,message:"access an authenticated"})
        }

        let payload
        
        try {
        
        payload=await request.json()
    
        
        await connection()
        

        await Media.insertMany(payload)

        return response({success:true,status:200,message:"Media uploaded successfully"})
    
    } catch (error) {

        if(payload && payload.length>0)
        {
            const public_ids=payload.map((item:Record<string,any>)=>item.public_id)

            try {
                await cloudinary.api.delete_resources(public_ids)
            } catch (delteError) {
                (error as any).cloudinary=delteError
            }
        }
        return catchError({error})
    }
}