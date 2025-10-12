"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import MediaData from '@/components/Application/Admin/MediaData'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_MEDIA } from '@/routes/AdminPanelRoutes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const mediaPage = () => {
  const[deleteType,setDeleteType]=useState<"SD" | "PD">("SD")
  const searchParams=useSearchParams()

  useEffect(()=>{
      if(searchParams)
      {
         
        if(searchParams.get("trashof"))         
          setDeleteType("PD")
      
          else
            setDeleteType("SD")
      }

  },[searchParams])

  let data=[
    {
      page:"Home",
      url:"/admin/dashboard"
    },
    {
      page:"Media",
      url:"/admin/media"
    }
  ]
  
  return (
    <div className='px-4 pt-[70px]'>
      <BreadCrumbFunction data={data}/>
      <Card className=' mt-5'>
      <CardHeader className=' flex w-full justify-between items-center border-b-[1px] pb-4'>
      <h1 className=' text-2xl'>Media</h1> 
      
      { deleteType==="SD" ? 
      
      <div className=' flex items-center gap-4'>
      <UploadMedia isMulti={true}/>
      <Link href={`${ADMIN_MEDIA}?trashof="media"`}>
      <Button variant="destructive">Trash</Button>
      </Link>
      </div>
      
      :
      <Link href={ADMIN_MEDIA}>
      <Button>Back to Media</Button>
      </Link>}
      

      </CardHeader>
      <CardContent>
         <MediaData deleteType={deleteType}/>
     </CardContent>
      </Card>
      
    </div>
  )
}

export default mediaPage