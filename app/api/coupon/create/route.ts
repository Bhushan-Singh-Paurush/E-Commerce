import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

        const formValidation=zSchema.pick({
            code:true,
            discount:true,
            minShopingAmount:true,
            validity:true
        })

        const payload=await request.json()

        const couponData=payload

        couponData.validity=new Date(couponData.validity)

        const validData=formValidation.safeParse(couponData)

         
        if(!validData.success)
           return response({success:false,status:401,message:"missing or invalid input"}); 
    
        const{code,discount,minShopingAmount,validity}=validData.data

        await connection(); 

        const isPresent=await Coupon.findOne({code})
        
        if(isPresent)
            return response({success:false,status:400,message:"coupon already present"});


        await Coupon.create({code,discount,minShopingAmount,validity})

        return response({success:true,status:200,message:"coupon created successfully"});
    
    } catch (error) {
       return  catchError({error})
    }
}
