"use client"
import React from 'react'
import loading from "@/public/assets/images/loading.svg";
import Image from 'next/image';
const LoadingGIF = () => {
  return (
    <div className=' w-full h-full flex items-center justify-center'>
            <Image src={loading} width={100} height={100} alt='Loading...'/>
    </div>
  )
}

export default LoadingGIF
