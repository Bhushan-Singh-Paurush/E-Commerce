"use client"
import Link from "next/link"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type T={
      page:string,
      url:string
}

export default function BreadCrumbFunction({data}:{data:Array<T>}) {



  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data && data.length>0 && data.map((items,index)=>(
          <div key={index} className=" items-center flex gap-4">
          { index<data.length-1 ? 
          
          <>

          <BreadcrumbItem className=" text-[16px]">
          <BreadcrumbLink asChild>
            <Link href={items.url} >{items.page}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <MdOutlineKeyboardArrowRight/>
        </BreadcrumbSeparator>
          </> 
          
          : 
          
          <>
          <BreadcrumbItem className=" text-[16px]">
          <BreadcrumbLink asChild>
          <Link href={items.url} >{items.page}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
          </>
          }
          
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
