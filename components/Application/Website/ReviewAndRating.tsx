import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Rating } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import WriteReview from "./WriteReview";
import UserReviews from "./UserReviews";
interface IRatingData {
  rating: number;
  count: number;
}
const ReviewAndRating = ({
  productId,
  review,
}: {
  productId: string;
  review: {
    average: number;
    count: number;
  };
}) => {
  const[ratingData,setRatingData]=useState<Array<{star:number,starValue:number}>>([])
  const[addReview,setAddReview]=useState(false)
  const{data:Session}=useSession()
  useEffect(() => {
    (async () => {
      try {
        const { data: response } = await axios.get(
          `/api/shop/get-rating?productId=${productId}`
        );
         
        

          const total = response.data.reduce(
            (acc:number, curr: IRatingData) => acc + curr.count,
            0
          );


          const data = [5, 4, 3, 2, 1].map((ele) => {
            const result = response.data.filter(
              (item: IRatingData) => item.rating === ele
            );

            if (result.length > 0)
              return {
                star: ele,
                starValue: (result[0].count / total) * 100,
              };
            else return {
                star: ele,
                starValue:0,
            };
          });
        setRatingData(data);


      } catch (error) {
        console.log(error)
      }
    })();
  }, [productId]);

  return (
    <Card className=" p-0 rounded-sm">
      <CardContent className="p-0">
        <CardHeader className="border-b-[1px] border-border p-0 bg-muted">
          <div className=" text-2xl font-semibold p-2 ">Review & Rating</div>
        </CardHeader>
        <div className=" p-4 flex flex-col gap-4">
          {/* rating section */}
          <div className=" w-full flex flex-col gap-8 md:gap-0 md:flex-row items-center justify-between">
            {/* left section */}
            <div className=" flex w-[100%] md:w-[50%] flex-col sm:flex-row items-center gap-4">
              <div className=" flex flex-col gap-2">
                <div className=" text-8xl font-semibold">
                  {review.average !== 0 ? review.average : "0.0"}
                </div>
                <Rating  size="large" readOnly value={review.average} />
                <div>({review?.count} Reviews & Rating)</div>
              </div>

              <div className=" w-full">
                {ratingData.length>0 && ratingData.map((ele,index)=>(
                    <div key={index} className="w-full flex items-center gap-2">
                        <div>{ele.star}</div>
                        <IoIosStar/>
                        <div className=" w-full"><Progress value={ele.starValue} className="w-[80%]"/></div>
                        
                    </div>
                ))}
              </div>
            </div>

            <Button variant="secondary" className=" p-8" onClick={()=>setAddReview(!addReview)}>Write Review</Button>
          </div>

          {addReview && Session ? <WriteReview userId={Session.user.id} productId={productId}/> : <></>}
        
        <UserReviews productId={productId}/>
        
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewAndRating;
