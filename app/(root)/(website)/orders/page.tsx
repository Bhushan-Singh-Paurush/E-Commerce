"use client";
import UserOrderTable from "@/components/Application/Website/UserOrderTable";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import WebsiteLayout from "@/components/Application/Website/WebsiteLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { USER_ORDERS } from "@/routes/UserRoutes";
import { useSession } from "next-auth/react";
import React from "react";
const breadCrumbData = {
  title: "Orders",
  data: [
    {
      title: "Orders",
      url: USER_ORDERS,
    },
  ],
};
const page = () => {
  const { data: Session } = useSession();
  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>

       <WebsiteLayout>

      <Card>
        <CardHeader>
          <CardTitle className=" w-full text-xl pb-4 border-b-[1px] border-border">
            Orders
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className=" w-full flex flex-col gap-8">
          <UserOrderTable limit={10000} email={Session?.user.email || ""} />
        </CardContent>
      </Card>
      </WebsiteLayout>
    </div>
  );
};

export default page;
