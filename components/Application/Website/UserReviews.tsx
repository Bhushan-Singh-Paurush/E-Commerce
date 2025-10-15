import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingGIF from "../LoadingGIF";
dayjs.extend(relativeTime);
interface Reviews {
  rating: number;
  review: string;
  title: string;
  createdAt: Date;
  userName: string;
  avatar: {
    url?:string
  };
}
import image_placeholder from "@/public/assets/images/img-placeholder.webp";
const UserReviews = ({ productId }: { productId: string }) => {
  async function getAllUserReview(page: number) {
    const { data: response } = await axios.get(
      `/api/review/get-product-review/${productId}?page=${page}&limit=10`
    );

    if (!response.success) throw new Error(response.message);
    return {
      allReviews: response.data.allReviews,
      hasMore: response.data.hasMore,
    };
  }

  const { data, status } = useInfiniteQuery({
    queryKey: ["userReview"],
    queryFn: async ({ pageParam }) => getAllUserReview(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.hasMore : undefined;
    },
  });

  return (
    <div className=" my-4 border-t-[1px] border-border py-4">
      {status === "pending" ? (
        <LoadingGIF />
      ) : status === "error" ? (
        <></>
      ) : (
        <div>
          {data && data.pages[0].allReviews.length > 0 && (
            <div className=" flex flex-col gap-4">
              <div className=" text-2xl font-semibold">
                {data.pages[0].allReviews.length} Reviews
              </div>
              <div>
                {data.pages[0].allReviews.map(
                  (item: Reviews, index: number) => (
                    <div key={index} className=" flex items-start gap-2">
                      <Image
                        src={item?.avatar?.url || image_placeholder}
                        width={50}
                        height={50}
                        className=" w-10 h-10  rounded-full"
                        alt="user_img"
                      />
                      <div>
                        <div className=" font-semibold capitalize">
                          {item.title}
                        </div>
                        <div>
                          {item.userName}{" "}
                          <span className=" text-muted-foreground">
                            {dayjs(item.createdAt).fromNow()}
                          </span>
                        </div>
                        <div className=" mt-2 text-muted-foreground">
                          {item.review}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
