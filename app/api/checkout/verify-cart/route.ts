import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Variant from "@/models/variant.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const products = await request.json();
     
    if (!products)
      return response({
        success: false,
        status: 400,
        message: "Missing product data",
      });

    await connection()

    const cartData = await Promise.all(
      products.map(async (product: Record<string, any>) => {
        try {
          
        const variant = await Variant.findOne({
            _id: product.variantId,
          }).populate("media", "secure_url").populate("product","_id name slug");
        
        if(!variant)
            throw new Error("Variant not found");
            

        return {
            productId:variant.product._id,
            variantId:variant._id,
            name:variant.product.name,
            slug:variant.product.slug,
            sellingPrice:variant.sellingPrice,
            mrp:variant.mrp,
            discount:variant.discount,
            picture:variant.media?.[0]?.secure_url,
            size:variant.size,
            color:variant.color,
            qty:product.qty

        }  
        
        
        } catch (error:any) {
            catchError({error})
        }
      })

    );

    return response({success:true,status:200,data:cartData})


  } catch (error:any) {
    console.log(error)
    return catchError({error})
  }
}
