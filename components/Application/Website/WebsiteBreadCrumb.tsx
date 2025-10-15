"use client"
import { IbreadCrumb } from '@/app/(root)/(website)/shop/page'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import Link from 'next/link'
import React from 'react'

const WebsiteBreadCrumb = (props:IbreadCrumb) => {
  return (
    <div className=' flex flex-col justify-center items-center w-full h-[150px] bg-cover bg-center bg-[url("/assets/images/page-title.png")] dark:bg-[url("/assets/images/dark-page-title.png")]'>
                     <h1 className=' text-2xl font-semibold'>{props.title}</h1>
                     <div className=' mt-2'>
                      <span className=' font-semibold'><Link href={WEBSITE_HOME}>Home</Link></span>
                      <span>{props.data.map((item,index)=>(
                        <Link key={index} href={item.url}> / {item.title}</Link>
                      ))}</span>
                     </div>
    </div>
  )
}

export default WebsiteBreadCrumb