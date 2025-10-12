"use client"
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"
import slider1 from "@/public/assets/images/slider-1.png"
import slider2 from "@/public/assets/images/slider-2.png"
import slider3 from "@/public/assets/images/slider-3.png"
import slider4 from "@/public/assets/images/slider-4.png"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

function NextArrow(props:any){
        const{onClick}=props
    
        return <Button onClick={onClick} variant="secondary" size="icon" className=" absolute right-2 z-10 top-[50%] rounded-full">
      <ChevronRightIcon />
    </Button>
    
    }
function PrevArrow(props:any){
        const{onClick}=props
    
        return <Button onClick={onClick} variant="secondary" size="icon"className=" absolute top-[50%] z-10 left-2  rounded-full" >
      <ChevronLeftIcon />
    </Button>
    
    }

const SlideMenu = () => {
    const  settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    nextArrow:<NextArrow/>,
    prevArrow:<PrevArrow/>
    
  };
    return (
     <Slider {...settings}>
                <Image src={slider1.src} width={slider1.width} height={slider1.height} alt='slider1'/>
                <Image src={slider2.src} width={slider2.width} height={slider2.height} alt='slider2'/>
                <Image src={slider3.src} width={slider3.width} height={slider3.height} alt='slider3'/>
                <Image src={slider4.src} width={slider4.width} height={slider4.height} alt='slider4'/>
     </Slider>
  )
}

export default SlideMenu