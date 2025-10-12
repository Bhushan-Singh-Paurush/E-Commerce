"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoutes";
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ProdustFilter = () => {
  const { file: categoryResponse } = useFetch({
    url: "/api/category/get-web-category",
  });
  const { file: colorResponse } = useFetch({
    url: "/api/product/product-variant/color",
  });
  const { file: sizeResponse } = useFetch({
    url: "/api/product/product-variant/size",
  });

  
  const[categoryArray,setCategoryArray]=useState<Array<string>>([])
  const[colorArray,setColorArray]=useState<Array<string>>([])
  const[sizeArray,setSizeArray]=useState<Array<string>>([])
  const[range,setRange]=useState<[number,number]>([0,3000])
  const params=useSearchParams()
  const searchParams = new URLSearchParams(params.toString());

  const router=useRouter()
  
  function categoryHandler(slug:string){
              
             let filter:string[]=[]
             
             if(categoryArray.includes(slug))
             {
                filter=categoryArray.filter((ele)=>ele!==slug)
                
             }else
              {
                filter=[...categoryArray,slug]
              } 

              setCategoryArray(filter)
              

              if(filter.length>0)
              {
                  const query=filter.join(",")
                  searchParams.set("category",query)
              }else
                searchParams.delete("category")
              
              router.push(`${WEBSITE_SHOP}?${searchParams.toString()}`)
  } 
  function sizeHandler(size:string){
              
             let filter:string[]=[]
             
             if(sizeArray.includes(size))
             {
                filter=sizeArray.filter((ele)=>ele!==size)
                
             }else
              {
                filter=[...sizeArray,size]
              } 

              setSizeArray(filter)
              


              if(filter.length>0)
              {
                  const query=filter.join(",")
                  searchParams.set("size",query)
              }else
                searchParams.delete("size")
              
              router.push(`${WEBSITE_SHOP}?${searchParams.toString()}`)
  } 
  function colorHandler(color:string){
              
             let filter:string[]=[]
             
             if(colorArray.includes(color))
             {
                filter=colorArray.filter((ele)=>ele!==color)
                
             }else
              {
                filter=[...colorArray,color]
              } 

              setColorArray(filter)
              

              if(filter.length>0)
              {
                  const query=filter.join(",")
                  searchParams.set("color",query)
              }else
                searchParams.delete("color")
              
              router.push(`${WEBSITE_SHOP}?${searchParams.toString()}`)
  } 


  function priceHandler(){
    const searchParams=new URLSearchParams(window.location.search)

    searchParams.set("minPrice",range[0].toString())
    searchParams.set("maxPrice",range[1].toString())

    router.push(`${WEBSITE_SHOP}?${searchParams.toString()}`)
  }

  
  useEffect(()=>{
   setCategoryArray(params.get("category")?.split(",") || [])
   setColorArray(params.get("color")?.split(",") || [])
   setSizeArray(params.get("size")?.split(",") || []) 
  },
  [params])

  return (
    <div className=" w-full lg:w-[25%] flex flex-col gap-4 sticky top-0 overflow-auto">
      {params.size>0 && <Button asChild variant="destructive" className=" w-full">
        <Link href={WEBSITE_SHOP}>Clear Filter</Link>
      </Button>}
      <Accordion type="multiple" defaultValue={["1","2","3","4"]} className=" w-full bg-muted rounded-sm ">
        <AccordionItem value="1" className=" p-2  ">
          <AccordionTrigger className=" hover:no-underline uppercase">Category</AccordionTrigger>
          <AccordionContent className=" max-h-[200px] top-0 overflow-y-auto flex flex-col gap-4">
            {categoryResponse &&
              categoryResponse.success &&
              categoryResponse.data.map((item:Record<string,any>,index:any)=>(
                         <label key={index} className="w-full flex items-center gap-10">
                          <Checkbox checked={categoryArray.includes(item.slug)} onCheckedChange={()=>categoryHandler(item.slug)}/>
                          <div>{item.name}</div> 
                         </label>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className=" p-2 ">
          <AccordionTrigger className=" hover:no-underline uppercase">Color</AccordionTrigger>
          <AccordionContent className=" max-h-[200px] top-0 overflow-y-auto flex flex-col gap-4">
            {colorResponse &&
              colorResponse.success &&
              colorResponse.data.map((item:Record<string,any>,index:any)=>(
                         <label key={index} className="w-full flex items-center gap-10">
                          <Checkbox checked={colorArray.includes(item.color)} onCheckedChange={()=>colorHandler(item.color)}/>
                          <div>{item.color}</div> 
                         </label>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3" className=" p-2 ">
          <AccordionTrigger className=" hover:no-underline uppercase">Size</AccordionTrigger>
          <AccordionContent className=" max-h-[200px] top-0 overflow-y-auto flex flex-col gap-4">
            {sizeResponse &&
              sizeResponse.success &&
              sizeResponse.data.map((item:Record<string,any>,index:any)=>(
                         <label key={index} className="w-full flex items-center gap-10">
                          <Checkbox checked={sizeArray.includes(item.size)} onCheckedChange={()=>sizeHandler(item.size)}/>
                          <div>{item.size}</div> 
                         </label>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4" className=" p-2 ">
          <AccordionTrigger className=" hover:no-underline uppercase">Price</AccordionTrigger>
          <AccordionContent className=" m-2 flex flex-col gap-4">
                    <Slider value={range} min={0} max={3000} onValueChange={(values)=>setRange([values[0],values[1]])}/>
                    <div className=" my-2 flex w-full items-center justify-between">
                         <div>{range[0].toLocaleString("en-IN",{style:"currency",currency:"INR"})}</div>
                         <div>{range[1].toLocaleString("en-IN",{style:"currency",currency:"INR"})}</div>
                    </div>
                    <Button className=" rounded-2xl w-fit" onClick={priceHandler}>Filter Price</Button>
          </AccordionContent>
        </AccordionItem>
        
      </Accordion>
    </div>
  );
};

export default ProdustFilter;
