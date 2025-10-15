import {Bounce, toast} from "react-toastify"
export default function toastFunction({type,message}:{type:string,message:string}){
                const options={
                            autoClose: 1000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                            }

                switch (type) {
                    case "info": toast.info(message,options)
                                 break;
                    case "success": toast.success(message,options)
                                 break;
                    case "error": toast.error(message,options)
                                 break;
                                    
                    default:toast(message,options)
                                 break;
                }
}