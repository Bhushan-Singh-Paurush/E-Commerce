"use client";
import { BreadCrumbFunction } from "@/components/Application/Admin/BreadCrumbFunction";
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
import {  ADMIN_PRODUCT, ADMIN_PRODUCT_VARIANT } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import { Button } from "@/components/ui/button";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ClassicEditor } from "ckeditor5";


type Option = {
  label: string;
  value: string;
};

const EditProduct = () => {
  const{id}=useParams()
  const [loading, setLoading] = useState(false);
  
  
  const{file:productResponse}=useFetch({url:`/api/product/get-all-product?page=0&&limit=1000&&deleteType=SD`})
  
  const{file:variantResponse,loading:variantLoading}=useFetch({url:`/api/product/product-variant/edit/${id}`});


  const [productOption, setProductOption] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
  _id:string,
  secure_url:string 
}[]>([]);


  useEffect(() => {
    if (productResponse && productResponse.success) {
      const options = productResponse.data.items.map((product: {productName:string,_id:string}) => ({
        label: product.productName,
        value: product._id,
      }));
      setProductOption(options);
    }
  }, [productResponse]);

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
        page:"Product Variant",
        url:ADMIN_PRODUCT_VARIANT
    }
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
        _id:true
  });

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
        _id:""
    },
  });
  
  function isUpdated(){
    const values=form.getValues();
    const dbMedia= JSON.stringify(variantResponse.data.media.map((ele:{_id:string,secure_url:string})=>{
      return {
             _id:ele._id,
             secure_url:ele.secure_url
      }
  }))
       if(variantResponse.data.color!==values.color ||  
          variantResponse.data.sku!==values.sku ||
          variantResponse.data.size!==values.size ||
          variantResponse.data.product._id!==values.product ||
          variantResponse.data.mrp!==values.mrp ||
          variantResponse.data.sellingPrice!==values.sellingPrice ||
          variantResponse.data.discount!==values.discount ||
          variantResponse.data.description!==values.description || 
          dbMedia!==JSON.stringify(selected) ) return true;
    
          return false;      
  }



  async function onSubmit(values: z.infer<typeof formSchema>) {
    

    setLoading(true);
    try {
      if(selected.length==0)
        return toastFunction({type:"error",message:"Please Select media"});

      if(isUpdated()){

      const ids=selected.map((ele)=>ele._id)  
      
      const { data: response } = await axios.put(
        "/api/product/product-variant/update",
        {...values,media:ids}
      );
      
      if (!response.success) throw new Error(response.message);
      else toastFunction({ type: "success", message: response.message });
    }else
      return toastFunction({type:"error",message:"No Change Found"})
    }
    
   catch (error: unknown) {
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

  useEffect(()=>{
    if(variantResponse && variantResponse.success){
      const selectedOption=variantResponse?.data?.media.map((item:{_id:string,secure_url:string})=>{
        return {
              _id:item._id,
              secure_url:item.secure_url 
        }
      })
      setSelected(selectedOption)

      form.reset({
          color: variantResponse.data.color,
          sku:  variantResponse.data.sku,
          product:variantResponse.data.product._id,
          mrp:  variantResponse.data.mrp,
          sellingPrice:  variantResponse.data.sellingPrice,
          discount:  variantResponse.data.discount,
          description:variantResponse.data.description,
          _id:variantResponse.data._id,
          size:variantResponse.data.size
       })
    }
  },[variantResponse,form])

  const sizeValue=[
    {label:"S",value:"S"},
    {label:"M",value:"M"},
    {label:"L",value:"L"},
    {label:"XL",value:"XL"},
    {label:"2XL",value:"2XL"} 
  ]

  return (
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data} />
      <Card className=" my-5">
        <CardHeader className=" flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className=" text-2xl">Edit Product Variant</h1>
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
                          Product Name <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={productOption}
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
                          <Input type="text" placeholder="sku" {...field} />
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
                          Colour <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Colour" {...field} />
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
                     
                    {variantLoading ? <></>  : <Editor  onChange={editor} initialData={field.value} /> }
                      
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
                <Button className=" text-lg p-8 rounded-sm border-[1px] border-border" type="button" variant="secondary" onClick={() => setOpen(true)}>Select Media</Button>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <LoadingBtn
                  className=" w-fit hover:cursor-pointer"
                  text="Update Variant"
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

export default EditProduct;
