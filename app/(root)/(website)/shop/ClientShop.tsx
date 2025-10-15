"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductBox, { ProductBoxProps } from "@/components/Application/Website/ProductBox";
import LoadingBtn from "@/components/Application/LoadingBtn";
import LoadingGIF from "@/components/Application/LoadingGIF";

interface ClientShopProps {
  limit: number;
  sorting: string;
}

export default function ClientShop({ limit, sorting }: ClientShopProps) {
  const params = useSearchParams().toString();

  async function fetchProduct(page: number) {
    const { data: response } = await axios.get(
      `/api/shop/get-product?page=${page}&&limit=${limit}&&sorting=${sorting}&&${params}`
    );

    if (!response.success) throw new Error(response.message);

    return {
      productData: response.data.productData,
      hasMore: response.data.hasMore,
    };
  }

  const {
    data,
    status,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    error,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["ShopProduct", limit, sorting, params],
    queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length : undefined),
  });

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:gap-10 gap-5">
      {status === "pending" ? (
        <div>
          <LoadingGIF />
        </div>
      ) : status === "error" ? (
        <div>{error.message}</div>
      ) : (
        data &&
        data.pages.map((page) =>
          page.productData.map((product: ProductBoxProps, index: number) => (
            <ProductBox product={product} key={index} />
          ))
        )
      )}

      {hasNextPage && !isFetching && (
        <LoadingBtn
          text="Load More"
          className="w-fit"
          type="button"
          disable={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      )}
    </div>
  );
}
