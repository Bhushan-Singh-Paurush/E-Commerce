import { connection } from "@/lib/DB_Connection";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import User from "@/models/user.model";


export async function GET() {
    try {

        const{isAuth,email}=await isAuthenticated({role:"user"})

        if(!isAuth)
            return response({success:false,status:401,message:"unauthenticated"})

        await connection()
      
        const userDetails=await User.findOne({email,deletedAt:null})
      
        if(!userDetails)
            return response({success:false,status:404,message:"no user found"});
        
        return response({success:true,status:200,data:userDetails})

    } catch (error) {
      return  catchError({error})
    }
}