import mongoose from "mongoose";

interface ICategory{
    name:string,
    slug:string,
    deletedAt:Date
}

const catSchema=new mongoose.Schema<ICategory>({
      name:{
        type:String,
        required:true,
        trim:true,
        unique:true
      },
      slug:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
      },
      deletedAt:{
        type:Date,
        default:null,
        index:true
      }
})

const Category=mongoose.models.Category || mongoose.model("Category",catSchema)

export default Category