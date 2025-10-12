import React from 'react'
import WebsiteSidebar from './WebsiteSidebar'

const WebsiteLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <div className='w-full lg:px-32 md:px-24 px-4 py-10 flex flex-col lg:flex-row items-start gap-4 justify-between'>
            <WebsiteSidebar/>
            <div className=' w-full lg:w-[75%]'>{children}</div>
    </div>
  )
}

export default WebsiteLayout