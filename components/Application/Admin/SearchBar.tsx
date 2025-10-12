import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { BiSearch } from "react-icons/bi";
import SearchModal from './SearchModal';
const SearchBar = () => {
    const[open,setOpen]=useState(false)
    return (
    <div className=' w-[30%] relative'>
         <Input placeholder='Search...' onClick={()=>setOpen(!open)} readOnly className='  rounded-4xl'/>
         <div className=' absolute right-2 top-[25%] text-xl text-muted-foreground'><BiSearch/></div>
         <SearchModal open={open} setOpen={setOpen}/>
    </div>
  )
}

export default SearchBar
