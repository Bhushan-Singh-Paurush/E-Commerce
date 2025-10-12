"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import DataTable from '@/components/Application/Admin/DataTable'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_REVIEW } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import React from 'react'


const page = () => {
  const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Review and Rating",
        url:ADMIN_REVIEW
      },
    ]
  return (
    <div className="px-4 pt-[70px] pb-[40px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader className=" flex w-full  items-center justify-between">
          <h1 className=" text-2xl">All Reviews</h1>
        </CardHeader>
      <CardContent className=" px-0 m-0">
        <DataTable queryKey="Review" deleteUrl="/api/review/delete" fetchUrl="/api/review/get-all-review"/>
       </CardContent>
      </Card>
    </div>
  )
}

export default page
