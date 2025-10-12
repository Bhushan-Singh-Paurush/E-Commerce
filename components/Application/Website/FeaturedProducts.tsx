"use client"
import useFetch from '@/hooks/useFetch'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import ProductBox from './ProductBox'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoutes'
const FeaturedProducts = () => {
    const{loading,error,file}=useFetch({url:"api/product/get-featured-products"})
    

    
    if(loading)
        return null
    
    return (
    <div>
        {file?.data && file?.data.length>0 && 
        
        <div className='  w-full flex flex-col gap-8 py-10 lg:px-32 md:px-24 px-4'>

            <div className=' w-full flex items-center justify-between'>
            <h1 className=' text-4xl font-semibold'>Featured Products</h1>
            <Link href={WEBSITE_SHOP} className=' underline text-violet-800'>View All</Link>
            </div> 

            <div className=' grid lg:grid-cols-4 grid-cols-2  gap-10'>{file.data.map((product:Record<string,any>,index:any)=>(
                 
                 
                <ProductBox product={product} key={index}/> 

            ))}</div> 


            
        </div>}
    </div>
  )
}

export default FeaturedProducts