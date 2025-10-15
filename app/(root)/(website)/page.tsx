import Banner from "@/components/Application/Website/Banner";
import FeaturedProducts from "@/components/Application/Website/FeaturedProducts";
import SlideMenu from "@/components/Application/Website/SlideMenu";
import React from "react";
import advertising_banner from "@/public/assets/images/advertising-banner.png";
import Image from "next/image";
import Review from "@/components/Application/Website/Review";
import Support from "@/components/Application/Website/Support";
const Page = () => {
  return (
    <div>
      <section>
        <SlideMenu />
      </section>
      <section>
        <Banner />
      </section>

      <section>
        <FeaturedProducts />
      </section>

      <section className=" w-full py-10">
        <Image
          src={advertising_banner}
          alt="advertising_banner"
          width={advertising_banner.width}
          height={advertising_banner.height}
        />
      </section>

      <section>
        <Review />
      </section>

      <section>
        <Support/>
      </section>
    </div>
  );
};

export default Page;
