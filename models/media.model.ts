import mongoose from "mongoose"

interface IMedia{
    asset_id:string,
    public_id:string,
    path:string,
    thumbnail_url:string,
    secure_url:string
    alt?:string,
    title?:string,
    deletedAt?:Date | null
}

const mediaSchema=new mongoose.Schema<IMedia>({
    asset_id:{
        type:String,
        required:true,
        trim:true
    },
    public_id:{
        type:String,
        required:true,
        trim:true
    },
    path:{
        type:String,
        required:true,
        trim:true
    },
    thumbnail_url:{
        type:String,
        required:true,
        trim:true
    },
    secure_url:{
        type:String,
        required:true,
        trim:true
    },
    alt:{
        type:String,
        trim:true
    },
    title:{
        type:String,
        trim:true
    },
    deletedAt:{
        type:Date,
        default:null,
        index:true
    },
})

const Media=mongoose.models.Media || mongoose.model("Media",mediaSchema)

export default Media