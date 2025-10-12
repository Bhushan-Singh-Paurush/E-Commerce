"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import logo_black from "@/public/assets/images/logo-black.png"
import logo_white from "@/public/assets/images/logo-white.png"
import { Button } from '@/components/ui/button'
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAddSidebarMenu } from '@/lib/adminAddSidebarMenu'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes'
const AppSidebar = () => {
  const{toggleSidebar}=useSidebar()
  return (
   <Sidebar>
      <SidebarHeader className='px-2 border-b-[1px] h-14'>
        <div className='flex items-center justify-between w-full '>
            <Link className=' dark:hidden' href={WEBSITE_HOME}><Image src={logo_black} width={100} alt='logo black' /></Link>
            <Link className='hidden dark:block' href={WEBSITE_HOME}><Image src={logo_white} width={100} alt='logo white' /></Link>
            <Button onClick={toggleSidebar} className='md:hidden block'><IoMdClose/></Button>
        </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminAddSidebarMenu.map((menu,index)=>(
            <Collapsible key={index} className=' group/collapsible'>
              <SidebarMenuItem>
                 <CollapsibleTrigger asChild>
                     <SidebarMenuButton asChild className=' font-semibold px-2 py-5'>
                       <Link href={menu.url || ""}>
                       <menu.icon/>
                       {menu.title}
                       
                       {menu?.submenu && menu?.submenu?.length>0 && <LuChevronRight className=' ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'/> }
                       </Link>
                     </SidebarMenuButton>
                 </CollapsibleTrigger> 

                {menu?.submenu && menu?.submenu?.length>0 &&  <CollapsibleContent>
                    <SidebarMenuSub>
                     {menu.submenu.map((submenu,submenuIndex)=>(
                      <SidebarMenuSubItem key={submenuIndex}>
                        <SidebarMenuButton asChild className='px-2 py-5'>
                          <Link href={submenu.url}>{submenu.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                     ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>  }  
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
