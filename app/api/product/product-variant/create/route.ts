import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Variant from "@/models/variant.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
          return response({success:false,status:403,message:"Unauthenticated"});

        const formValidation=zSchema.pick({
                product:true,
                sku:true,
                color:true,
                size:true,
                mrp:true,
                sellingPrice:true,
                discount:true,
                description:true,
                media:true,
        })
        
        const payload=await request.json()

        const isVarifiedData=formValidation.safeParse(payload)

        if(!isVarifiedData.success)
            return response({success:false,status:401,message:"missing or invalid data"});
    
          const{
                product,
                sku,
                color,
                size,
                mrp,
                sellingPrice,
                discount,
                description,
                media,
        }=isVarifiedData.data


        const variant=await Variant.create({
                product,
                sku,
                color,
                size,
                mrp,
                sellingPrice,
                discount,
                description,
                media,
        })

        if(!variant)
            return response({success:false,status:400,message:"Product Variant not created successfully"});
    
    
        return response({success:true,status:200,message:"Product Variant created successfully"});
    
    
    } catch (error) {
       return catchError({error})
    }
}