import mongoose from "mongoose";

interface ICoupon{
    code:string,
    discount:number,
    minShopingAmount:number,
    validity:Date,
    deletedAt:Date
}

const couponSchema=new mongoose.Schema<ICoupon>({
           code:{
            type:String,
            unique:true,
            required:true,
            trim:true
           },
           discount:{
            type:Number,
            required:true,
           },
           minShopingAmount:{
            type:Number,
            required:true,
           },
           validity:{
            type:Date,
            required:true
           },
           deletedAt:{
            type:Date,
            default:null
           }
})


const Coupon=mongoose.models.Coupon || mongoose.model("Coupon",couponSchema)

export default Coupon
