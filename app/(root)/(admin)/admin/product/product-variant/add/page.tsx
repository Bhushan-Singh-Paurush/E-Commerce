"use client";
import dynamic from "next/dynamic";
import LoadingBtn from "@/components/Application/LoadingBtn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_ADD_PRODUCT, ADMIN_PRODUCT } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
import useFetch from "@/hooks/useFetch";


import { Button } from "@/components/ui/button";

import Image from "next/image";
import { ClassicEditor } from "ckeditor5";
const Select = dynamic(() => import("@/components/Application/Select"), { ssr: false });
const Editor = dynamic(() => import("@/components/Application/Admin/Editor"), { ssr: false });
const MediaModal = dynamic(() => import("@/components/Application/Admin/MediaModal"), { ssr: false });
const BreadCrumbFunction = dynamic(() => import("@/components/Application/Admin/BreadCrumbFunction"), { ssr: false });

type Option = {
  label: string;
  value: string;
};

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [product,setProduct] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
  _id:string,
  secure_url:string 
}[]>([]);
const{file}=useFetch({url:`/api/product/get-all-product?page=0&&limit=1000&&deleteType=SD`})
  
    useEffect(() => {
    if (file && file.success) {
      const options = file.data.items.map((product: {productName:string,_id:string}) => ({
        label: product.productName,
        value: product._id,
      }));
      setProduct(options);
    }
  }, [file]);

  const data = [
    {
      page: "Home",
      url: WEBSITE_HOME,
    },
    {
      page: "Product",
      url: ADMIN_PRODUCT,
    },
    {
      page: "Add Product",
      url: ADMIN_ADD_PRODUCT,
    },
  ];

  const formSchema = zSchema.pick({
       product:true,
       sku:true,
       color:true,
       size:true,
       mrp:true,
       sellingPrice:true,
       discount:true,
       description:true,
  });
  const sizeValue=[
    {label:"S",value:"S"},
    {label:"M",value:"M"},
    {label:"L",value:"L"},
    {label:"XL",value:"XL"},
    {label:"2XL",value:"2XL"} 
  ]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product:"",
       sku:"",
       color:"",
       size:"",
       mrp:0,
       sellingPrice:0,
       discount:0,
       description:"",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    

    setLoading(true);
    try {
      if(selected.length==0)
        return toastFunction({type:"error",message:"Please Select media"});

      const ids=selected.map((ele)=>ele._id)
      
      const { data: response } = await axios.post(
        "/api/product/product-variant/create",
        {...values,media:ids}
      );

      if (!response.success) throw new Error(response.message);
      else toastFunction({ type: "success", message: response.message });
    } catch (error: unknown) {
  if (error instanceof Error) {
    toastFunction({ type: "error", message: error.message });
  } else {
    toastFunction({ type: "error", message: "An unknown error occurred" });
  }
}
 finally {
      setLoading(false);
    }
  }

  
  useEffect(()=>{
    const subscription=form.watch((value)=>{
    const mrp=Number(value.mrp)
    const sellingPrice=Number(value.sellingPrice)
   if(mrp>0 && sellingPrice>0)
   {
        form.setValue("discount",Math.round(((mrp-sellingPrice)/mrp)*100))
   }
   })

   return ()=>subscription.unsubscribe()
  },[form])

  
  function editor(event: unknown, editor: ClassicEditor) {
    const data = editor.getData();
    form.setValue("description", data);
  }

  return (
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data} />
      <Card className=" my-5">
        <CardHeader className=" flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className=" text-2xl">Add Product Variant</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4 items-start"
            >
              
              <div className=" w-full flex flex-col md:flex-row items-center gap-5">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={product}
                            selected={field.value}
                            setSelected={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=" w-full flex flex-col md:flex-row items-center gap-5">
              <div className="w-full">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Color <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Size <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={sizeValue}
                            selected={field.value}
                            setSelected={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                </div>
              <div className=" w-full flex flex-col md:flex-row items-center gap-5">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="MRP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          selling Price <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=" w-full flex flex-col md:flex-row items-center gap-5">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            readOnly
                            placeholder="Discount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" w-full"></div>
              </div>
              <div className=" w-full">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className=" text-red-800">*</span>
                      </FormLabel>
                     
                      <Editor  onChange={editor} initialData={field.value} />
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full mx-auto flex flex-col gap-2 items-center justify-center">
                <MediaModal
                  isMulti={true}
                  selected={selected}
                  setSelected={setSelected}
                  open={open}
                  setOpen={setOpen}
                />
                
                <div className=" grid grid-cols-2 sm:grid-cols-4 gap-2">{selected.length>0 && selected.map((ele,index)=>(
                  <Image src={ele.secure_url} className=" bg-cover h-[150px] w-[130px] " width={100} height={100} alt="Image" key={index}/>
                ))}</div>
                <Button className=" text-lg p-8 rounded-lg border-[1px] border-border" type="button" variant="secondary" onClick={() => setOpen(true)}>Select Media</Button>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <LoadingBtn
                  className=" w-fit hover:cursor-pointer"
                  text="Add Product"
                  type="submit"
                  disable={loading}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
