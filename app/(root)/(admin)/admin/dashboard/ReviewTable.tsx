"use client"
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import image_placeholder from "@/public/assets/images/img-placeholder.webp"
import useFetch from '@/hooks/useFetch'
import Image from 'next/image'
import { Rating } from '@mui/material'
const ReviewTavle = () => {
  const[response,setResponse]=useState<Array<Record<string,any>>>([])
  const{file}=useFetch({url:"/api/dashboard/admin/get-latest-review"})

  useEffect(()=>{
     if(file && file.success)
      setResponse(file.data);
  },[file])

  console.log("this is review",response)

  return (
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Product</TableHead>
      <TableHead>Rating</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    
    {response && response.map((item,index)=>(
           <TableRow key={index}>
            <TableCell className=' flex items-center gap-4'>
                <Image src={item?.product?.media?.[0]?.secure_url || image_placeholder} width={50} height={50} alt='Image'/>
                <p>{item?.product?.name.split(" ")[0]+"..."}</p>
            </TableCell>
            <TableCell>
              <Rating size='small' value={item?.rating} readOnly/>
            </TableCell>

           </TableRow>
    ))}
  </TableBody>
</Table>
    
  )
}

export default ReviewTavle
