"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import DataTable from '@/components/Application/Admin/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {ADMIN_ADD_PRODUCT_VARIANT, ADMIN_EDIT_PRODUCT_VARIANT, ADMIN_PRODUCT, ADMIN_PRODUCT_VARIANT } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import Link from 'next/link'

import React from 'react'
import { FaPlus } from 'react-icons/fa6'

const Page = () => {
  const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Product",
        url:ADMIN_PRODUCT
      },
      {
        page:"Product Variant",
        url:ADMIN_PRODUCT_VARIANT
      }
    ]
  return (
    <div className="px-4 pt-[70px] pb-[40px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader className=" flex w-full  items-center justify-between">
          <h1 className=" text-2xl">All Product Variants</h1>
          <Button>
           <Link href={ADMIN_ADD_PRODUCT_VARIANT} className=" flex gap-2 items-center"><FaPlus/> New Variant</Link>
          </Button>
        </CardHeader>
      <CardContent className=" px-0 m-0">
        <DataTable queryKey="Variant" deleteUrl="/api/product/product-variant/delete" fetchUrl="/api/product/product-variant/get-all-variants" editUrl={ADMIN_EDIT_PRODUCT_VARIANT}/>
       </CardContent>
      </Card>
    </div>
  )
}

export default Page