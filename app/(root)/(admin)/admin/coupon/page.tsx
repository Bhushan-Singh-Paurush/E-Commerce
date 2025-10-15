"use client"
import BreadCrumbFunction from '@/components/Application/Admin/BreadCrumbFunction'
import DataTable from '@/components/Application/Admin/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_ADD_COUPON, ADMIN_COUPON, ADMIN_EDIT_COUPON } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import Link from 'next/link'
import { Suspense } from 'react'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'

const Page = () => {
  const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Coupon",
        url:ADMIN_COUPON
      },
    ]
  return (
    <div className="px-4 pt-[70px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader className=" flex w-full  items-center justify-between">
          <h1 className=" text-2xl">All Coupons</h1>
          <Button>
           <Link href={ADMIN_ADD_COUPON} className=" flex gap-2 items-center"><FaPlus/> New Coupon</Link>
          </Button>
        </CardHeader>
      <CardContent className=" px-0 m-0">
        <Suspense fallback={null}>
        <DataTable queryKey="Coupon" deleteUrl="/api/coupon/delete" fetchUrl="/api/coupon/get-all-coupon" editUrl={ADMIN_EDIT_COUPON}/>
        </Suspense>
       </CardContent>
      </Card>
    </div>
  )
}

export default Page