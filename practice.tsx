import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const practice = () => {
  const[data,setData]=useState<Array<Record<string,any>>>([])
  const[page,setPage]=useState(0)
  const[limit,setLimit]=useState(10)
  const[isMore,setIsMore]=useState(false)
  
  useEffect(()=>{
    
    (async()=>{
        try {
            
            const{data:response}=await axios.get(`/api/get-page-detail?page=${page}&&limit=${limit}`)
            
            if(!response.success)
                throw new Error(response.message);
            
            setData(response.data.posts)
            setIsMore(response.data.isMore)
        } catch (error:any) {
            toast.error(error.message)
        }
    })();

  },[page,limit])
    return (
    <div className=' w-full relative'>
        {data.map((post,index)=>(
           <div key={index}>
            <h1>{post.heading}</h1>
            <div className=' flex w-full items-center justify-between'>
                <p>{post.desp}</p>
                <image href={post.image} />
            </div>
           </div>
        ))}
        <div className=' flex items-center justify-between absolute w-full border-0'>
                <div>
                {isMore && <button onClick={()=>setPage((pre)=>pre+1)}>Next</button>}
                {page>0 && <button onClick={()=>setPage((pre)=>pre-1)}>Previous</button>}
                </div>
                <label>
                    limit
                <select onChange={(e)=>setLimit(parseInt(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
                </label>
        </div>
    </div>
  )
}

export default practice

