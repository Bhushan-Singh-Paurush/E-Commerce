
import { sortingData } from "@/lib/utils";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";
interface IFilterationProps {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  sorting: string;
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  isMobileView: boolean;
  setIsMobileView: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filteration = (props:IFilterationProps) => {
  return <div className=" bg-muted rounded-sm p-2 sm:p-4 flex items-center justify-between w-full">
            
            
            <Button variant="secondary" className=" lg:hidden flex items-center gap-2" onClick={()=>props.setIsMobileView(!props.isMobileView)}><IoFilterSharp/><div>Filter</div></Button>
            
            
            <div className=" flex items-center gap-2"> 
               <h4 className=" text-lg font-semibold">Show</h4>
               <div className=" flex gap-2">{[9,12,18,24].map((item,index)=>(
                <button onClick={()=>props.setLimit(item)} className={`${props.limit===item ? " bg-primary" : " bg-border"} rounded-full w-[30px] h-[30px]`} key={index}>{item}</button>
               ))}</div>
            </div>


      <Select defaultValue={props.sorting} onValueChange={(value)=>props.setSorting(value)}>
         <SelectTrigger className=" w-[100px] sm:w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
         <SelectGroup >
            {sortingData.map((item,index)=>(
                <SelectItem  key={index} value={item.value}>{item.title}</SelectItem>
            ))}
          </SelectGroup>
      </SelectContent>
    </Select>

  </div>;
}

export default Filteration;
