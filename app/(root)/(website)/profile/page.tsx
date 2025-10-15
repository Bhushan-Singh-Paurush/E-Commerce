"use client";
import LoadingBtn from "@/components/Application/LoadingBtn";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import WebsiteLayout from "@/components/Application/Website/WebsiteLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { USER_PROFILE } from "@/routes/UserRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Dropzone from "react-dropzone";
import user_img from "@/public/assets/images/user.png";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
const breadCrumbData = {
  title: "Profile",
  data: [
    {
      title: "Profile",
      url: USER_PROFILE,
    },
  ],
};
function Page() {
  const { file } = useFetch({ url: "/api/user/get-user-details" });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [perview, setPreview] = useState<string>("");
  const { update } = useSession();
  const formSchema = zSchema.pick({
    name: true,
    phone: true,
    address: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  function fileHandler(acceptedFiles: File[]) {
    const url = URL.createObjectURL(acceptedFiles[0]);
    setPreview(url);
    setImage(acceptedFiles[0]);
  }

  useEffect(() => {
    if (file?.data) {
      form.reset({
        name: file?.data?.name || "",
        address: file?.data?.address || "",
        phone: file?.data?.phone || "",
      });
      setPreview(file?.data?.avatar?.url);
    }
  }, [file,form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();

      if (image) formData.append("file", image);

      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("phone", values.phone.toString());

      const { data: response } = await axios.post(
        "/api/user/update-user",
        formData
      );

      if (!response.success) throw new Error(response.message);

      toastFunction({ type: "success", message: response.message });

      await update({
        id: response?.data._id,
        email: response?.data.email,
        name: response?.data.name,
        role: response?.data.role,
        image: response?.data.avatar.url,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastFunction({ type: "error", message: error.message });
      } else {
        toastFunction({ type: "error", message: "An unknown error occurred" });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>
      <WebsiteLayout>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className=" w-full text-xl pb-4 border-b-[1px] border-border">
                Profile
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className=" w-full flex flex-col gap-8 items-center">
              <Dropzone onDrop={(acceptedFiles) => fileHandler(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className=" relative group">
                        <Image
                          src={perview || user_img}
                          width={100}
                          height={100}
                          className=" w-20 bg-cover bg-center h-20 rounded-full"
                          alt="Image"
                        />
                        <div className=" transition-all duration-300 text-primary hidden group-hover:flex bg-black/20  z-50 absolute w-20 h-20 border-2 border-primary rounded-full top-0  items-center justify-center">
                          <FaCamera />
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4"
                >
                  <div className=" w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-full">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-full col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <LoadingBtn
                    className=" w-fit hover:cursor-pointer"
                    text="Save Changes"
                    type="submit"
                    disable={loading}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </WebsiteLayout>
    </div>
  );
}

export default Page;
