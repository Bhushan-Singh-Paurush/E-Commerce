"use client"
import { Card, CardContent } from '@/components/ui/card'
import useFetch from '@/hooks/useFetch';
import { ADMIN_CATEGORY, ADMIN_CUSTOMERS, ADMIN_ORDERS, ADMIN_PRODUCT } from '@/routes/AdminPanelRoutes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from 'react-icons/io5';
import { LuUserRound } from 'react-icons/lu';
import { MdOutlineShoppingBag } from 'react-icons/md';

function CountOverview(){
  const[response,setResponse]=useState<Record<string,number>>({})
  const{file}=useFetch({url:"/api/dashboard/admin/get-card-data"})

  useEffect(()=>{
    if(file && file.success)
     setResponse(file.data); 
  },[file])
  
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-5'>
           
           <Link href={ADMIN_CATEGORY}>
           <Card className=' py-1 h-20 flex justify-center border-l-4  border-l-green-600 '>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Total Categories</h1>
                      <p className=' font-bold'>{response?.totalCategory}</p>
                     </div>
                     <div className='text-white bg-green-600 w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <BiCategory/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_PRODUCT}>
           <Card className=' py-1 border-l-4 h-20 flex justify-center  border-l-blue-600 '>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Total Product</h1>
                      <p className=' font-bold'>{response?.totalProduct}</p>
                     </div>
                     <div className=' text-white bg-blue-600 w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <IoShirtOutline/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_CUSTOMERS}>
           <Card className=' py-1 border-l-4 h-20 flex justify-center  border-l-yellow-600 '>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Total Customers</h1>
                      <p className=' font-bold'>{response?.TotalCustomers}</p>
                     </div>
                     <div className='text-white bg-yellow-600 w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <LuUserRound/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_ORDERS}>
           <Card className=' py-1 border-l-4 h-20 flex justify-center  border-l-cyan-600'>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Total Orders</h1>
                      <p className=' font-bold'>{response?.totalOrders}</p>
                     </div>
                     <div className='text-white bg-cyan-600 w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <MdOutlineShoppingBag/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
    </div>
  )
}


export default CountOverview

