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
import { ADMIN_ADD_PRODUCT, ADMIN_PRODUCT } from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import slugify from "slugify";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import { Button } from "@/components/ui/button";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";
import { useParams } from "next/navigation";


type Option = {
  label: string;
  value: string;
};

const EditProduct = () => {
  const{id}=useParams()
  const [loading, setLoading] = useState(false);
  const { file:categoryResponse} = useFetch({
    url: `/api/category/get-all-category?deleteType="SD"`,
  });
  
  const{file:productResponse,loading:productLoading}=useFetch({url:`/api/product/edit/${id}`});
   

  const [categoryOption, setCategoryOption] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
  _id:string,
  secure_url:string 
}[]>([]);


  useEffect(() => {
    if (categoryResponse && categoryResponse.success) {
      const options = categoryResponse.data.items.map((cat: Record<string, any>) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOption(options);
    }
  }, [categoryResponse]);

  const data = [
    {
      page: "Home",
      url: WEBSITE_HOME,
    },
    {
      page: "Product",
      url: ADMIN_PRODUCT,
    },
  ];

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discount: true,
    description: true,
    _id:true
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      description: "",
      mrp: 0,
      sellingPrice: 0,
      discount: 0,
      _id:""
    },
  });
  
  function isUpdated(){
    const values=form.getValues();
    const dbMedia= JSON.stringify(productResponse.data.media.map((ele:Record<string,any>)=>{
      return {
             _id:ele._id,
             secure_url:ele.secure_url
      }
  }))
    if(productResponse.data.name!==values.name ||  
          productResponse.data.slug!==values.slug ||
          productResponse.data.category._id!==values.category ||
          productResponse.data.mrp!==values.mrp ||
          productResponse.data.sellingPrice!==values.sellingPrice ||
          productResponse.data.discount!==values.discount ||
          productResponse.data.description!==values.description || dbMedia!==JSON.stringify(selected) ) return true;
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
        "/api/product/update",
        {...values,media:ids}
      );
      
      if (!response.success) throw new Error(response.message);
      else toastFunction({ type: "success", message: response.message });
    }else
      return toastFunction({type:"error",message:"No Change Found"})
    }
    
    catch (error: any) {
      console.log("this is error",error)
      console.log(error);
      toastFunction({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);

  
  useEffect(()=>{
    const mrp=Number(form.getValues("mrp"))
    const sellingPrice=Number(form.getValues("sellingPrice"))
   if(mrp>0 && sellingPrice>0)
   {
        form.setValue("discount",Math.round(((mrp-sellingPrice)/mrp)*100))
   }
  },[form.watch("mrp"),form.watch("sellingPrice")])
  
  function editor(event: any, editor: any) {
    const data = editor.getData();
    form.setValue("description", data);
  }

  useEffect(()=>{
    if(productResponse && productResponse.success){
      const selectedOption=productResponse?.data?.media.map((item:Record<string,any>)=>{
        return {
              _id:item._id,
              secure_url:item.secure_url 
        }
      })
      setSelected(selectedOption)

      form.reset({
          name: productResponse.data.name,
          slug:  productResponse.data.slug,
          category:productResponse.data.category._id,
          mrp:  productResponse.data.mrp,
          sellingPrice:  productResponse.data.sellingPrice,
          discount:  productResponse.data.discount,
          description:productResponse.data.description,
          _id:productResponse.data._id
       })
    }
  },[productResponse])


  return (
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data} />
      <Card className=" my-5">
        <CardHeader className=" flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className=" text-2xl">Edit Product</h1>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Slug" {...field} />
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className=" text-red-800">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
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
              </div>
              <div className=" w-full flex flex-col md:flex-row items-center gap-5">
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
                     
                    {productLoading ? <></>  : <Editor  onChange={editor} initialData={field.value} /> }
                      
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
                  text="Update Product"
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
