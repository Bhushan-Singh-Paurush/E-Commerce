"use client";
import BreadCrumbFunction from "@/components/Application/Admin/BreadCrumbFunction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClientMedia from "./ClientMedia";
import { Suspense } from "react";

const MediaPage = () => {
  const data = [
    { page: "Home", url: "/admin/dashboard" },
    { page: "Media", url: "/admin/media" },
  ];

  return (
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data} />

      <Card className="mt-5">
        <CardHeader className="flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className="text-2xl">Media</h1>
        
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
           <ClientMedia />
           </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
