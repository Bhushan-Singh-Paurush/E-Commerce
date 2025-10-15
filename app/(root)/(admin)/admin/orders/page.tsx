"use client"
import { BreadCrumbFunction } from "@/components/Application/Admin/BreadCrumbFunction";
import DataTable from "@/components/Application/Admin/DataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_EDIT_ORDER, ADMIN_ORDERS } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import React from "react";
const Page = () => {
   const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Order",
        url:ADMIN_ORDERS
      },
    ]
  return (
    <div className="px-4 pt-[70px] pb-[40px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader>
          <h1 className=" text-2xl">All Orders</h1>
        </CardHeader>
      
      <CardContent className=" px-0 m-0">
          <DataTable queryKey="Orders" deleteUrl="/api/order/delete" fetchUrl="/api/order/get-all-order" editUrl={ADMIN_EDIT_ORDER}/>
      </CardContent>
      
      </Card>     
          
        
   
    </div>
  );
};
export default Page;
