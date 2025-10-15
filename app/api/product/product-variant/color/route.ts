import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Variant from "@/models/variant.model";

export async function GET(){
    try {
        
        await connection()
        
        const colors=await Variant.aggregate([
            {
                $group:{_id:"$color"}
            },
            {
                $project:{_id:0,color:"$_id"}
            }
        ])

        if(colors.length==0)
            return response({success:false,status:404,message:"resource not found"})

        return response({success:true,status:200,data:colors})

    } catch (error) {
      return  catchError({error})
    }
}