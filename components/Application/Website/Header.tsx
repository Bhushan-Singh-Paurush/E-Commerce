"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo_black from "@/public/assets/images/logo-black.png";
import logo_white from "@/public/assets/images/logo-white.png";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import Cart from "./Cart";
import { useSession } from "next-auth/react";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";
import { WEBSITE_ABOUT, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from "@/routes/WebsiteRoutes";
import user from "@/public/assets/images/user.png";
import { LuCircleUser } from "react-icons/lu";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import ThemeSwitch from "../Admin/ThemeSwitch";
import Search from "./Search";

const Header = () => {
  const{data:session,status}= useSession();
  const [isMobileView, setIsMobilView] = useState(false);
  const[isShow,setIsShow]=useState(false)

  return (
    <div className=" w-full border-b-[1px] border-border">
    <div className=" relative w-full py-4 lg:px-32 md:px-24 px-4 flex justify-between items-center">
      <div>
        <Image
          src={logo_black}
          width={100}
          alt="logo black"
          className=" dark:hidden"
        />
        <Image
          src={logo_white}
          width={100}
          alt="logo white"
          className="hidden dark:block"
        />
      </div>

      <nav>
        <ul
          className={`flex lg:flex-row lg:items-center lg:gap-10 text-muted-foreground lg:relative absolute lg:w-fit w-full lg:h-fit h-screen top-0 lg:left-0  flex-col gap-5 bg-background z-50 ${isMobileView ? "left-0" : "-left-[100vw]"}`}
        >
          <div className=" bg-muted lg:hidden flex items-center justify-between border-[1px] border-border px-4 py-4">
            <Image
              src={logo_black}
              width={100}
              alt="logo black"
              className=" dark:hidden"
            />
            <Image
              src={logo_white}
              width={100}
              alt="logo white"
              className="hidden dark:block"
            />
            <button className=" hover:text-primary text-2xl transition-all duration-200" onClick={()=>setIsMobilView(!isMobileView)}><IoMdClose/></button>
          </div>

          <li>
            <Link
              href={WEBSITE_HOME}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={WEBSITE_ABOUT}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href={WEBSITE_SHOP}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href={`${WEBSITE_SHOP}?category=t shirt`}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              T-Shirt
            </Link>
          </li>
          <li>
            <Link
              href={`${WEBSITE_SHOP}?category=hoodies`}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              Hoodies
            </Link>
          </li>
          <li>
            <Link
              href={`${WEBSITE_SHOP}?category=oversized`}
              className=" hover:font-semibold transition-all duration-200 text-lg hover:text-primary"
            >
              Oversized
            </Link>
          </li>
        </ul>
      </nav>

      <div className=" text-2xl font-semibold flex items-center gap-8 text-muted-foreground">
        <button type="button" onClick={()=>setIsShow(!isShow)}>
          <BiSearch />
        </button>
        <Cart />

        <ThemeSwitch/>

        {session ? (
          <Link href={ADMIN_DASHBOARD}>
            <Image
              src={session?.user?.image || user.src}
              alt="Login"
              width={30}
              height={30}
              className=" min-w-8 h-8 rounded-full"
            />
          </Link>
        ) : (
          <Link href={WEBSITE_LOGIN}>
            <LuCircleUser />
          </Link>
        )}

        <button className=" lg:hidden block" onClick={()=>setIsMobilView(!isMobileView)}>
          <IoMdMenu />
        </button>
      </div>
    </div>

    <Search isShow={isShow}/>
  </div>  
  );
};

export default Header;
