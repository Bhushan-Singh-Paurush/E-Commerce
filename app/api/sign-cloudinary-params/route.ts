import cloudinary from "@/lib/cloudinary"
import { NextRequest } from "next/server"


export async function POST(request:NextRequest) {
    const body=await request.json()

    const{paramsToSign}=body

    const signature=cloudinary.utils.api_sign_request(paramsToSign,process.env.API_SECRET!)

    return Response.json({signature})
}
