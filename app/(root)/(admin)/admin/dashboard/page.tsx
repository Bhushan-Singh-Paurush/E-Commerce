import React from 'react'

import AddOverview from './AddOverview'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ADMIN_ORDERS } from '@/routes/AdminPanelRoutes'
import { OrderBarChart } from './OrderChart'
import { OrderPieChart } from './OrderPieChart'
import OrderTable from './OrderTable'
import ReviewTable from './ReviewTable'
import CountOverview from './CountOverview'


const page = () => {
  return (
    <div className='px-4 pt-[100px] pb-[40px] flex flex-col gap-10'>
     <CountOverview/>   
     <AddOverview/> 
     <div className=' w-full flex  gap-10 lg:flex-nowrap flex-wrap'>
      <Card className='w-full lg:w-[70%]'>
        <CardHeader className=' flex w-full justify-between'>
               <h1>Order Overview</h1>
               <Button><Link href={ADMIN_ORDERS}>
                 View All
               </Link></Button>
        </CardHeader>

        <CardContent>
                  <OrderBarChart/>
        </CardContent>

      </Card>
      <Card className=' w-full lg:w-[30%]'>
        <CardHeader className=' flex w-full justify-between'>
               <h1>Order Status</h1>
               <Button><Link href={ADMIN_ORDERS}>
                 View All
               </Link></Button>
        </CardHeader>
          <OrderPieChart/>
      </Card>
     </div>
     <div className=' w-full flex  gap-10 lg:flex-nowrap flex-wrap'>
      <Card className=' w-full lg:w-[70%] max-h-[300px] overflow-scroll'>
        <CardHeader className=' flex w-full justify-between'>
               <h1>Latest Orders</h1>
               <Button><Link href={ADMIN_ORDERS}>
                 View All
               </Link></Button>
        </CardHeader>

        <CardContent>
                  <OrderTable/>
        </CardContent>

      </Card>
      <Card className=' w-full lg:w-[30%] max-h-[300px] overflow-scroll'>
        <CardHeader className=' flex w-full justify-between'>
               <h1>Latest Review</h1>
               <Button><Link href={ADMIN_ORDERS}>
                 View All
               </Link></Button>
        </CardHeader>
          <ReviewTable/>
      </Card>
     </div>
    </div>
  )
}

export default page
