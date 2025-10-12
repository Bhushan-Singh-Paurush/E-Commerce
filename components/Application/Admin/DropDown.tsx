"use client"
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import adminlogo from "@/public/assets/images/admin-logo.png"
import Link from 'next/link'
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import {signOut} from "next-auth/react"
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
const DropDown=()=>{
  const{data}=useSession()
  

  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
   <Avatar>
        <AvatarImage src={adminlogo.src} alt="@shadcn" />
      </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className=' min-w-44 me-4'>
    <DropdownMenuLabel>
      
      <p>{data?.user?.name}</p>
      <span className=' text-xs font-normal'>{data?.user?.email}</span>
      </DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    <DropdownMenuItem asChild>
      <Link href={"/"}><IoShirtOutline/>New Product</Link>
    </DropdownMenuItem>
    
    <DropdownMenuItem asChild>
      <Link href={"/"}><MdOutlineShoppingBag/>Orders</Link>
    </DropdownMenuItem>
    
    <DropdownMenuItem asChild>
      <button className=' w-full' type='button' onClick={()=>signOut({callbackUrl:WEBSITE_LOGIN})}><FiLogOut/>Logout</button>
    </DropdownMenuItem>
   
  </DropdownMenuContent>
  </DropdownMenu>
  )
}
export default DropDown
