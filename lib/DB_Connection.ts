import mongoose from "mongoose";

const MONGODB_URL=process.env.DB_URL!

if(!MONGODB_URL)
    throw new Error("Please Provide the connection string")


let cached=global.mongoose


if(!cached){
    cached=global.mongoose={
        conn:null,
        promise:null 
    }
}

export const connection=async()=>{
    if(cached.conn)
        return cached.conn;

    if(!cached.promise){
        cached.promise=mongoose.connect(MONGODB_URL).then(()=>mongoose.connection)
    }

    try {
        cached.conn=await cached.promise
    } catch (error) {
        throw error
    }

    return cached.conn
}