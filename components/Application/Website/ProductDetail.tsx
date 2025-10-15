"use client";
import {
  WEBSITE_CART,
  WEBSITE_HOME,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoutes";
import React, { useEffect, useMemo, useState } from "react";
import { BreadCrumbFunction } from "../Admin/BreadCrumbFunction";
import place_holder from "@/public/assets/images/img-placeholder.webp";
import Image from "next/image";
import { Rating } from "@mui/material";
import { HiMinus } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import loading from "@/public/assets/images/loading.svg"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/slices/cart";
import toastFunction from "@/lib/toastFunction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReviewAndRating from "./ReviewAndRating";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

export interface IVariant {
  sku: string;
  color: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  discount: number;
  description: string;
  media:{
    secure_url:string
  }[];
  deletedAt: Date;
  stock: number;
  _id:string
}
 interface IProduct{
    name:string,
    slug:string,
    discount:number,
    description:string,
    _id:string 
}

interface IProductDetailProps {
  product: IProduct;
  colors: Array<string>;
  sizes: Array<string>;
  variant: IVariant;
  review:{
    average:number,count:number
  }
}

const ProductDetail = ({
  product,
  colors,
  sizes,
  variant,
  review,
}: IProductDetailProps) => {
  const[qty,setQty]=useState(1)
  const dispatch=useAppDispatch()
  const[isProductAdded,setIsProductAdded]=useState(false)
  const cartData=useAppSelector((state)=>state.cart)
  const[variantLoading,setVariantLoading]=useState(false)

  useEffect(()=>{

   if(cartData.count>0)
   {
    
    const index=cartData.products.findIndex((item:{variantId:string})=>item.variantId===variant._id)
    
      if(index>=0)
        setIsProductAdded(true)
      else
        setIsProductAdded(false)

   }

   setVariantLoading(false)

  },[variant,cartData.count,cartData.products])

  const data = useMemo(
    () => [
      {
        page: "Home",
        url: WEBSITE_HOME,
      },
      {
        page: "Shop",
        url: WEBSITE_SHOP,
      },
      {
        page: `${product.name}`,
        url: WEBSITE_PRODUCT_DETAILS(product.slug),
      },
    ],
    [product.name,product.slug]
  );

  const [mainImage, setMainImage] = useState<string>(
    variant?.media?.[0].secure_url
  );

  function cartHandler(){
      const productData={
        productId:product._id,
        variantId:variant._id,
        mrp:variant.mrp,
        sellingPrice:variant.sellingPrice,
        size:variant.size,
        color:variant.color,
        qty,
        picture:mainImage,
        name:product.name,
        slug:product.slug
      }
      dispatch(addProduct(productData))
      toastFunction({type:"success",message:"Product Added to cart"})
      setIsProductAdded(true)


  }

  return (

    <div className="flex flex-col gap-10 py-10 lg:px-32 relative md:px-24 px-4">
      {variantLoading && <div className=" absolute left-[45%] top-[30%] z-50 flex items-center justify-between">
         <Image src={loading.src} alt="Loading..." width={loading.width} height={loading.height}/>
        </div>}
      <BreadCrumbFunction data={data} />

      {/* main section */}
      <div className=" flex flex-col gap-4 md:gap-0 md:flex-row items-start justify-between">
        {/* left section */}
        <div className=" md:sticky top-0  flex  items-start justify-between w-[100%] md:w-[50%]">
          <ul className=" flex flex-col gap-4">
            {variant?.media?.map((item:{secure_url:string}, index: number) => (
              <li
                key={index}
                className={`${
                  item.secure_url == mainImage
                    ? " border-primary border-2"
                    : " border-border border-[1px]"
                }   rounded-sm`}
              >
                <Image
                  src={item.secure_url || place_holder.src}
                  alt="Product Image"
                  width={130}
                  height={110}
                  onClick={() => setMainImage(item.secure_url)}
                  className=" p-2"
                />
              </li>
            ))}
          </ul>

          <div className=" border-[1px] rounded-sm border-border">
            <Image
              src={mainImage || place_holder}
              alt="Main Image"
              width={350}
              height={450}
              className=" p-4"
            />
          </div>
        </div>

        {/* right section */}
        <div className=" w-[100%] md:w-[45%] flex flex-col gap-4">
          <h1 className=" text-4xl bg-background font-semibold">
            {product.name}
          </h1>
          <div className=" flex gap-2 items-center">
            <Rating readOnly value={review?.average} />
            <span>({review?.count}) Reviews</span>
           </div>
            <div className=" flex gap-4 items-end">
              
              <span className=" text-2xl">
              {variant.sellingPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })} </span>

              
              <span className=" text-muted-foreground line-through">{variant.mrp.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })} </span>

             
              <span className=" px-3 rounded-xl bg-red-500 text-white">-{variant.discount}%</span>

            </div>


            <p>{product.description}</p>

            <div><span className=" font-semibold text-lg">Color-</span>{variant.color}</div>

            <div className=" flex items-center gap-2 text-lg">{colors.map((color,index)=>(
              <Link onClick={()=>setVariantLoading(true)} href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant.size}`} key={index} className={`${variant.color===color ? " bg-primary text-white" : ""} px-2 rounded-sm border-[1px] border-border`}>{color}</Link>
            
            ))}</div>
            <div><span className=" font-semibold text-lg">Size-</span>{variant.size}</div>

            <div className=" flex items-center gap-2 text-lg">{sizes.map((size,index)=>(
              <Link onClick={()=>setVariantLoading(true)} href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${size}`} key={index} className={`${variant.size===size ? " bg-primary text-white" : ""} px-2 rounded-sm border-[1px] border-border`}>{size}</Link>
            
            ))}</div>


            <div className=" border-border border-[1px] w-fit py-1 px-4 rounded-2xl flex gap-6">
              <button className=" text-muted-foreground hover:cursor-pointer" disabled={qty===1} onClick={()=>setQty((pre)=>pre-1)}><HiMinus/></button>
              <div>{qty}</div>
              <button className=" text-muted-foreground hover:cursor-pointer" onClick={()=>setQty((pre)=>pre+1)}><HiPlus/></button>
            </div>

            {!isProductAdded  ? <Button onClick={cartHandler}>Add to Cart</Button>  : <Button asChild><Link href={WEBSITE_CART}>Go to Cart</Link></Button>}
         
        </div>
      </div>

      <Card className=" p-0 rounded-sm">
        <CardContent className="p-0">
          <CardHeader className="border-b-[1px] border-border p-0 bg-muted">
             <div className=" text-2xl font-semibold p-2 ">Product Description</div>
          </CardHeader>
              <p className=" p-2">{product.description}</p>
        </CardContent>
      </Card>

      <ReviewAndRating productId={product._id} review={review}/>

    </div>
  );
};

export default ProductDetail;
