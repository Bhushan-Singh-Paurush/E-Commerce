import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import image_placeholder from "@/public\/assets/images/img-placeholder.webp"
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoutes'
export interface ProductBoxProps{
   media:{
     secure_url:string
   }[],
   slug:string,
   mrp:number,
   name:string,
   sellingPrice:number
}
const ProductBox = ({product}:{product:ProductBoxProps}) => {

  return (
    <div>
        <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
                 <div  className=' flex flex-col border-[1px] border-border rounded-lg hover:shadow-xl '>
                         
                          <Image src={product.media?.[0].secure_url || image_placeholder} width={150} height={120} alt='Product_Img' className=' pt-2 w-full h-[300px]'/>
                         
                          <div className=' p-2 flex flex-col gap-2 border-t-[1px] border-border'>
                                     <div className=' text-lg font-semibold'>{product.name}</div>
                                     <div><span className=' line-through text-muted-foreground'>{product.mrp.toLocaleString("en-IN",{style:"currency",currency:"INR"})} </span> {product.sellingPrice.toLocaleString("en-IN",{style:"currency",currency:"INR"})}</div>
                          </div>

                 </div>
                 </Link>
    </div>
  )
}

export default ProductBox