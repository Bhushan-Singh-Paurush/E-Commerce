"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import logoBlack from "@/public/assets/images/logo-black.png";
import { zSchema } from "@/lib/zodSchema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingBtn from "@/components/Application/LoadingBtn";
import { useState } from "react";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isPaswwordType, setIsPasswordType] = useState(true);
  const formSchema = zSchema
    .pick({
      email: true,
      password: true,
      name: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and Confirm Password mismatched",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  async function onRegister(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", values);

      if (!data.success) {
        throw new Error(data.message);
      }

      form.reset();
      toastFunction({ type: "success", message: data.message });
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
    <Card>
      <CardContent>
        <div className=" flex flex-col gap-1 items-center">
          <Image src={logoBlack} width={150} alt="Logo" />
          <h1 className=" text-2xl font-bold">Create Account!</h1>
          <p>Create new account by filling out the form below.</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRegister)}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="**********"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isPaswwordType ? "password" : "text"}
                          placeholder="**********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        className=" absolute right-2 bottom-2"
                        type="button"
                        onClick={() => setIsPasswordType(!isPaswwordType)}
                      >
                        {isPaswwordType ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <LoadingBtn
                className=" w-full hover:cursor-pointer"
                text="Register"
                type="submit"
                disable={loading}
              />
              <div className="text-center text-sm w-full">
                Already have account?{" "}
                <Link
                  href={WEBSITE_LOGIN}
                  className=" text-purple-500 underline underline-offset-4"
                >
                  Login!
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;
