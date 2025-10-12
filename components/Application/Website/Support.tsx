import React from 'react'
import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { RiDiscountPercentFill } from "react-icons/ri";
const Support = () => {
  return (
    <div className='  w-full border-t-[1px] border-border'>
        <div className=' py-10 lg:px-32 md:px-24 px-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-0 justify-between'>
                 <div className=' flex flex-col items-center gap-1'>
                    <GiReturnArrow size={40}/>
                    <h4 className=' text-xl font-semibold'>7-Days Returns</h4>
                    <p >Risk-free shopping with easy returns.</p>
                 </div>
                 <div className=' flex flex-col items-center gap-1'>
                    <FaShippingFast size={40}/>
                    <h4 className=' text-xl font-semibold'>Free Shipping</h4>
                    <p >No extra costs, just the price you see.</p>
                 </div>
                 <div className=' flex flex-col items-center gap-1'>
                    <BiSupport size={40}/>
                    <h4 className=' text-xl font-semibold'>24/7 Support</h4>
                    <p >24/7 support, alway here just for you.</p>
                 </div>
                 <div className=' flex flex-col items-center gap-1'>
                    <RiDiscountPercentFill size={40}/>
                    <h4 className=' text-xl font-semibold'>Member Discounts</h4>
                    <p >Special offers for our loyal customers.</p>
                 </div>
        </div>
    </div>
  )
}

export default Support