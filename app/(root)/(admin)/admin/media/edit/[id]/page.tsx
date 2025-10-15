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
import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
import LoadingGIF from "@/components/Application/LoadingGIF";
const EditPage = () => {
  const { id } = useParams();
  const [updateLoading, setUpdateLoading] = useState(false);
  const { loading, file, error } = useFetch({ url: `/api/media/edit/${id}` });

  const data = [
    {
      page: "Home",
      url: "/admin/dashboard",
    },
    {
      page: "Media",
      url: "/admin/media",
    },
    {
      page: "Edit",
      url: `/admin/media/edit/${id}`,
    },
  ];

  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  useEffect(() => {
    if (file && file.success) {
      form.reset({
        _id: file?.data?._id,
        title: "",
        alt: "",
      });
    }
  }, [file, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdateLoading(true);
    try {
      const { data: response } = await axios.post("/api/media/update", values);

      if (!response.success) throw new Error(response.message);

      toastFunction({ type: "success", message: response.message });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastFunction({ type: "error", message: error.message });
      } else {
        toastFunction({ type: "error", message: "An unknown error occurred" });
      }
    } finally {
      setUpdateLoading(false);
    }
  }

  return (
    <div className="px-4 pt-[70px]">
      <BreadCrumbFunction data={data} />
      <Card className=" mt-5">
        <CardHeader className=" flex w-full justify-between items-center border-b-[1px] pb-4">
          <h1 className=" text-2xl">Edit Media</h1>
        </CardHeader>

        {loading ? (
          <LoadingGIF />
        ) : error ? (
          <div className=" flex w-full h-full items-center justify-center text-red-500">
            {error.message}
          </div>
        ) : (
          <CardContent>
            <Image
              src={file?.data?.secure_url || ImagePlaceholder}
              width={150}
              height={150}
              alt="Image"
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4 items-start"
              >
                <div className=" w-full">
                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>alt</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="alt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" w-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <LoadingBtn
                  className=" w-fit hover:cursor-pointer"
                  text="Update"
                  type="submit"
                  disable={updateLoading}
                />
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EditPage;
