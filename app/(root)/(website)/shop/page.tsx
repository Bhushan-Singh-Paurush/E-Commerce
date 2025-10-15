"use client";
import React, { Suspense, useState } from "react";
import Filteration from "@/components/Application/Website/Filteration";
import ProdustFilter from "@/components/Application/Website/ProdustFilter";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import useWindowSize from "@/hooks/useWindowSize";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoutes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ClientShop from "./ClientShop";

export interface IbreadCrumb {
  title: string;
  data: Array<{ title: string; url: string }>;
}

const breadCrumbData: IbreadCrumb = {
  title: "Shop",
  data: [
    {
      title: "Shop",
      url: WEBSITE_SHOP,
    },
  ],
};

const Page = () => {
  const [limit, setLimit] = useState<number>(9);
  const [sorting, setSorting] = useState<string>("default");
  const [isMobileView, setIsMobileView] = useState(false);
  const windowSize = useWindowSize();

  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>

      <section className="flex gap-2 justify-between py-10 lg:px-32 md:px-24 px-4">
        {windowSize.width > 1024 ? (
          <ProdustFilter />
        ) : (
          <Sheet open={isMobileView} onOpenChange={() => setIsMobileView(!isMobileView)}>
            <SheetContent className="w-full">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <ProdustFilter />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex-1 flex flex-col gap-2">
          <Filteration
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            isMobileView={isMobileView}
            setIsMobileView={setIsMobileView}
          />
             <Suspense fallback={null}>
          <ClientShop limit={limit} sorting={sorting} />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default Page;
