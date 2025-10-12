"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { RiMenu4Fill } from "react-icons/ri";
import ThemeSwitch from './ThemeSwitch';
import DropDown from './DropDown';
import { useSidebar } from '@/components/ui/sidebar';
import SearchBar from './SearchBar';
import Image from 'next/image';
import logo_black from "@/public/assets/images/logo-black.png"
import logo_white from "@/public/assets/images/logo-white.png"
import MobileSearchBar from './MobileSearchBar';
export const Topbar = () => {
  const{toggleSidebar}=useSidebar()
  return (
    <div className=' bg-sidebar dark:bg-card h-14 fixed z-30 flex justify-between items-center border-b-[1px] w-full md:w-[calc(100%-16rem)] px-4'>
          <div className='md:hidden flex items-center justify-between w-full '>
                      <Image src={logo_black} width={100} alt='logo black' className=' dark:hidden'/>
                      <Image src={logo_white} width={100} alt='logo white' className='hidden dark:block'/> 
                  </div>
          <div className='hidden md:block w-full'><SearchBar/></div>
        <div className=' flex items-center gap-4'>
          <MobileSearchBar/>
          <ThemeSwitch/>
           <DropDown/>
          <Button onClick={toggleSidebar} className=' md:hidden block'><RiMenu4Fill/></Button>

        </div>
        </div>
  )
}
