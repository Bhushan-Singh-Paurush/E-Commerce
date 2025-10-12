import { Card, CardContent } from '@/components/ui/card'
import { ADMIN_ADD_CATEGORY, ADMIN_ADD_COUPON, ADMIN_ADD_PRODUCT, ADMIN_MEDIA } from '@/routes/AdminPanelRoutes'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlinePermMedia } from 'react-icons/md'
import { RiCoupon2Line } from 'react-icons/ri'

const AddOverview = () => {
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-5'>
           <Link href={ADMIN_ADD_CATEGORY}>
           <Card className=' py-1 h-20 flex justify-center bg-gradient-to-bl from-green-700 via-green-600 to-green-500'>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Add Category</h1>
                     </div>
                     <div className=' border-[1px] text-white border-white w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <BiCategory/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_ADD_PRODUCT}>
           <Card className=' py-1 h-20 flex justify-center bg-gradient-to-bl from-blue-700 via-blue-600 to-blue-500'>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Add Product</h1>
                     </div>
                     <div className=' border-[1px] text-white border-white w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <IoShirtOutline/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_ADD_COUPON}>
           <Card className=' py-1 h-20 flex justify-center bg-gradient-to-bl from-yellow-700  via-yellow-600 to-yellow-500'>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Add Coupon</h1>
                     </div>
                     <div className=' border-[1px] text-white border-white w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <RiCoupon2Line/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
           <Link href={ADMIN_MEDIA}>
           <Card className=' py-1 h-20 flex justify-center bg-gradient-to-bl from-cyan-700 via-cyan-600  to-cyan-500'>
             <CardContent>
              <div className=' flex items-center w-full justify-between'>
                     <div className=' text-lg flex flex-col gap-2'>
                      <h1>Upload Media</h1>
                     </div>
                     <div className=' border-[1px] text-white border-white w-10 h-10 flex items-center justify-center text-xl rounded-full'>
                      <MdOutlinePermMedia/>
                     </div>
              </div>
             </CardContent>
           </Card>
           </Link>
    </div>
  )
}

export default AddOverview
