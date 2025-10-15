"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, {useState } from "react";
import loadingImg from "@/public/assets/images/loading.svg";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
interface MediaModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: Array<{
    _id: string;
    secure_url: string;
  }>;
  setSelected: React.Dispatch<React.SetStateAction<{
    _id: string;
    secure_url: string;
  }[]>>;
  isMulti: boolean;
}
const MediaModal = ({
  open,
  setOpen,
  selected,
  setSelected,
  isMulti,
}: MediaModalProps) => {
  const [current, setCurrent] = useState<Array<{ _id: string; secure_url: string }>>(selected)

  const { data, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["mediaModal"],
    queryFn: async ({ pageParam }) => {
      const { data: response } = await axios.get(
        `/api/media/get-media?page=${pageParam}&limit=18&deleteType=SD`
      );

      if (!response.success) throw new Error(response.message);

      return {
        mediaDate: response.mediaData,
        hasMore: response.hasMore,
      };
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
  });

  function handleCheckbox({
    _id,
    secure_url,
  }: {
    _id: string;
    secure_url: string;
  }) {
    if (current.find((ele) => ele._id == _id)) {
      const option = current.filter((ele) => ele._id !== _id);
      setCurrent(option);
    } else {
      if (isMulti) setCurrent((pre) => [...pre, { _id, secure_url }]);
      else setCurrent([{ _id, secure_url }]);
    }
  }

  function handleSelect(){
           setSelected(current)
           setOpen(false)
  }

  function clearAll(){
           setSelected([])
           setCurrent([])
           setOpen(false)
  }

  function closeHandler(){
           
           setCurrent(selected)
           setOpen(false)
  }

  return (<Dialog open={open} onOpenChange={() => setOpen(!open)}>
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-[80%] h-[500px] max-h-[80vh]  flex flex-col gap-4 sm:gap-0 rounded-xl p-0"
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
    >
      <DialogHeader className="h-10 p-6 dark:bg-card flex justify-center rounded-tr-xl rounded-tl-xl sm:border-b-[1px] border-border">
        <DialogTitle className=" text-2xl">Media Selection</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6 md:grid-cols-4 h-[calc(100%-80px)] overflow-y-auto">
        {isLoading ? (
          <Image src={loadingImg} width={100} height={100} alt="Loading..." />
        ) : isError ? (
          <>{error.message}</>
        ) : (
          <>
            {data &&
              data.pages?.[0].mediaDate.map((media:{_id:string,secure_url:string}) => (
                <label
                  key={media._id}
                  onClick={() =>
                    handleCheckbox({
                      _id: media._id,
                      secure_url: media.secure_url,
                    })
                  }
                  htmlFor={media._id}
                  className=" relative border-[1px] border-border"
                >
                  <Checkbox
                    className=" w-4 h-4 top-2 left-2 absolute z-30 border-[1px]  border-primary"
                    checked={
                      current.find((ele) => ele._id == media._id)
                        ? true
                        : false
                    }
                  />
                  <Image
                    src={media.secure_url}
                    width={150}
                    height={150}
                    alt="Image"
                  />
                </label>
              ))}
          </>
        )}
      </div>

      <DialogFooter className="h-10 w-full p-6 dark:bg-card sm:border-t-[1px] border-border rounded-br-xl rounded-bl-xl">
        <div className=" w-full flex items-center justify-between">
          <Button variant="destructive" onClick={clearAll}>Clear All</Button>
          <div className=" flex items-center gap-4">
            <Button variant="secondary" onClick={closeHandler}>Close</Button>
            <Button onClick={handleSelect}>Select All</Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>);
};

export default MediaModal;
