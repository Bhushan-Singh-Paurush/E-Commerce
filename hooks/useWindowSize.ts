import { useLayoutEffect, useState } from "react";

export default function useWindowSize() {
    const[size,setSize]=useState<{width:number,height:number}>({width:0,height:0})


    useLayoutEffect(()=>{
    
    function handleSize(){
        setSize({width:window.innerWidth,height:window.innerHeight})
    }    

    handleSize()

    window.addEventListener("resize",handleSize)

    return ()=>{
        window.removeEventListener("resize",handleSize)
    }

    },[])

    return size
}