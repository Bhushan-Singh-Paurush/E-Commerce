import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Category from "@/models/category.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

        const formVaildation=zSchema.pick({
            _id:true,name:true,slug:true
        })
         
        const payload=await request.json()
        
        const isVaildData=formVaildation.safeParse(payload)
        
        
        if(!isVaildData.success)
           return response({success:false,status:401,message:"invalid or missing input"}); 

        const{_id,name,slug}=isVaildData.data
   
        const category=await Category.findOne({_id});


        if(!category)
          return response({success:false,status:404,message:"Category not found"});

        category.name=name
        category.slug=slug

        await category.save();

        
        return response({success:true,status:200,message:"Category updated successfully"});


        } catch (error) {
          return catchError({error})
    }
}