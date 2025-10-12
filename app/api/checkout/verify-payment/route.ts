import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { NextRequest } from "next/server";
import z from "zod";
import crypto from "crypto"
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const validSchema = z.object({
      razorpay_payment_id: z
        .string()
        .min(3, { message: "object_id is required" }),
      razorpay_order_id: z
        .string()
        .min(3, { message: "object_id is required" }),
      razorpay_signature: z
        .string()
        .min(3, { message: "object_id is required" }),
    });

    const isValid = validSchema.safeParse(payload);

    if (!isValid.success)
      return response({
        success: false,
        status: 400,
        message: "Missing or invalid input",
      });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      isValid.data;

     const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    
    if (generated_signature == razorpay_signature) {
          return response({success:true,status:200,message:"Payment verify successfully"})          
     }else
     {
         return response({
        success: false,
        status: 400,
        message: "Payment Verification failed",
      });
     }


  } catch (error:any) {
    catchError({error})
  }
}
