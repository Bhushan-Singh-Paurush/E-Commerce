"use client"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import logoBlack from "@/public/assets/images/logo-black.png"
import { zSchema } from '@/lib/zodSchema'
import z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import axios from 'axios'
import toastFunction from '@/lib/toastFunction'

import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import { useRouter } from 'next/navigation'
const UpdatePassword = ({email}:{email:string}) => {
  
  const[loading,setLoading]=useState(false)
  const[isPaswwordType,setIsPasswordType]=useState(true)
  const route=useRouter()
  const formSchema=zSchema.pick({
    email:true,password:true,
  }).extend({
    confirmPassword:z.string()
  }).refine((data)=>data.password===data.confirmPassword,{
    message:"Password and Confirm Password mismatched",
    path:["confirmPassword"]
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password:"",
      confirmPassword:""
    },
  })

async  function handleUpdate(values: z.infer<typeof formSchema>) { 
    setLoading(true)
    try {
      const {data}= await axios.post("/api/auth/update-password",values)

      if(!data.success){
        throw new Error(data.message);
      }

      form.reset()

      toastFunction({type:"success",message:data.message})

      route.push(WEBSITE_LOGIN)

    } catch (error) {
      toastFunction({type:"error",message:(error as Error).message})
    }finally{
        setLoading(false)
    }
  }
  return (
    
     <Card>
        <CardContent>
          <div className=' flex flex-col gap-1 items-center'>
            <Image src={logoBlack} width={150} alt='Logo' />
            <h1 className=' text-2xl font-bold'>Update Password!</h1>
            <p>Create new Password by filling out the form below.</p>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdate)} className="w-full flex flex-col gap-4 items-start">
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
              <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>confirm Password</FormLabel>
              <FormControl>
              <Input type={isPaswwordType ? "password" : "text"} placeholder="**********" {...field} />
              </FormControl>
              <button className=' absolute right-2 bottom-2' type='button' onClick={()=>setIsPasswordType(!isPaswwordType)}>{isPaswwordType ? <FaRegEyeSlash/> : <FaRegEye/>}</button>  
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
         <LoadingBtn className=' w-full hover:cursor-pointer' text='Update Password' type='submit' disable={loading}/>
          
      </form>

    </Form>
          </div>
        </CardContent>
      </Card>
  
  )
}

export default UpdatePassword
