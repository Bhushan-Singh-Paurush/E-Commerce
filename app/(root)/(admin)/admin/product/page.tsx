"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import DataTable from '@/components/Application/Admin/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_ADD_PRODUCT, ADMIN_EDIT_PRODUCT, ADMIN_PRODUCT } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import Link from 'next/link'

import React from 'react'
import { FaPlus } from 'react-icons/fa6'

const page = () => {
  const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Product",
        url:ADMIN_PRODUCT
      },
    ]
  return (
    <div className="px-4 pt-[70px] pb-[40px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader className=" flex w-full  items-center justify-between">
          <h1 className=" text-2xl">All Products</h1>
          <Button>
           <Link href={ADMIN_ADD_PRODUCT} className=" flex gap-2 items-center"><FaPlus/> New Product</Link>
          </Button>
        </CardHeader>
      <CardContent className=" px-0 m-0">
        <DataTable queryKey="Product" deleteUrl="/api/product/delete" fetchUrl="/api/product/get-all-product" editUrl={ADMIN_EDIT_PRODUCT}/>
       </CardContent>
      </Card>
    </div>
  )
}

export default page
