import mongoose from "mongoose"


interface IReview{
    review:string,
    rating:number,
    product:mongoose.Schema.Types.ObjectId,
    user:mongoose.Schema.Types.ObjectId,
    title:string,
    deletedAt:Date
}

const reviewSchema=new mongoose.Schema<IReview>({
      review:{
        type:String,
        trim:true,
        required:true
      },
      rating:{
        type:Number,
        trim:true,
        required:true
      },
      title:{
        type:String,
        trim:true,
        required:true
      },
      deletedAt:{
        type:Date,
        default:null,
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      }
},{timestamps:true})

const Review=mongoose.models.Review || mongoose.model("Review",reviewSchema)

export default Review