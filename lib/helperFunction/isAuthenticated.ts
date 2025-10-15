import { getServerSession } from "next-auth";
import { nextOptions } from "../authOptions";

export async function isAuthenticated({role}:{role:string}){
       try {
           const session=await getServerSession(nextOptions)

           if(!session)
            return {
                isAuth:false
            }

            if(session?.user?.role!==role)
                return {
                   isAuth:false
                } 
            
            return {
                isAuth:true,
                email:session?.user?.email
            }    
       } catch (error) {
             return {
                isAuth:false,
                error
             }
       }  
} 