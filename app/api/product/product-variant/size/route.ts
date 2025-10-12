import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Variant from "@/models/variant.model";
import { first } from "ckeditor5";

export async function GET(){
    try {
        
        await connection()

        const sizes=await Variant.aggregate([
            {
                $group:{_id:"$size",first:{$first:"$_id"}}    
                
            },
            {
                        $sort:{_id:1}
            },
            {
                    $sort:{first:1}
            },
            {
                $project:{_id:0,size:"$_id"}
            }
        ])



        if(sizes.length===0)
            return response({success:false,status:404,message:"resource not found"})

        return response({success:true,status:200,data:sizes})


    } catch (error:any) {
        
        catchError({error})        
   }
}