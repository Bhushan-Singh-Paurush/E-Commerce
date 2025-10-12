import AppSidebar from '@/components/Application/Admin/app-sidebar'
import { Topbar } from '@/components/Application/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    
      <SidebarProvider>
        <AppSidebar/>
      <main className=' w-full md:w-[calc(100%-16rem)]'>
        <div className='min-h-[calc(100%-40px)] border-b-[1px]'>
      <Topbar/>
      {children}
       </div>
       <div className=' w-full text-center py-2'>
        © 2025 Developer Bhushan™. All Rights Reserved.
       </div>  
      </main>  
      
      </SidebarProvider>
   
  )
}

export default layout
