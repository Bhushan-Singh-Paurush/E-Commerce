"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE } from '@/routes/UserRoutes'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const WebsiteSidebar = () => {
    const pathname=usePathname()
    return (
    <div className=' w-full lg:w-fit'>
        <Card>
            <CardContent className=' flex flex-col gap-4'>
                 <Button asChild className=' w-full lg:w-[200px]' variant={`${pathname.startsWith(USER_DASHBOARD) ? "default" : "secondary"}`}>
                    <Link href={USER_DASHBOARD}>Dashboard</Link>
                 </Button>
                 <Button asChild className='w-full lg:w-[200px]' variant={`${pathname.startsWith(USER_PROFILE) ? "default" : "secondary"}`}>
                    <Link href={USER_PROFILE}>Profile</Link>
                 </Button>
                 <Button asChild className='w-full lg:w-[200px]' variant={`${pathname.startsWith(USER_ORDERS) ? "default" : "secondary"}`}>
                    <Link href={USER_ORDERS}>Orders</Link>
                 </Button>
                 <Button variant={`destructive`} onClick={()=>signOut({callbackUrl:WEBSITE_LOGIN})} >Logout</Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default WebsiteSidebar