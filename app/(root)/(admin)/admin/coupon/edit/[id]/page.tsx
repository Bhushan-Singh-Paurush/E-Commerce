"use client";
import { BreadCrumbFunction } from "@/components/Application/Admin/BreadCrumbFunction";
import LoadingBtn from "@/components/Application/LoadingBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import toastFunction from "@/lib/toastFunction";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY, ADMIN_EDIT_CATEGORY } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const page = () => {
  const { id } = useParams();
  const [updateLoading, setUpdateLoading] = useState(false);
  const { loading, file, refetchFunction, error } = useFetch({
    url: `/api/coupon/edit/${id}`,
  });
  const formSchema = zSchema.pick({
    code:true,
    discount:true,
    minShopingAmount:true,
    validity:true,
    _id:true
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      code: "",
      discount: 0,
      minShopingAmount:0,
      validity:undefined
    },
  });

  useEffect(() => {
    if (file) {
      form.reset({
        _id: file?.data?._id,
        code: file?.data?.code,
        discount: file?.data?.discount,
        minShopingAmount:file?.data?.minShopingAmount,
        validity:new Date(file?.data?.validity)
      });
    }
  }, [file]);
  
  
  function isUpdated(){
    const values=form.getValues()
    if(values.code!==file?.data?.code || 
    values.discount!==file?.data?.discount ||
    values.minShopingAmount!==file?.data?.minShopingAmount ||
    JSON.stringify(values.validity)!==JSON.stringify(file?.data?.validity)
    )return true
    
    return false

  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdateLoading(true);
    try {
      
        if(isUpdated()){
        const { data: response } = await axios.put(
        "/api/coupon/update",
        values
      );

      if (!response.success) throw new Error(response.message);

      toastFunction({ type: "success", message: response.message });
    }else
    {
        return toastFunction({type:"error",message:"No change Found"})
    }
    } catch (error: any) {
      toastFunction({ type: "error", message: error.message });
    } finally {
      setUpdateLoading(false);
    }
  }
   const data=[
        {
          page:"Home",
          url:WEBSITE_HOME
        },
        {
          page:"Category",
          url:ADMIN_CATEGORY
        },
       
      ]
  return (
    <div className='px-4 pt-[70px]'>
         <BreadCrumbFunction data={data}/>
         <Card className=' mt-5'>
         <CardHeader className=' flex w-full justify-between items-center border-b-[1px] pb-4'>
         <CardTitle className=' text-2xl'>Edit Coupon</CardTitle>
         </CardHeader>
         <CardContent>
         <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 items-start">
           
           <div className=' w-full flex flex-col md:flex-row justify-between items-center gap-4'>
           <div className=' w-full'>
           <FormField
             control={form.control}
             name="code"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Code</FormLabel>
                 <FormControl>
                   <Input type='text' placeholder="Code" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           </div>
           <div className=' w-full relative'>        
             <FormField
             control={form.control}
             name="discount"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>discount Percentage</FormLabel>
                 <FormControl>
                 <Input type="number" placeholder="discount" {...field} />
                   
                   </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           </div>
           </div>
           <div className=' w-full flex flex-col md:flex-row justify-between items-center gap-4'>
           <div className=' w-full'>
           <FormField
             control={form.control}
             name="minShopingAmount"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Min Shoping Amount</FormLabel>
                 <FormControl>
                   <Input type='number' placeholder="amount" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           </div>
           <div className=' w-full relative'>        
             <FormField
             control={form.control}
             name="validity"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>validity</FormLabel>
                 <FormControl>
                 <Input  type="date"
         value={field.value ? field.value.toISOString().split("T")[0] : ""}
         onChange={(e) =>
           field.onChange(e.target.value ? new Date(e.target.value) : undefined)
         } />
                   
                   </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           </div>
           </div>
           
           
           <div className="flex flex-col gap-3 w-full">
                   <LoadingBtn className=' w-fit hover:cursor-pointer' text='Edit Coupon' type='submit' disable={updateLoading}/>
                  
                 </div>  
         </form>
   
       </Form>
    
         </CardContent>
         </Card>
         </div>
  );
};

export default page;
