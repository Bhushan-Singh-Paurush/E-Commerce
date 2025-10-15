"use client"
import LoadingBtn from '@/components/Application/LoadingBtn'
import { Card, CardContent } from '@/components/ui/card'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import logoBlack from "@/public/assets/images/logo-black.png"

export const  VerifyOtp=({email,onsubmit,loading}:{email:string,onsubmit:({email,otp}:{email:string,otp:string})=>Promise<void>,loading:boolean}) =>{
   
    const formSchema=zSchema.pick({
    otp:true,email:true
   })
   
   const form=useForm<z.infer < typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            otp:"",
            email:email
        }
   })

   function handleOtp(values:z.infer < typeof formSchema>){
             onsubmit({email:values.email,otp:values.otp}) 
             
   }
  
    return (
    <Card>
        <CardContent>
          <div className=' flex flex-col gap-4 items-center w-[350px] text-center'>
            <Image src={logoBlack} width={150} alt='Logo' />
            <h1 className=' text-2xl font-bold'>Please Complete Verification</h1>
            <p>We send a valid one time password (OTP) to your register email address. The otp is vaild for 10 minutes</p>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOtp)} className=" flex flex-col gap-4 items-start">
        <div>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One Time Password</FormLabel>
              <FormControl>
             <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
       
        <div className="flex flex-col gap-3 w-full">
 <LoadingBtn className=' hover:cursor-pointer' text='Verify' type='submit' disable={loading}/>
                
        </div>
              
      </form>

    </Form>
    </div>
    </CardContent>
    </Card>
  )
}


