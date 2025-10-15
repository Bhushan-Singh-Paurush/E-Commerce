import mongoose from "mongoose";
import Category from "./category.model";
import Media from "./media.model";
export interface IProduct{
    name:string,
    slug:string,
    mrp:number,
    sellingPrice:number,
    discount:number,
    media:mongoose.Schema.Types.ObjectId[],
    category:mongoose.Schema.Types.ObjectId
    description:string,
    deletedAt:Date
}

const productSchema=new mongoose.Schema<IProduct>({
      name:{
        type:String,
        required:true,
        trim:true,
      },
      slug:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
      },
      mrp:{
        type:Number,
        required:true
      },
      sellingPrice:{
        type:Number,
        required:true
      },
      discount:{
        type:Number,
        required:true
      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Category,
        required:true
      },
       description:{
        type:String,
        trim:true,
        required:true
       },
       media:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:Media,
        }
       ],
      deletedAt:{
        type:Date,
        default:null,
        index:true
      }
})
productSchema.index({category:1})
const Product=mongoose.models.Product || mongoose.model("Product",productSchema)

export default Product