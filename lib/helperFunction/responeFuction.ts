import { NextResponse } from "next/server";

export function response<T=unknown>({success,status,message,data}:{success:boolean,status:number,message?:string,data?:T}){
  return NextResponse.json({
    success,
    status,
    message,
    data,
  });
};

interface MongoError{
  code?:number,
  message?:string,
  keyPattern?:Record<string,number>
}

interface CustomErrorProps{
  error:unknown,
  customMessage?:string
}

export function catchError({error,customMessage}:CustomErrorProps){
         let message="Inter server error"
         let status=500

         if(error instanceof Error)
         message=error.message

         if(process.env.NODE_ENV==="development" && customMessage){
          message=customMessage
          status=400
         } 

        const mongoError=error as MongoError

        if(mongoError?.code===11000 && mongoError?.keyPattern){
         const keys=Object.keys(mongoError.keyPattern).join(", ")
         message=`Duplicate fields: ${keys}`
         status=400
        }
        return response({success:false,status,message})
}