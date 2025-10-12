"use client"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import logoBlack from "@/public/assets/images/logo-black.png"
import { zSchema } from '@/lib/zodSchema'
import z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LoadingBtn from '@/components/Application/LoadingBtn'
import { useState } from 'react'
import Link from 'next/link'
import { WEBSITE_HOME, WEBSITE_REGISTER, WEBSITE_RESET_PASSWORD } from '@/routes/WebsiteRoutes'
import { getSession, signIn} from 'next-auth/react'
import toastFunction from '@/lib/toastFunction'
import { useRouter } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import { USER_DASHBOARD } from '@/routes/UserRoutes'
const page = () => {
  const[loading,setLoading]=useState(false)
  const[isPasswordType,setIsPasswordType]=useState(true)
  const route=useRouter()
  const formSchema=zSchema.pick({
    email:true,password:true
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
          const result=await signIn("credentials",{
            email:values.email,
            password:values.password,
            redirect:false  
          })
  
          if(!result?.ok)
            toastFunction({type:"error",message:result?.error || "Login failed"})
          else
          {
          form.reset()
          toastFunction({type:"success",message:"Login successfully"})
          
          const session=await getSession()
          
          if(session?.user?.role==="admin")
            route.push(ADMIN_DASHBOARD);
          else
            route.push(USER_DASHBOARD);
          }
        } catch (error) {
          console.log((error as Error).message)  
        }finally{
          setLoading(false)
        } 
  }


  async function loginWithGoogle() {        
           signIn("google",{
               callbackUrl:WEBSITE_HOME
          })
  }

  return (
      <Card>
        <CardContent>
          <div className=' flex flex-col gap-1 items-center'>
            <Image src={logoBlack} width={150} alt='Logo' />
            <h1 className=' text-2xl font-bold'>Login Into Account</h1>
            <p>Login into your account by filling out the form below.</p>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 items-start">
        <div className=' w-full'>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
              <Input type={isPasswordType ? "password" : "text"} placeholder="**********" {...field} />
                
                </FormControl>
                <button className=' absolute right-2 top-[55%]' type='button' onClick={()=>setIsPasswordType(!isPasswordType)}>{isPasswordType ? <FaRegEyeSlash/> : <FaRegEye/>}</button>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex flex-col gap-3 w-full">
                <LoadingBtn className=' hover:cursor-pointer' text='Login' type='submit' disable={loading}/>
                <Button type='button' onClick={loginWithGoogle} variant="outline" className="w-full hover:cursor-pointer">
                  Login with Google
                </Button>
              </div>

        <div className="text-center text-sm flex flex-col gap-2 w-full">
              <div>
              Don&apos;t have an account?{" "}
              <Link href={WEBSITE_REGISTER} className=" text-purple-500 underline underline-offset-4">
                Sign up
              </Link>
              </div>

              <Link href={WEBSITE_RESET_PASSWORD} className="  text-purple-500 underline underline-offset-4">Forgot Password</Link>
        </div>      
      </form>

    </Form>
          </div>
        </CardContent>
      </Card>
  )
}

export default page
