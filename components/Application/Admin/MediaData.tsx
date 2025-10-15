"use client"
import toastFunction from '@/lib/toastFunction'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import MediaItem from './MediaItem'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useDeleteMutation } from '../../../lib/helperFunction/DeleteMediaFunction'
import LoadingGIF from '../LoadingGIF'
interface IMedia{
    secure_url:string
    _id:string
}
const MediaData = ({deleteType}:{deleteType:string}) => {
  const[selected,setSelected]=useState(Array<string>) 
  const[isChecked,setIsChecked]=useState(false)

  async function fetchMediaData(page:number) {
         try {
            const{data : response}=await axios.get(`/api/media/get-media?page=${page}&&limit=10&&deleteType=${deleteType}`)

            if(!response.success)
              throw new Error(response.message);

            return response
              
         } catch (error) {
            console.log(error)
            toastFunction({type:"error",message:(error as Error).message})
         }
   }

   const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['media-data',deleteType],
    queryFn: async({pageParam})=>await fetchMediaData(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined
    }
  })

  function handleCheck(){
      if(isChecked!==true){
       setSelected(data?.pages?.flatMap((page)=>(page.mediaData.map((file:{_id:string})=>(file._id)))) ?? [])
       setIsChecked(true)
      }else{
        setSelected([])
        setIsChecked(false)
      }
  }

const deleteMedia=useDeleteMutation({queryKey:"media-data",url:"/api/media/deleteMedia"})
  
function handleDelete({ids,deleteType}:{ids:Array<string>,deleteType:string}){
  deleteMedia.mutate({ids:ids,deleteType:deleteType})
  setSelected([])
  setIsChecked(false)
  }
  
  return (
    <div className=' w-full'>
      {status==="pending" ? 
      
      <LoadingGIF/> : <>{status==="error" ? <div className=' flex w-full h-full item-center justify-center text-red-500'>{error.message}</div> : 
      
      
      
      <div className=' flex flex-col gap-4'>
     
       <div>
       {
        selected.length>0 &&  <div className=' w-full h-[50px] bg-gray-500 py-8 px-4 rounded-xl border-gray-600 flex justify-between items-center'>
        <div className=' flex items-center gap-4'>

          <Checkbox
          id="toggle-2"
          className='w-5 h-5 border-primary'
          checked={isChecked}
          onCheckedChange={handleCheck}
        />
        <div className="grid gap-1.5 font-normal">
          <p className="leading-none font-medium">
            Select All
          </p>
        </div>
           </div>

         { deleteType==="SD" ?<Button variant="destructive" onClick={()=>handleDelete({ids:selected,deleteType:deleteType})}>Move to Trash</Button>: 
         
         
         <div className=' flex gap-4 items-center'>
         
        
         <Button onClick={()=>handleDelete({ids:selected,deleteType:"RSD"})}>Restore</Button>
         
         <Button variant="destructive" onClick={()=>handleDelete({ids:selected,deleteType:deleteType})}>Parmanent Delete</Button>


         
         </div>   }

      </div>
       } 
       </div>     
       

       <div className=' flex flex-col gap-4'>
      
      {data?.pages.map((page,index)=>(
        <div className=' w-full gap-4 grid grid-cols-2 lg:grid-cols-5 sm:grid-cols-3' key={index}>
          {page?.mediaData?.map((file:IMedia)=>(
            <div  key={file._id}>
                  <MediaItem file={file} selected={selected} setSelected={setSelected} handleDelete={handleDelete} deleteType={deleteType}/>
            </div>
          ))}
        </div>
      ))}

      <Button onClick={()=>fetchNextPage()} disabled={isFetchingNextPage} className=' w-fit'>Load More</Button>
      </div>
      
      </div>
      
      
      
      }</>}
    </div>
  )
}

export default MediaData
