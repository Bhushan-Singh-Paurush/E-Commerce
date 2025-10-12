"use client";
import Filteration from "@/components/Application/Website/Filteration";
import ProdustFilter from "@/components/Application/Website/ProdustFilter";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import useWindowSize from "@/hooks/useWindowSize";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoutes";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductBox from "@/components/Application/Website/ProductBox";
import LoadingBtn from "@/components/Application/LoadingBtn";
import LoadingGIF from "@/components/Application/LoadingGIF";
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


const page = () => {
  const [limit, setLimit] = useState<number>(9);
  const [sorting, setSorting] = useState<string>("default");
  const [isMobileView, setIsMobileView] = useState(false);
  const windowSize = useWindowSize();
  const params=useSearchParams().toString()

  async function fetchProduct(page:number) {
    const{data:response}=await axios.get(`/api/shop/get-product?page=${page}&&limit=${limit}&&sorting=${sorting}&&${params}`)
    
    if(!response.success)
      throw new Error(response.message);
      
    return {
        productData:response.data.productData,
        hasMore:response.data.hasMore
    }
  }
  
  const{data,status,isFetching,fetchNextPage,isFetchingNextPage,error,hasNextPage}=useInfiniteQuery({
    queryKey:["ShopProduct",limit,sorting,params],
    queryFn:async({pageParam})=>await fetchProduct(pageParam),
    initialPageParam:0,
    getNextPageParam:(lastPage,pages)=>{
          return lastPage.hasMore ? pages.length : undefined
    }
  })


  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>

      <section className=" flex gap-2 justify-between py-10 lg:px-32 md:px-24 px-4">
        {windowSize.width > 1024 ? (
          <ProdustFilter />
        ) : (
          <Sheet open={isMobileView} onOpenChange={()=>setIsMobileView(!isMobileView)}>
            <SheetContent className=" w-full">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <ProdustFilter />
            </SheetContent>
          </Sheet>
        )}

        <div className=" flex-1 flex flex-col gap-2">
          <Filteration
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            isMobileView={isMobileView}
            setIsMobileView={setIsMobileView}
          />

          <div className=" w-full grid grid-cols-2 md:grid-cols-3  lg:gap-10 gap-5">
            {status==="pending" ? <div><LoadingGIF/></div> : status==="error" ? <div>{error.message}</div> : data && data.pages.map((page)=>(
                    page.productData.map((product:Record<string,any>,index:any)=>(
                      <ProductBox product={product} key={index}/>
                    ))
            ))}
            
          </div>

          {hasNextPage && !isFetching && (<LoadingBtn text="Load More" className=" w-fit" type="button" disable={isFetchingNextPage} onClick={()=>fetchNextPage()}/>)}

        </div>
      </section>
    </div>
  );
};

export default page;
