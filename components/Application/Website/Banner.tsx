import Image from "next/image";
import React from "react";
import banner1 from "@/public/assets/images/banner1.png";
import banner2 from "@/public/assets/images/banner2.png";
const Banner = () => {
  return (
    <div className="w-full py-10 lg:px-32 md:px-24 px-4 flex items-center justify-between">
      <Image
        src={banner1.src}
        width={banner1.width}
        height={banner1.height}
        alt="banner1"
        className=" w-[48%] h-auto rounded-xl hover:scale-105 transition-all duration-200"
      />
      <Image
        src={banner2.src}
        width={banner2.width}
        height={banner2.height}
        alt="banner2"
        className=" w-[48%] h-auto rounded-xl hover:scale-105 transition-all duration-200"
      />
    </div>
  );
};

export default Banner;
