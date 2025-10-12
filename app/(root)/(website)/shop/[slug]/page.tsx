import ProductDetail from "@/components/Application/Website/ProductDetail";
import axios from "axios";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {
  const getParams = await params;

  const slug = getParams.slug;

  const getSearchParams = await searchParams;

  const color = getSearchParams.color;

  const size = getSearchParams.size;

  let url = `${process.env.NEXT_PUBLIC_URL}/api/shop/${slug}`;

  const query: string[] = [];

  if (color) query.push(`color=${color}`);

  if (size) query.push(`size=${size}`);

  if (query.length > 0) url = url + `?${query.join("&")}`;


  
  const { data: response } = await axios.get(url);

  if (!response.success)
    return <div className=" text-4xl w-full text-center">No data found</div>;

  
  return (
    <ProductDetail
      product={response?.data?.product}
      colors={response?.data?.colors}
      sizes={response?.data?.sizes}
      variant={response?.data?.variant}
      review={response?.data?.review}
    />
  );
};

export default page;
