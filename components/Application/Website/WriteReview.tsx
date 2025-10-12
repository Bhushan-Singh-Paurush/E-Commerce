import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import LoadingBtn from '../LoadingBtn'
import axios from 'axios'
import toastFunction from '@/lib/toastFunction'
import { Rating } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'

const WriteReview = ({productId,userId}:{productId:string,userId:string}) => {
    const client=useQueryClient()
    const[loading,setLoading]=useState(false)
    const formSchema=zSchema.pick({
        product:true,
        user:true,
        rating:true,
        review:true,
        title:true
    })

    const form=useForm<z.infer<typeof formSchema>>({
              resolver:zodResolver(formSchema),
              defaultValues:{
                    product:productId,
                    user:userId,
                    rating:0,
                    review:"",
                    title:""
              }

    })
  
  
   async function onSubmit(values:z.infer<typeof formSchema>) {

      setLoading(true)
         try {
              const{data:response}=await axios.post("/api/review/create",values)
              
              if(!response.success)
                throw new Error(response.message);
              else
                toastFunction({type:"success",message:response.message})
              
              client.invalidateQueries({queryKey:["userReview"]})

                
          } catch (error:any) {
               toastFunction({type:"error",message:error.message}) 
          }finally{
              setLoading(false)
          }
  }

  
    return (
    <div> 
        <div className=' text-2xl font-semibold py-4'>Write Review</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 items-start">
            <div className=' w-full'>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                   <Rating   value={field.value as number || 0} onChange={(value)=>field.onChange(value)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className=' w-full relative'>        
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
            <div className=' w-full relative'>        
              <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                 <Textarea placeholder="Type your message here."   {...field}/>
                    
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="flex flex-col gap-3 w-full">
                    <LoadingBtn className=' w-fit hover:cursor-pointer' text='Submit' type='submit' disable={loading}/>
                   
                  </div>  
          </form>
    
        </Form></div>
  )
}

export default WriteReview