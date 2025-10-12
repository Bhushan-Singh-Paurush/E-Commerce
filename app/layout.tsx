import type { Metadata } from "next";
import {Inter,Roboto} from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "@/redux/Providers";
import { ThemeProvider } from "@/components/Application/Admin/ThemeProvider";
import { Bounce} from 'react-toastify';
const roboto=Roboto({
  subsets:["latin"],
  variable:"--font-roboto",
  weight:["100","200","300","400","500","600","700","800","900"]
})

const inter=Inter({
  subsets:["latin"],
  variable:"--font-inter",
  weight:["100","200","300","400","500","600","700","800","900"]
})

// app/layout.js
export const metadata:Metadata = {
  title: "Men's Fashion Store | Trendy Men's Clothing Online",
  description:
    "Shop the latest men's clothing online — shirts, jeans, jackets, t-shirts, and more. Premium quality, best prices, and fast delivery.",
  keywords:
    "men's fashion, men's clothing, t-shirts, jeans, shirts, jackets, men's wear, online store, men's style",
  openGraph: {
    title: "Men's Fashion Store | Trendy Men's Clothing Online",
    description:
      "Discover top-quality men's clothing — from casual t-shirts to formal wear. Shop online with exclusive offers!",
    url: `${process.env.NEXT_PUBLIC_URL}`,
    siteName: "Men's Fashion Store",
    images: [
      {
        url: "https://res.cloudinary.com/dgeumzbuo/image/upload/v1760284253/ChatGPT_Image_Oct_12_2025_09_17_11_PM_suwesn.png",
        width: 1200,
        height: 630,
        alt: "Men's Fashion Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/assets/images/favicon.ico",
  },
};


export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
     
      <body
        className={`${roboto.variable} `}
      >
        
         <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange

    >
        
        <Providers>
       <ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Bounce}
/>
        
        
        {children}
        </Providers>


        </ThemeProvider>

      </body>
      
    </html>
  );
}
