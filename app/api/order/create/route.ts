import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { sendMail } from "@/lib/mailSender";
import { zSchema } from "@/lib/zodSchema";
import Order from "@/models/order.model";
import { orderNotification } from "@/templates/orderNotification";
import { NextRequest } from "next/server";
import * as z from "zod";
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const validSchema = zSchema
      .pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        state: true,
        city: true,
        pinCode: true,
        landMark: true,
      })
      .extend({
        orderNote: z.string().optional(),
        subTotal: z
          .number()
          .gt(0, { message: "subTotal must be greater than 0" }),
        discount: z.number().min(0, { message: "discount must be at least 0" }),
        couponDiscount: z
          .number()
          .min(0, { message: "coupon discount must be at least 0" }),
        total: z.number().gt(0, { message: "Total must be greater than 0" }),
        order_id: z.string().min(3, { message: "Order id is required" }),
        payment_id: z.string().min(3, { message: "Payment id is required" }),
        status: z.string().optional(),
        products: z.array(z.object({
                productId:z.string().min(24,{ message: "ProductId id is required" }),
                variantId:z.string().min(24,{ message: "VariantId id is required" }),
                name:z.string().min(3,{ message: "Name is required" }),
                slug:z.string().min(3,{ message: "slug is required" }),
                sellingPrice:z.number().gt(0, { message: "Selling Price must be greater than 0" }),
                mrp:z.number().gt(0, { message: "MRP must be greater than 0" }),
                discount:z.number().min(0, { message: "Discount must be at least 0" }),
                picture:z.string().min(3,{ message: "Picture is required" }),
                size:z.string().min(1,{ message: "Size is required" }),
                color:z.string().min(2,{ message: "Color is required" }),
                qty:z.number().gt(0, { message: "MRP must be greater than 0" }),
        })),
      });

      const isValid=validSchema.safeParse(payload)

      if(!isValid.success)
        return response({success:false,status:400,message:"Missing or invalid input"});

     await connection()
     
      const order=await Order.create(payload)

      if(!order)
        return response({success:false,status:400,message:"Order not created"});

      const url=`${process.env.NEXT_PUBLIC_URL}/order-details/${order.order_id}`
      
      const data={
        order_id:order.order_id,
        orderDetailsUrl:url
      }
      await sendMail({subject:"Payment Successful",reciver:order.email,body:orderNotification({data})});

      return response({success:true,status:200,data:order.order_id}) 


  } catch (error:any) {
    catchError({error})
  }
}
