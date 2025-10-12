"use client"
import UserOrderTable from "@/components/Application/Website/UserOrderTable";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import WebsiteLayout from "@/components/Application/Website/WebsiteLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_DASHBOARD } from "@/routes/UserRoutes";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const breadCrumbData = {
  title: "Order Detail",
  data: [
    {
      title: "Order Detail",
      url:USER_DASHBOARD,
    },
  ],
};
const page = () => {
  const cartData=useSelector((state:any)=>state.cart)
  const{data:Session}=useSession()
  const[count,setCount]=useState(0)
  
  useEffect(()=>{
    async function fetchCount() {
      
      try {
        const{data:response}=await axios.get(`/api/user/get-order-count?email=${Session?.user.email}`)

        if(!response.success)
          throw new Error(response.message);

        setCount(response.data.count)
          
      } catch (error) {
        
      }
    }

    if(Session?.user.email)
      fetchCount()

  },[Session])

  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>
      <WebsiteLayout>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className=" w-full text-xl pb-4 border-b-[1px] border-border">Dashboard</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className=" w-full flex flex-col gap-8">
                 <div className=" w-full flex flex-col gap-4 lg:gap-0 sm:flex-row items-center justify-between">
                     <Card className=" w-full sm:w-[45%] p-3">
                      <CardContent>
                          <div className=" w-full flex items-center justify-between">
                            <div className=" flex flex-col gap-2">
                                       <div className=" text-xl font-semibold">Total Orders</div>
                                       <div className="text-muted-foreground">{count}</div>
                            </div>
                            <div className=" w-14 h-14 text-2xl flex items-center justify-center bg-primary rounded-full text-white"><HiOutlineShoppingBag/></div>
                          </div>
                      </CardContent>
                     </Card>
                     <Card className=" w-full  sm:w-[45%] p-3">
                      <CardContent>
                          <div className=" w-full flex items-center justify-between">
                            <div className=" flex flex-col gap-2">
                                       <div className=" text-xl font-semibold">Items In Cart</div>
                                       <div className="text-muted-foreground">{cartData?.count || 0}</div>
                            </div>
                            <div className=" w-14 h-14 text-2xl flex items-center justify-center bg-primary rounded-full text-white"><IoCartOutline/></div>
                          </div>
                      </CardContent>
                     </Card>
                 </div>

                 <div className=" w-full flex flex-col gap-2">
                  <div className=" text-xl font-semibold">Recent Orders</div>
                 <UserOrderTable limit={10} email={Session?.user.email || ""}/>
                 </div>
            </CardContent>
          </Card>
        </div>
      </WebsiteLayout>
    </div>
  );
};

export default page;
