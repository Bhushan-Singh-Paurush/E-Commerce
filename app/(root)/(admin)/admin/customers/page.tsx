"use client"
import { BreadCrumbFunction } from "@/components/Application/Admin/BreadCrumbFunction";
import DataTable from "@/components/Application/Admin/DataTable";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  ADMIN_CUSTOMERS } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import React, { useMemo } from "react";
import user from "@/public/assets/images/user.png"
import { Chip } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";

const page = () => {
   const data=[
      {
        page:"Home",
        url:WEBSITE_HOME
      },
      {
        page:"Customer",
        url:ADMIN_CUSTOMERS
      },
    ]

    const columsArray:MRT_ColumnDef<any>[]=[
        {
          accessorKey:"avatar",
          header:"Avatar",
          size:200,
          Cell:({cell}:{cell:any})=>{
              const{url}=cell.getValue()
                return <Avatar>
                         <AvatarImage src={url || user.src} width={50} height={50} alt="@shadcn" />
                      </Avatar>     
          }
        },
        {
            accessorKey:"name",
            header:"Name",
            size:200
        },
        {
            accessorKey:"email",
            header:"Email",
            size:200
        },
        {
            accessorKey:"phone",
            header:"Phone",
            size:200
        },
        {
            accessorKey:"address",
            header:"Address",
            size:200
        },
        {
            accessorKey:"isEmailVerified",
            header:"is Verified",
            size:200,
             Cell:({cell}:{cell:any})=>{
                 const isValid=cell.getValue()
                 return isValid ? <Chip label={"Verified"} color="success" /> : <Chip label={"Not Verified"} color="error" />
          }
        },
    ]

    const column=useMemo(()=>{
        return columsArray
    },[])
  return (
    <div className="px-4 pt-[70px] pb-[40px]">
   <BreadCrumbFunction data={data}/>
      <Card className="mt-5 px-0 pb-0">
        <CardHeader className=" flex w-full  items-center justify-between">
          <h1 className=" text-2xl">All Customers</h1>
        </CardHeader>
      
      <CardContent className=" px-0 m-0">
          <DataTable column={column} queryKey="Customers" deleteUrl="/api/customers/delete" fetchUrl="/api/customers/get-all-customers"/>
      </CardContent>
      
      </Card>     
          
        
   
    </div>
  );
};
export default page;
