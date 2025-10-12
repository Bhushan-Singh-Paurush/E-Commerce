"use client"
import { BreadCrumbFunction } from '@/components/Application/Admin/BreadCrumbFunction'
import LoadingBtn from '@/components/Application/LoadingBtn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_ADD_CATEGORY } from '@/routes/AdminPanelRoutes'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import slugify from "slugify"
import axios from 'axios'
import toastFunction from '@/lib/toastFunction'

const page = () => {
  const[loading,setLoading]=useState(false)  
  const data=[
    {
      page:"Home",
      url:WEBSITE_HOME
    },
    {
      page:"Category",
      url:""
    },
    {
      page:"Add Category",
      url:ADMIN_ADD_CATEGORY
    }
  ]
  
  const formSchema=zSchema.pick({
        name:true,slug:true
  })
  
  const form=useForm<z.infer<typeof formSchema>>({
             resolver:zodResolver(formSchema),
             defaultValues:{
              name:"",
              slug:""
             }

  })

  async function onSubmit(values:z.infer<typeof formSchema>) {
          setLoading(true)
         try {
              const{data:response}=await axios.post("/api/category/create",values)
              
              if(!response.success)
                throw new Error(response.message);
              else
                toastFunction({type:"success",message:response.message})

                
          } catch (error:any) {
               toastFunction({type:"error",message:error.message}) 
          }finally{
              setLoading(false)
          }
  }

  useEffect(()=>{
      const name=form.getValues("name")
      if(name)
      {
        form.setValue("slug",slugify(name).toLowerCase())
      }

  },[form.watch("name")])

  return (
     <div className='px-4 pt-[80px]'>
      <BreadCrumbFunction data={data}/>
      <Card className=' mt-8 w-full'>
      <CardHeader className=' flex w-full justify-between items-center border-b-[1px] pb-4'>
      <CardTitle className=' text-2xl'>Add Category</CardTitle>
      </CardHeader>
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 items-start">
        <div className=' w-full'>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='name' placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className=' w-full relative'>        
          <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
              <Input type="text" placeholder="Slug" {...field} />
                
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex flex-col gap-3 w-full">
                <LoadingBtn className=' w-fit hover:cursor-pointer' text='Add Category' type='submit' disable={loading}/>
               
              </div>  
      </form>

    </Form>
 
      </CardContent>
      </Card>
      </div>
  )
}

export default page
