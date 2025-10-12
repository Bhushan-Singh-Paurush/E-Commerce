"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsChatQuote } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from "@mui/material";
import useWindowSize from "@/hooks/useWindowSize";
const Review = () => {
  const { file } = useFetch({ url: "/api/website/get-reviews" });
  const [response, setResponse] = useState<Array<Record<string, any>>>([]);
  useEffect(() => {
    if (file && file.success) setResponse(file.data);
  }, [file]);
  const windowSize=useWindowSize()
  const[slidesToShow,setSlidesToShow]=useState(3)

  useEffect(()=>{
     if(windowSize.width>=1024)
      setSlidesToShow(3)
    else if(windowSize.width>=768)
      setSlidesToShow(2)
    else
      setSlidesToShow(1)

  },[windowSize])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1
  };
  
  return (
    <>

   {response.length>0 && <div className="  w-full flex flex-col gap-8 py-10 lg:px-32 md:px-24 px-4">
      <h1 className=" text-4xl font-semibold text-center w-full">
        Customer Review
      </h1>
      <Slider className="slider" {...settings}>
       
          {response.map((item, index) => (
            <Card className=" h-[200px]" key={index}>
              <CardHeader>
                <CardTitle>
                  <BsChatQuote size={24} />
                </CardTitle>
                <CardDescription className=" my-2">{item.review.split(" ").slice(0,25).join(" ")}{item.review.split(" ").length>25 ? "..." : ""}</CardDescription>
              </CardHeader>
              <CardContent className=" flex flex-col gap-2">
                 <h2 className=" font-semibold text-lg">{item?.user?.name}</h2>
                 <Rating size={`medium`} readOnly value={item?.rating || 0}/>
              </CardContent>
            </Card>
          ))}
      </Slider>
    </div>}</>
  );
};

export default Review;
