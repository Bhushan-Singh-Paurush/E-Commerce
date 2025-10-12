import axios from "axios";
import { useEffect, useMemo, useState } from "react";

 const useFetch=({method="GET",url,options={}}:{method?:string,url:string,options?:Record<string,any>})=> {
    const[loading,setLoading]=useState(false)
    const[file,setFile]=useState<any>(null)
    const[error,setError]=useState<any>(null)
    const[refresh,setRefresh]=useState(0)
    const optionString=JSON.stringify(options)

    const  requestOptions=useMemo(()=>{
           const opt={...options}
           if(method==="POST" && !opt?.data)
            opt.data={}

           return opt
    },[method,optionString])
    
    useEffect(()=>{
        
        (async()=>{
            try {
                setLoading(true)
                setError(null)
                const{data:response}=await axios({
                    method,
                    url,
                    ...requestOptions
                })
                if(!response.success)
                    throw new Error(response.message);
                    
                else
                setFile(response)
            } catch (error) {
                setError(error as any)                   
            }finally{
                setLoading(false)   
            }

        })();
    },[url,method,requestOptions,refresh])

    const refetchFunction=()=>{
          setRefresh((pre)=>pre+1)  
    }
 
     return {
        loading,
        refetchFunction,
        file,
        error,
     }
}

export default useFetch

