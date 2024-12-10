import React from 'react'
import { TbError404 } from "react-icons/tb";
import { TbFaceIdError } from "react-icons/tb";

const NotFound = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <TbFaceIdError className='text-9xl text-gray-400'/>
        <div className='flex items-center justify-center gap-1'>
            <TbError404 className='text-gray-500 text-2xl'/>
            <span className='text-lg font-bold text-black'>Not Found</span>
        </div>
    </div>
  )
}

export default NotFound