import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import Coupon from "@/models/coupon.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const validSchema = zSchema.pick({
      code: true,
      minShopingAmount: true,
    });

    const isValid = validSchema.safeParse(payload);

    if (!isValid.success)
      return response({
        success: false,
        status: 400,
        message: "Invalid or missing input",
      });

    const { code, minShopingAmount } = isValid.data;

    await connection()
    
    const coupon = await Coupon.findOne({ code: code, deletedAt: null });

    if (!coupon)
      return response({
        success: false,
        status: 404,
        message: "Coupon not found",
      });

    if (new Date() > coupon.validity)
      return response({
        success: false,
        status: 400,
        message: "Coupon expires",
      });

    if (coupon.minShopingAmount > minShopingAmount)
      return response({
        success: false,
        status: 400,
        message: "Minimun Shoping Amount is not sufficent",
      });

    return response({
      success: true,
      status: 200,
      message: "Coupon added successfully",
      data: coupon,
    });
  } catch (error) {
    return catchError({ error });
  }
}
