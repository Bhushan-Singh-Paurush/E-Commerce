"use client"
import { Button } from "@/components/ui/button";
import toastFunction from "@/lib/toastFunction";
import axios from "axios";
import {CldUploadWidget} from "next-cloudinary"
import { FiPlus } from "react-icons/fi";
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';
// Minimal fields you care about
export interface UploadInfo {
  asset_id: string;
  public_id: string;
  path?: string;
  thumbnail_url?: string;
  secure_url: string;
}

// Each file returned by Cloudinary
interface UploadedFile {
  uploadInfo: UploadInfo;
  [key: string]: unknown; // extra fields
}

const UploadMedia=({isMulti=true}:{isMulti:boolean})=>{

function handleError(error:unknown){
     if (error instanceof Error) {
    toastFunction({ type: "error", message: error.message });
  } else {
    toastFunction({ type: "error", message: "An unknown error occurred" });
  }

          
}

async function handleQueuesEnd(result:CloudinaryUploadWidgetResults){
       const files=Array.isArray(result.info) ? result.info : []
       const data = files.map((file:UploadedFile)=>file.uploadInfo).map((uploadInfo:UploadInfo)=>(
        {
            asset_id:uploadInfo.asset_id,
            public_id:uploadInfo.public_id,
            path:uploadInfo.path,
            thumbnail_url:uploadInfo.thumbnail_url,
            secure_url:uploadInfo.secure_url

        }
      ))

      if(data && data.length>0)
      {
        try {
          const{data:response}=await axios.post("/api/media/create",data)

          if(!response.success){
            toastFunction({type:"error",message:response.message})
            return ;
          }  
          toastFunction({type:"success",message:response.message})
        } catch (error) {
          toastFunction({type:"error",message:(error as Error).message})
        }
      }
}

return(
<CldUploadWidget signatureEndpoint={"/api/sign-cloudinary-params"}
uploadPreset={process.env.NEXT_PUBLIC_PRESET}
onError={handleError}
onQueuesEnd={handleQueuesEnd}
config={
    {
        cloud:{
            cloudName:process.env.NEXT_PUBLIC_CLOUD_NAME,
            apiKey:process.env.NEXT_PUBLIC_API_KEY
        }
    }    
       }

options={
    {
        sources:["local","url","unsplash","google_drive"],
        multiple:isMulti
    }
}       

>

 {({ open }) => {
    return (
      <Button className="button" onClick={() => open()}>
       <FiPlus/> Upload
      </Button>
    );
  }}

</CldUploadWidget>
);
}
export default UploadMedia