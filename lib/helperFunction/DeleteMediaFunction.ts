import toastFunction from "@/lib/toastFunction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function deleteMutation({queryKey,url}:{queryKey:string,url:string}) {
       const queryClient=useQueryClient()
  return useMutation({
        mutationFn:async({ids,deleteType}:{ids:Array<string>,deleteType:string})=>{
                  
            const{data:response}=await axios({
                      method:["SD","RSD"].includes(deleteType) ? "PUT" : "DELETE",
                      url:url,
                      data:{ids,deleteType}
                    })
              return response
              
        },

        onSuccess:(data)=>{
            toastFunction({type:"success",message:data.message})
            queryClient.invalidateQueries({queryKey:[queryKey]})
            
        },

        onError:(data)=>{
          toastFunction({type:"error",message:data.message})
        }
       }) 
}