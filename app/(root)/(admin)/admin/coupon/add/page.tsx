"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import LoadingBtn from '@/components/Application/LoadingBtn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_ADD_COUPON, ADMIN_COUPON } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import toastFunction from '@/lib/toastFunction'

const Page = () => {
  const[loading,setLoading]=useState(false)  
  const data=[
    {
      page:"Home",
      url:WEBSITE_HOME
    },
    {
      page:"Coupon",
      url:ADMIN_COUPON
    },
    {
      page:"Add Coupon",
      url:ADMIN_ADD_COUPON
    }
  ]
  
  const formSchema=zSchema.pick({
        code:true,discount:true,minShopingAmount:true,validity:true
  })
  
  const form=useForm<z.infer<typeof formSchema>>({
             resolver:zodResolver(formSchema),
             defaultValues:{
              code:"",
              discount:"",
              minShopingAmount:"",
              validity:undefined
             }

  })

  async function onSubmit(values:z.infer<typeof formSchema>) {
          setLoading(true)
         try {
              const{data:response}=await axios.post("/api/coupon/create",values)
              
              if(!response.success)
                throw new Error(response.message);
              else
                toastFunction({type:"success",message:response.message})
                
          } catch (error:unknown) {
               if(error instanceof Error)
               toastFunction({type:"error",message:error.message});
              else
               toastFunction({type:"error",message:"An unknown error occurred"});  
          }finally{
              setLoading(false)
          }
  }

  return (
     <div className='px-4 pt-[70px]'>
      <BreadCrumbFunction data={data}/>
      <Card className=' mt-5'>
      <CardHeader className=' flex w-full justify-between items-center border-b-[1px] pb-4'>
      <CardTitle className=' text-2xl'>Add Coupon</CardTitle>
      </CardHeader>
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 items-start">
        
        <div className=' w-full flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className=' w-full'>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input type='text' placeholder="Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>discount Percentage</FormLabel>
              <FormControl>
              <Input type="number" placeholder="discount" {...field} />
                
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
        <div className=' w-full flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className=' w-full'>
        <FormField
          control={form.control}
          name="minShopingAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Shoping Amount</FormLabel>
              <FormControl>
                <Input type='number' placeholder="amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="validity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>validity</FormLabel>
              <FormControl>
              <Input  type="date"
      value={field.value ? field.value.toISOString().split("T")[0] : ""}
      onChange={(e) =>
        field.onChange(e.target.value ? new Date(e.target.value) : undefined)
      } />
                
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
        
        
        <div className="flex flex-col gap-3 w-full">
                <LoadingBtn className=' w-fit hover:cursor-pointer' text='Add Coupon' type='submit' disable={loading}/>
               
              </div>  
      </form>

    </Form>
 
      </CardContent>
      </Card>
      </div>
  )
}

export default Page
