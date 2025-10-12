import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IUser{
       _id?:mongoose.Types.ObjectId
       role?:"user" | "admin"
       name:string
       password:string
       email:string
       createdAt?:Date
       updatedAt?:Date
       avatar?:{
        url:string,
        public_id:string
       }
      isEmailVerified?:boolean,
      phone?:number,
      address?:string,
      deletedAt?:Date 


}

const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    avatar:{
        url:{
        type:String,
        trim:true,
        default:""
        },
        public_id:{
        type:String,
        trim:true,
        default:""  
        }
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number,
        trim:true
    },
    address:{
        type:String,
        trim:true
    },
    deletedAt:{
        type:Date,
        default:null,
        index:true
    }
    
},{timestamps:true})


userSchema.pre("save",async function (next) {
    if(this.isModified("password"))
        this.password=await bcrypt.hash(this.password,10)

    next();
})

userSchema.methods={
    comparePassword:async function (password:string) {
                 return await bcrypt.compare(password,this.password)
    }
}
const User=mongoose.models.User || mongoose.model<IUser>("User",userSchema)

export default User