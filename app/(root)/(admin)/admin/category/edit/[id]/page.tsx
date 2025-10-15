"use client";
import BreadCrumbFunction from "@/components/Application/Admin/BreadCrumbFunction";
import LoadingBtn from "@/components/Application/LoadingBtn";
import LoadingGIF from "@/components/Application/LoadingGIF";
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
import useFetch from "@/hooks/useFetch";
import toastFunction from "@/lib/toastFunction";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY} from "@/routes/AdminPanelRoutes";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import z from "zod";

const Page = () => {
  const { id } = useParams();
  const [updateLoading, setUpdateLoading] = useState(false);
  const { loading, file, error } = useFetch({
    url: `/api/category/edit/${id}`,
  });
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    _id: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (file) {
      form.reset({
        _id: file?.data?._id,
        name: file?.data?.name,
        slug: file?.data?.slug,
      });
    }
  }, [file,form]);

  useEffect(() => {
    const sub=form.watch((value)=>{
      const name=value.name
      if(name)
        form.setValue("slug", slugify(name).toLowerCase());
    })
    
    return ()=>sub.unsubscribe()
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdateLoading(true);
    if (file?.data?.name == values.name || file?.data?.slug == values.slug) {
      toastFunction({ type: "error", message: "No Change Found" });
      return;
    }
    try {
      const { data: response } = await axios.put(
        "/api/category/update",
        values
      );

      if (!response.success) throw new Error(response.message);

      toastFunction({ type: "success", message: response.message });
    } catch (error:unknown) {
      if(error instanceof Error)
      toastFunction({ type: "error", message: error.message });
      else
      toastFunction({ type: "error", message: "An unknown error occurred" });  
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
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data}/>
      <Card className=" mt-5">
        <CardHeader className=" flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className=" text-2xl">Edit Category</h1>
        </CardHeader>
        
        
     {loading ? <LoadingGIF/> :  error ? <>{error.message}</>  :<CardContent>
          <div className=" flex flex-col gap-1 items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4 items-start"
              >
                <div className=" w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="namr"
                            placeholder="David Smith"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" w-full relative">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="david-smith"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <LoadingBtn
                    className=" hover:cursor-pointer w-fit"
                    text="Update"
                    type="submit"
                    disable={updateLoading}
                  />
                </div>
              </form>
            </Form>
          </div>
        </CardContent>}
      </Card>
    </div>
  );
};

export default Page;
