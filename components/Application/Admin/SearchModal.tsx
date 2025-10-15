import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Fuse from "fuse.js"
import search from "@/components/Application/Admin/search"
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const options={
    keys: [
		"label",
		"description",
     "url"
	]
}

interface Result{
  
         label: string,
         description: string,
         url: string,
         keywords: string[]
  
}

const SearchModal = ({open,setOpen}:{open:boolean,setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const[query,setQuery]=useState('')  
  const[result,setResult]=useState<Result[]>([])
  
  const fuse=useMemo(()=>{
    return new Fuse(search,options)
  },[])

  useEffect(()=>{
    if(query.length===0)
         setResult([])
    else
    {
       const response=fuse.search(query)
       const items=response.map((ele)=>ele.item)
       setResult(items)
    }

  },[query,fuse])

  return (

    <Dialog open={open} onOpenChange={()=>setOpen(!open)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Quick Search</DialogTitle>
      <DialogDescription>
       Find and navigate to any admin section instantly. Type a keyword to get started.
      </DialogDescription>
    </DialogHeader>
    <Input type='text' value={query} onChange={(e)=>setQuery(e.target.value)}/>
    <ul className=' max-h-[300px] flex flex-col gap-4 overflow-scroll'>{result.map((item:Result,index:number)=>(
       
       <li key={index}>
              
              <Link href={item.url} onClick={()=>setOpen(!open)}>
              <Card className=' p-1 flex gap-0.5 rounded-xs border-0 bg-background hover:bg-border transition-all duration-150'>
                <CardHeader className=' px-1 '>
                     <h1 className=' font-semibold'>{item.label}</h1>
                </CardHeader>
                <CardContent className=' px-1 border-0'>
                      <p className=' text-sm'>{item.description}</p>
                </CardContent>
              </Card>
              </Link>
        </li>
    ))}</ul>
   
  </DialogContent>
</Dialog>
  )
}

export default SearchModal
