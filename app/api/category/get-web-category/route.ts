import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Category from "@/models/category.model";


export async function GET(){
    try {
        
        await connection()
        
   
        
        const category=await Category.find({deletedAt:null}).lean()


        if(category.length==0)
            return response({success:false,status:404,message:"category not found"})

        return response({success:true,status:200,data:category})
    
    } catch (error) {
        return catchError({error})
    }
}