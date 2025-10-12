import  { v2 as cloudinary} from "cloudinary"
import { NextRequest } from "next/server"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})


export async function POST(request:NextRequest) {
    const body=await request.json()

    const{paramsToSign}=body

    const signature=cloudinary.utils.api_sign_request(paramsToSign,process.env.API_SECRET!)

    return Response.json({signature})
}

export {cloudinary}