import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Razorpay from "razorpay";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const amount = await request.json();

    if (!amount)
      return response({
        success: false,
        status: 400,
        message: "Amount not found",
      });

    const options = {
      amount: amount * 100,
      currency: "INR",
    };

    const razorpayInstance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order=await razorpayInstance.orders.create(options)
    
    return response({success:true,status:200,data:order})
    
  } catch (error:any) {
    catchError({error})
  }
}
