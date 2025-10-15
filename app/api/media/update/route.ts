import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Media from "@/models/media.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
      try {
       
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
           return response({success:false,status:403,message:"Unauthorized"});

        const validform=zSchema.pick({
            _id:true,alt:true,title:true
        })

        const payload=await request.json()

        const isValidData=validform.safeParse(payload)

        if(!isValidData.success)
            return response({success:false,status:401,message:"missing and invalid input"});

        const{_id,alt,title}=isValidData.data

        
        await connection();
        
        const updatedMedia=await Media.findOne({_id})

        if(!updatedMedia)
            return response({success:false,status:400,message:"Media not fount"});
       
        updatedMedia.title=title;
        updatedMedia.alt=alt;

        await updatedMedia.save()


        return response({success:true,status:200,message:"Media updated successfully"});

        
      } catch (error) {
        return catchError({error})
      }
}