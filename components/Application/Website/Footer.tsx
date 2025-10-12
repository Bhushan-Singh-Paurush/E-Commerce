import Image from 'next/image'
import React from 'react'
import logo_black from "@/public/assets/images/logo-black.png";
import logo_white from "@/public/assets/images/logo-white.png";
import Link from 'next/link';
import { IoLocationOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WEBSITE_ABOUT, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_PRIVATE_POLICY, WEBSITE_REGISTER, WEBSITE_SHOP, WEBSITE_TERMS } from '@/routes/WebsiteRoutes';
import { USER_DASHBOARD } from '@/routes/UserRoutes';
const Footer = () => {
  return (
    <footer className=' w-full  bg-muted'>
               <div className='lg:px-32 md:px-24 px-4 py-10 gap-4  grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1'>
                <div className=' lg:col-span-1 md:col-span-2 col-span-1 flex flex-col gap-2 '>
                                <Image
                                  src={logo_black}
                                  width={120}
                                  alt="logo black"
                                  className=" dark:hidden"
                                />
                                <Image
                                  src={logo_white}
                                  width={120}
                                  alt="logo white"
                                  className="hidden dark:block"
                                />

                            <p className='text-muted-foreground'>E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.</p>
                </div>
                <div className=' flex flex-col gap-2'>
                    <div className=' text-2xl uppercase font-semibold'>Categories</div>
                    <Link href={`${WEBSITE_SHOP}?category=t-shirt`} className=' text-muted-foreground'>T-shirt</Link>
                    <Link href={`${WEBSITE_SHOP}?category=hoodies`} className=' text-muted-foreground'>Hoodies</Link>
                    <Link href={`${WEBSITE_SHOP}?category=oversized`} className=' text-muted-foreground'>Oversized</Link>
                    <Link href={`${WEBSITE_SHOP}?category=full-sleeves`} className=' text-muted-foreground'>Full Sleeves</Link>
                    <Link href={`${WEBSITE_SHOP}?category=polo`} className=' text-muted-foreground'>Polo</Link>
                </div>
                <div className=' flex flex-col gap-2'>
                    <div className=' text-2xl uppercase font-semibold'>Userfull Links</div>
                    <Link href={WEBSITE_HOME} className=' text-muted-foreground'>Home</Link>
                    <Link href={WEBSITE_SHOP} className=' text-muted-foreground'>Shop</Link>
                    <Link href={WEBSITE_ABOUT} className=' text-muted-foreground'>About</Link>
                    <Link href={WEBSITE_REGISTER} className=' text-muted-foreground'>Register</Link>
                    <Link href={WEBSITE_LOGIN} className=' text-muted-foreground'>Login</Link>
                </div>
                <div className=' flex flex-col gap-2'>
                    <div className=' text-2xl uppercase font-semibold'>Help Center</div>
                    <Link href={WEBSITE_REGISTER} className=' text-muted-foreground'>Register</Link>
                    <Link href={WEBSITE_LOGIN} className=' text-muted-foreground'>Login</Link>
                    <Link href={USER_DASHBOARD} className=' text-muted-foreground'>My Account</Link>
                    <Link href={WEBSITE_PRIVATE_POLICY} className=' text-muted-foreground'>Privacy Policy</Link>
                    <Link href={WEBSITE_TERMS} className=' text-muted-foreground'>Terms & Conditions</Link>
                </div>
                <div className=' flex flex-col gap-2'>
                    <div className=' text-2xl uppercase font-semibold'>Contact Us</div>
                        <div className=' flex items-start gap-2 text-muted-foreground'><IoLocationOutline size={30}/> E-store market Lucknow, India 256320</div>
                        <div className=' flex items-start gap-2 text-muted-foreground'><IoCallOutline size={20}/> <span className=' hover:text-primary hover:cursor-pointer'>+91-1234567890</span></div>
                        <div className=' flex items-start gap-2 text-muted-foreground'><IoMailOutline size={20}/> <span className=' hover:text-primary hover:cursor-pointer'>support@estore.com</span></div>
                        <div className=' text-muted-foreground text-2xl flex items-center justify-between mt-2'>
                                  <AiOutlineYoutube className=' hover:cursor-pointer hover:text-primary'/>
                                  <FaInstagram className=' hover:cursor-pointer hover:text-primary'/>
                                  <RiFacebookCircleLine className=' hover:cursor-pointer hover:text-primary'/>
                                  <FiTwitter className=' hover:cursor-pointer hover:text-primary'/>
                                  <FaWhatsapp className=' hover:cursor-pointer hover:text-primary'/>
                        </div>
                </div>
               </div>
               <div className=' w-full text-center py-4 bg-border text-xl'>
                © 2025 Estore. All Rights Reserved.
               </div>
    </footer>
  )
}

export default Footer