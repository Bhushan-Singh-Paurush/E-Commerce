import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Product from "@/models/product.model";


export async function GET(){
       try {
            
         await connection()

         const products=await Product.find({deletedAt:null}).select("name mrp slug sellingPrice").populate("media").limit(8)

        if(products.length==0)
            return response({success:false,status:404,message:"Product not found"})

        
        return response({success:true,status:200,message:"All Products",data:products})

        } catch (error:any) {
            console.log(error)
            catchError({error})
       }            
}