"use client"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import logoBlack from "@/public/assets/images/logo-black.png"
import { zSchema } from '@/lib/zodSchema'
import z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { VerifyOtp } from '../verify-otp/page'
import UpdatePassword from '@/components/Application/UpdatePassword'


const page = () => {
  const[loading,setLoading]=useState(false)
  const[verifyEmail,setVerifyEmail]=useState('')
  const[otpLoading,setOtpLoading]=useState(false)
  const[verifyOTP,setVerifyOTP]=useState('')
  const formSchema=zSchema.pick({
    email:true
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })



  async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
          
            const{data}=await axios.post("/api/auth/send-otp",{email:values.email})
            
            if(!data.success)
              toastFunction({type:"error",message:data.message})

            else
            {
              toastFunction({type:"success",message:data.message})
              setVerifyEmail(values.email)
            }

          
        } catch (error) {
          toastFunction({type:"error",message:(error as Error).message})  
        }finally{
          setLoading(false)
        } 
  }


  async function handleOtpSubmit({email,otp}:{email:string,otp:string}){
            setOtpLoading(true)
            try {
                  
              const{data}=await axios.post("/api/auth/verify-otp",{email,otp})
                  
              if(!data.success)
              toastFunction({type:"error",message:data.message})
              
              
            else
            {
              toastFunction({type:"success",message:data.message})
              setVerifyOTP(email)
            }
                  
                 } catch (error) {
                  toastFunction({type:"error",message:(error as Error).message})  
                 }finally{
                 setOtpLoading(false)
                 }  
  } 
  
  return (

      verifyEmail ? <>{verifyOTP ? <UpdatePassword email={verifyOTP}/> : <VerifyOtp email={verifyEmail} loading={otpLoading} onsubmit={handleOtpSubmit}/>}</> 
      : <Card>
        <CardContent>
          <div className=' flex flex-col gap-1 items-center'>
            <Image src={logoBlack} width={150} alt='Logo' />
            <h1 className=' text-2xl font-bold'></h1>
            <p>Enter your email for password reset.</p>
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
        
        <div className="flex flex-col gap-3 w-full">
                <LoadingBtn className=' hover:cursor-pointer' text='Send OTP' type='submit' disable={loading}/>
                
              </div>

            
      </form>

    </Form>
          </div>
        </CardContent>
       </Card>  

  )
}

export default page
