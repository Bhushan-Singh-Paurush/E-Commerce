import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Category from "@/models/category.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
       try {
          
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

        const validform=zSchema.pick({
            name:true,slug:true
          })

        const payload=await request.json()

        const isValidData=validform.safeParse(payload)

        if(!isValidData.success)
             return response({success:false,status:401,message:"invalid or missing input"});

        
        const{name,slug}=isValidData.data
        
        await connection();
        
        await Category.create({name,slug})
        
        return response({success:true,status:200,message:"category created successfully"});


       } catch (error) {
          return  catchError({error})
       }
    }       