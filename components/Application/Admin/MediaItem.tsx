import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toastFunction from "@/lib/toastFunction";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanelRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
interface IMedia{
    secure_url:string
    _id:string
}
const MediaItem = ({
  file,
  selected,
  setSelected,
  deleteType,
  handleDelete
}: {
  file: IMedia;
  selected: Array<string>;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  deleteType: string;
  handleDelete:({ids,deleteType}:{ids:Array<string>,deleteType:string})=>void
}) => {

  async function handleMediaCopy(){
        await navigator.clipboard.writeText(file.secure_url)
        toastFunction({type:"success",message:"Link copyed"})
  }
  function handleCheck(){
        if(selected.includes(file._id))
          setSelected(selected.filter((id)=>id!==file._id))
        else
          setSelected((pre:string[])=>[...pre,file._id]) 
  }
  return (
    <div className="w-[200] h-[200px] p-4 rounded-xl border-[1px] dark:border-gray-800 border-gray-300 relative">
      
          <Checkbox
          checked={selected.includes(file._id)}
          onClick={handleCheck}
           className=" w-5 h-5 border-primary  absolute top-4 left-4 z-10"
          />
      
        <div className="absolute w-full rounded-xl h-full top-0 left-0  hover:bg-black/10 transition-all duration-200 ease-in"></div>  
      <div className=" absolute right-4 top-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className=" w-7 h-7 rounded-full bg-gray-400 opacity-60 flex justify-center items-center text-white">
              <BsThreeDotsVertical />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {deleteType==="SD" && 
            
            <>
            <DropdownMenuItem asChild>
              <Link href={ADMIN_MEDIA_EDIT(file._id)}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMediaCopy}>Link</DropdownMenuItem>
            </>
            
            }
            
            { deleteType==="SD" ?<DropdownMenuItem onClick={()=>handleDelete({ids:[file._id],deleteType:deleteType})}>Move to Trash</DropdownMenuItem> : 
            
            <DropdownMenuItem onClick={()=>handleDelete({ids:[file._id],deleteType:deleteType})}>Delete Parmenent</DropdownMenuItem>}

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
       
      <Image
        src={file.secure_url}
        width={200}
        height={200}
        className=" w-[150px] h-[170px] bg-cover bg-center"
        alt="Image"
      />

    </div>
  );
};

export default MediaItem;
