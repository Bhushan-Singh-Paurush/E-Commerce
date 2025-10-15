import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    try {
        const{isAuth}=await isAuthenticated({role:"admin"})

        if(!isAuth)
            return response({success:false,status:403,message:"Unauthenticated"});

        const formVaildation=zSchema.pick({
            _id:true,code:true,discount:true,minShopingAmount:true,validity:true
        })
         
        const payload=await request.json()
        
        const couponData=payload

        couponData.validity=new Date(couponData.validity)
        
        const isVaildData=formVaildation.safeParse(payload)
        
        
        if(!isVaildData.success)
           return response({success:false,status:401,message:"invalid or missing input"}); 

        const{_id,code,discount,minShopingAmount,validity}=isVaildData.data
   
        const coupon=await Coupon.findOne({_id});


        if(!coupon)
          return response({success:false,status:404,message:"Coupon not found"});

        coupon.code=code
        coupon.discount=discount
        coupon.minShopingAmount=minShopingAmount
        coupon.validity=validity


        await coupon.save();

        
        return response({success:true,status:200,message:"Coupon updated successfully"});


        } catch (error) {
         return catchError({error})
    }
}