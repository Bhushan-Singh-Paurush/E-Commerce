"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import verifiedImg from "@/public/assets/images/verified.gif"
import verificationFailedImg from "@/public/assets/images/verification-failed.gif"
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WEBSITE_HOME } from '@/routes/WebsiteRoutes';

function Page() {
    const {token}=useParams<{token:string}>();
    const[isVerify,setIsVerify]=useState(false)

    useEffect(()=>{
        (async()=>{
          
         try {
          const{data}=await axios.post("/api/auth/verify-email",{token})
          if(data.success)
             setIsVerify(true);
         } catch (error) {
          alert((error as Error).message)
         }

        })();

    },[token])
    return (
    <div className=' w-[100vw] h-[100vh] flex justify-center items-center'>
           <Card>
           <CardContent>
            {isVerify ? 
            <div className=' flex flex-col items-center gap-4 text-bold text-2xl'>
           <Image src={verifiedImg} width={100}  alt='verified Img'/>
            <p>Email verification success</p>
            <Button asChild>
              <Link href={WEBSITE_HOME}>Continue Shopping</Link>
            </Button>
            </div> 
            
            : 
            
            <div className=' flex flex-col items-center gap-4 text-bold text-2xl'>
           <Image src={verificationFailedImg} width={200} alt='verification Failed Img'/>
            <p>Email verification failed</p>
            <Button asChild>
              <Link href={WEBSITE_HOME}>Continue Shopping</Link>
            </Button>
            </div>
            }
            </CardContent> 
           </Card>  
    </div>
  )
}

export default Page
