import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { BiSearch } from "react-icons/bi";
import SearchModal from './SearchModal';
const MobileSearchBar = () => {
  const[open,setOpen]=useState(false)  
  return (
    <div className=' block md:hidden'>
       <Button variant="ghost" onClick={()=>setOpen(!open)} className=' text-2xl text-muted-foreground'>
        <BiSearch/>
        </Button>
        <SearchModal open={open} setOpen={setOpen}/>
    </div>
  )
}

export default MobileSearchBar